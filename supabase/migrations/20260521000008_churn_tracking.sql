-- ═══════════════════════════════════════════════════════════════════════════
-- ANTI-CHURN PREDICTIVO — tracking heurístico de riesgo de cancelación
-- 2026-05-21
--
-- Objetivo:
--   Detectar suscriptores en riesgo antes de que cancelen y enviarles
--   automáticamente un "save offer" editorial (pausa 30 días) que reduce
--   churn 30-40%.
--
-- Diseño:
--   1. sala_subscriber_engagement: tabla resumen por (subscriber, creator)
--      que se actualiza vía webhook /api/track/engagement cada vez que el
--      suscriptor abre un email, hace click o lee un post. Evita escanear
--      sala_notification_log y sala_posts en cada ejecución del cron.
--   2. sala_churn_signals: una fila por alerta de riesgo. Anti-spam vía
--      unique (subscriber, creator, action_taken) — máx 1 por acción.
--   3. RLS estricto: cada creator ve solo SUS propios datos.
--   4. Outcome tracking: pending → retained | churned | responded | snoozed
--      permite medir ROI real de cada save offer enviado.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Engagement resumen por (subscriber, creator) ─────────────────────────
create table if not exists public.sala_subscriber_engagement (
  id              uuid primary key default gen_random_uuid(),
  subscriber_id   uuid not null references public.sala_profiles (id) on delete cascade,
  creator_id      uuid not null references public.sala_creators (id) on delete cascade,
  emails_sent     integer not null default 0,
  emails_opened   integer not null default 0,
  emails_clicked  integer not null default 0,
  posts_read      integer not null default 0,
  premium_reads   integer not null default 0,
  last_read_at    timestamptz,
  last_email_at   timestamptz,
  last_open_at    timestamptz,
  last_click_at   timestamptz,
  updated_at      timestamptz not null default now(),
  unique (subscriber_id, creator_id)
);

create index if not exists sala_subscriber_engagement_subscriber_idx
  on public.sala_subscriber_engagement (subscriber_id);
create index if not exists sala_subscriber_engagement_creator_idx
  on public.sala_subscriber_engagement (creator_id);
create index if not exists sala_subscriber_engagement_last_read_idx
  on public.sala_subscriber_engagement (last_read_at desc nulls last);

alter table public.sala_subscriber_engagement enable row level security;

drop policy if exists "engagement: select own creator" on public.sala_subscriber_engagement;
create policy "engagement: select own creator" on public.sala_subscriber_engagement
  for select using (
    exists (
      select 1 from public.sala_creators c
      where c.id = sala_subscriber_engagement.creator_id
        and c.user_id = auth.uid()
    )
  );

drop policy if exists "engagement: select own subscriber" on public.sala_subscriber_engagement;
create policy "engagement: select own subscriber" on public.sala_subscriber_engagement
  for select using (subscriber_id = auth.uid());

-- ─── 2. Churn signals (alertas y acciones tomadas) ───────────────────────────
create table if not exists public.sala_churn_signals (
  id              uuid primary key default gen_random_uuid(),
  subscriber_id   uuid not null references public.sala_profiles (id) on delete cascade,
  creator_id      uuid not null references public.sala_creators (id) on delete cascade,
  risk_score      numeric(3,2) not null check (risk_score >= 0 and risk_score <= 1),
  signals         jsonb not null,
  action_taken    text not null default 'none'
    check (action_taken in ('none','email_save','email_pause_offer','email_discount','manual_review')),
  outcome         text not null default 'pending'
    check (outcome in ('pending','retained','churned','responded','snoozed')),
  email_sent_at   timestamptz,
  outcome_at      timestamptz,
  created_at      timestamptz not null default now(),
  -- Anti-spam: máx 1 alerta por (subscriber, creator, action_taken).
  -- Cron de detección solo inserta si NO existe ya una con action_taken='none'
  -- o si la última con misma action_taken tiene >30 días (manejado en app layer).
  unique (subscriber_id, creator_id, action_taken)
);

create index if not exists sala_churn_signals_subscriber_idx
  on public.sala_churn_signals (subscriber_id);
