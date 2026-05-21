-- ═══════════════════════════════════════════════════════════════════════════
-- WhatsApp Business API — preferencias de notificación por canal
-- 2026-05-21
--
-- En LATAM WhatsApp rinde ~5× más que email. Esta migración añade soporte
-- para que cada subscriber elija recibir notificaciones de nuevos posts por:
--   - Email (canal por defecto, lógica actual con Resend)
--   - WhatsApp (vía WhatsApp Cloud API, templates aprobados)
--   - Ambos (email + whatsapp en paralelo)
--
-- Decisiones de diseño:
--   1. Las preferencias viven en sala_subscriptions porque son POR SUSCRIPCIÓN
--      (un usuario puede querer WhatsApp para creador A y email para B).
--   2. El phone_number se guarda en sala_profiles (es del usuario, no de la
--      suscripción). Esto evita duplicar el número en cada fila.
--   3. La verificación es a nivel profile, no de suscripción.
--   4. RLS estricto: solo el dueño del profile/suscripción puede leer/escribir
--      su teléfono y sus preferencias.
--   5. Logging de notificaciones en sala_notification_log para analytics y
--      detección de problemas de entrega.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Phone + verificación en sala_profiles ─────────────────────────────────
alter table public.sala_profiles
  add column if not exists phone_number             text,
  add column if not exists phone_verified           boolean      not null default false,
  add column if not exists phone_verification_code  text,
  add column if not exists phone_verification_sent_at timestamptz,
  add column if not exists phone_verified_at        timestamptz,
  add column if not exists whatsapp_consent_at      timestamptz;

-- Validación de formato E.164 (+ seguido de 7 a 15 dígitos)
alter table public.sala_profiles
  drop constraint if exists sala_profiles_phone_e164_chk;
alter table public.sala_profiles
  add constraint sala_profiles_phone_e164_chk
  check (phone_number is null or phone_number ~ '^\+[1-9][0-9]{6,14}$');

-- Index parcial sobre phones verificados (lookup por delivery webhook)
create index if not exists sala_profiles_phone_verified_idx
  on public.sala_profiles (phone_number)
  where phone_verified = true;

-- ─── 2. Preferencia de canal en sala_subscriptions ───────────────────────────
alter table public.sala_subscriptions
  add column if not exists channel_preference text not null default 'email';

alter table public.sala_subscriptions
  drop constraint if exists sala_subscriptions_channel_chk;
alter table public.sala_subscriptions
  add constraint sala_subscriptions_channel_chk
  check (channel_preference in ('email','whatsapp','both'));

create index if not exists sala_subscriptions_channel_pref_idx
  on public.sala_subscriptions (channel_preference)
  where channel_preference <> 'email';

-- ─── 3. Log de notificaciones (tracking de entrega multi-canal) ──────────────
create table if not exists public.sala_notification_log (
  id              uuid primary key default gen_random_uuid(),
  subscriber_id   uuid not null references public.sala_profiles (id) on delete cascade,
  creator_id      uuid references public.sala_creators (id) on delete set null,
  post_id         uuid,
  channel         text not null check (channel in ('email','whatsapp','status')),
  status          text not null default 'queued'
    check (status in ('queued','sent','delivered','read','failed','opted_out')),
  provider_id     text,     -- ID del mensaje devuelto por Resend/WhatsApp
  error           text,
  retry_count     int  not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists sala_notification_log_subscriber_idx
  on public.sala_notification_log (subscriber_id, created_at desc);

create index if not exists sala_notification_log_creator_idx
  on public.sala_notification_log (creator_id, created_at desc);

create index if not exists sala_notification_log_status_idx
  on public.sala_notification_log (status)
  where status in ('failed','queued');

-- ─── 4. RLS ────────────────────────────────────────────────────────────────────
alter table public.sala_notification_log enable row level security;

drop policy if exists "subscriber sees own notification log" on public.sala_notification_log;
create policy "subscriber sees own notification log"
  on public.sala_notification_log
  for select
  using (subscriber_id = auth.uid());

drop policy if exists "service role manages notification log" on public.sala_notification_log;
create policy "service role manages notification log"
  on public.sala_notification_log
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Reforzar RLS de sala_profiles para columnas sensibles (phone)
-- La política existente ya restringe SELECT/UPDATE al dueño, así que las
-- columnas heredan automáticamente. Nada extra que añadir.

-- ─── 5. Helper view: % de suscriptores con WhatsApp habilitado por creador ────
create or replace view public.sala_creator_whatsapp_stats as
select
  s.creator_id,
  count(*) filter (where s.status = 'active') as total_active,
  count(*) filter (where s.status = 'active' and s.channel_preference in ('whatsapp','both')) as whatsapp_active,
  count(*) filter (where s.status = 'active' and s.channel_preference in ('email','both')) as email_active,
  case
    when count(*) filter (where s.status = 'active') = 0 then 0
    else round(
      100.0 * count(*) filter (where s.status = 'active' and s.channel_preference in ('whatsapp','both'))
      / count(*) filter (where s.status = 'active'),
      1
    )
  end as whatsapp_pct
from public.sala_subscriptions s
group by s.creator_id;

comment on column public.sala_profiles.phone_number is 'E.164 formatted phone (+CC...). RLS-protected.';
comment on column public.sala_subscriptions.channel_preference is 'email | whatsapp | both — preference for new-post notifications';
comment on table public.sala_notification_log is 'Multi-channel delivery tracking. No PII beyond subscriber_id FK.';
