-- ═══════════════════════════════════════════════════════════════════════════
-- ONBOARDING SEQUENCE 30 DÍAS — secuencia editorial automática por suscriptor
-- 2026-05-21
--
-- Objetivo:
--   Aumentar retention 30-40% entregando una secuencia editorial calibrada de
--   5 emails durante los primeros 30 días de cada nueva suscripción activa.
--
-- Stages:
--   welcome      → día 0 (bienvenida + top posts del creador)
--   tips_day_3   → día 3 (cómo aprovechar la suscripción)
--   survey_day_7 → día 7 (encuesta de expectativas, 1 pregunta)
--   viral_day_14 → día 14 (compartir quote favorito)
--   nps_day_30   → día 30 (NPS + survey "qué te falta")
--
-- Diseño:
--   1. Idempotencia a nivel DB: UNIQUE (subscription_id, stage) garantiza
--      que si el cron corre dos veces el mismo día no se duplica el envío.
--   2. Tracking opcional: opened_at, clicked_at, responded_at se llenan
--      best-effort vía /api/track/onboarding (pixel + button + post).
--   3. RLS estricta: cada creator ve solo SUS propias filas. Service role
--      bypassa para que el cron y los endpoints de tracking funcionen.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.sala_onboarding_log (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.sala_subscriptions (id) on delete cascade,
  subscriber_id   uuid not null references public.sala_profiles (id) on delete cascade,
  creator_id      uuid not null references public.sala_creators (id) on delete cascade,
  stage           text not null check (stage in ('welcome','tips_day_3','survey_day_7','viral_day_14','nps_day_30')),
  email_sent_at   timestamptz not null default now(),
  opened_at       timestamptz,
  clicked_at      timestamptz,
  responded_at    timestamptz,
  response_data   jsonb,
  -- Idempotencia: máx 1 fila por (subscription_id, stage)
  unique (subscription_id, stage)
);

create index if not exists sala_onboarding_log_subscription_idx
  on public.sala_onboarding_log (subscription_id);
create index if not exists sala_onboarding_log_stage_idx
  on public.sala_onboarding_log (stage);
create index if not exists sala_onboarding_log_sent_idx
  on public.sala_onboarding_log (email_sent_at desc);
create index if not exists sala_onboarding_log_creator_idx
  on public.sala_onboarding_log (creator_id);

alter table public.sala_onboarding_log enable row level security;

drop policy if exists "onboarding: select own creator" on public.sala_onboarding_log;
create policy "onboarding: select own creator" on public.sala_onboarding_log for select
  using (
    exists (
      select 1 from public.sala_creators c
      where c.id = sala_onboarding_log.creator_id
        and c.user_id = auth.uid()
    )
  );

drop policy if exists "onboarding: select own subscriber" on public.sala_onboarding_log;
create policy "onboarding: select own subscriber" on public.sala_onboarding_log for select
  using (subscriber_id = auth.uid());

comment on table public.sala_onboarding_log is
  'Bitácora de la secuencia de onboarding (5 emails / 30 días) por suscripción. UNIQUE(subscription_id, stage) garantiza idempotencia: si el cron corre dos veces el mismo día no se duplica un envío.';
comment on column public.sala_onboarding_log.response_data is
  'JSON con la respuesta del usuario (survey choice, NPS score, free-text, etc.). Llenado por /api/track/onboarding action=response.';