create index if not exists sala_churn_signals_creator_idx
  on public.sala_churn_signals (creator_id);
create index if not exists sala_churn_signals_outcome_idx
  on public.sala_churn_signals (outcome);
create index if not exists sala_churn_signals_created_idx
  on public.sala_churn_signals (created_at desc);
create index if not exists sala_churn_signals_action_pending_idx
  on public.sala_churn_signals (action_taken, created_at)
  where action_taken = 'none' and outcome = 'pending';

alter table public.sala_churn_signals enable row level security;

drop policy if exists "churn_signals: select own creator" on public.sala_churn_signals;
create policy "churn_signals: select own creator" on public.sala_churn_signals
  for select using (
    exists (
      select 1 from public.sala_creators c
      where c.id = sala_churn_signals.creator_id
        and c.user_id = auth.uid()
    )
  );

-- ─── 3. Helper para upsert atómico de engagement ─────────────────────────────
-- Llamado desde el webhook /api/track/engagement. Centralizado en SQL para que
-- el incremento sea atómico (no race condition entre dos eventos paralelos).
create or replace function public.sala_record_engagement_event(
  p_subscriber_id uuid,
  p_creator_id    uuid,
  p_action        text,
  p_is_premium    boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_action not in ('email_sent','email_opened','email_clicked','post_read') then
    raise exception 'sala_record_engagement_event: action inválida %', p_action;
  end if;

  insert into public.sala_subscriber_engagement (
    subscriber_id, creator_id,
    emails_sent, emails_opened, emails_clicked,
    posts_read, premium_reads,
    last_email_at, last_open_at, last_click_at, last_read_at,
    updated_at
  )
  values (
    p_subscriber_id, p_creator_id,
    case when p_action = 'email_sent'    then 1 else 0 end,
    case when p_action = 'email_opened'  then 1 else 0 end,
    case when p_action = 'email_clicked' then 1 else 0 end,
    case when p_action = 'post_read'     then 1 else 0 end,
    case when p_action = 'post_read' and p_is_premium then 1 else 0 end,
    case when p_action = 'email_sent'    then now() else null end,
    case when p_action = 'email_opened'  then now() else null end,
    case when p_action = 'email_clicked' then now() else null end,
    case when p_action = 'post_read'     then now() else null end,
    now()
  )
  on conflict (subscriber_id, creator_id) do update set
    emails_sent    = sala_subscriber_engagement.emails_sent    + (case when p_action = 'email_sent'    then 1 else 0 end),
    emails_opened  = sala_subscriber_engagement.emails_opened  + (case when p_action = 'email_opened'  then 1 else 0 end),
    emails_clicked = sala_subscriber_engagement.emails_clicked + (case when p_action = 'email_clicked' then 1 else 0 end),
    posts_read     = sala_subscriber_engagement.posts_read     + (case when p_action = 'post_read'     then 1 else 0 end),
    premium_reads  = sala_subscriber_engagement.premium_reads  + (case when p_action = 'post_read' and p_is_premium then 1 else 0 end),
    last_email_at  = coalesce(case when p_action = 'email_sent'    then now() else null end, sala_subscriber_engagement.last_email_at),
    last_open_at   = coalesce(case when p_action = 'email_opened'  then now() else null end, sala_subscriber_engagement.last_open_at),
    last_click_at  = coalesce(case when p_action = 'email_clicked' then now() else null end, sala_subscriber_engagement.last_click_at),
    last_read_at   = coalesce(case when p_action = 'post_read'     then now() else null end, sala_subscriber_engagement.last_read_at),
    updated_at     = now();
end;
$$;

revoke all on function public.sala_record_engagement_event(uuid, uuid, text, boolean) from public;
grant execute on function public.sala_record_engagement_event(uuid, uuid, text, boolean) to service_role;

comment on table public.sala_subscriber_engagement is
  'Resumen incremental de engagement por (subscriber, creator). Actualizado vía sala_record_engagement_event() desde webhook. Lectura base del cron anti-churn.';

comment on table public.sala_churn_signals is
  'Alertas de riesgo de cancelación detectadas heurísticamente. Anti-spam: unique (subscriber, creator, action_taken). Outcome se mide 30 días post-acción.';
