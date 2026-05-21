-- ═══════════════════════════════════════════════════════════════════════════
-- Outreach queue — LinkedIn bot detector + cola de revisión manual
-- 2026-05-21
--
-- El cron `/api/cron/scan-linkedin-targets` detecta profesionales LATAM con
-- posts virales o señales de querer monetizar su expertise. Los califica con
-- Claude Sonnet y los inserta aquí con status='pending'. El superadmin revisa
-- en /dashboard/admin/outreach, edita el DM pre-generado, genera un código
-- VIP único y marca como enviado.
--
-- Flujo:
--   1. Cron diario scan → inserta candidatos status='pending'
--   2. Superadmin revisa cards → edita ai_pitch_draft si quiere
--   3. Botón "Generar código VIP" → crea sala_invite_codes y linkea
--   4. Botón "Copiar DM + link" → portapapeles para pegar en LinkedIn
--   5. Botón "Marcar como enviado" → status='sent', sent_at=now()
--   6. (Manual) Cuando el lead se convierte en creador → status='converted'
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.sala_outreach_targets (
  id                  uuid primary key default uuid_generate_v4(),
  platform            text not null default 'linkedin',
  profile_url         text not null unique,
  full_name           text,
  headline            text,
  country             text,
  specialty           text,
  followers_count     integer default 0,

  -- Signal: el post o señal que detonó la detección
  signal_post_url     text,
  signal_post_excerpt text,
  signal_engagement   integer default 0,
  signal_reason       text,

  -- IA scoring + DM pre-generado
  ai_score            numeric(3,2) check (ai_score is null or (ai_score >= 0 and ai_score <= 1)),
  ai_pitch_draft      text,

  -- Estado en el pipeline de outreach
  status              text not null default 'pending'
    check (status in ('pending','approved','sent','contacted','converted','rejected','blocked')),

  -- Linkeo opcional con código VIP generado para este lead
  invite_code_id      uuid references public.sala_invite_codes (id) on delete set null,

  -- Notas internas del superadmin
  notes               text,

  -- Trazabilidad
  detected_at         timestamptz not null default now(),
  reviewed_by         uuid references public.sala_profiles (id) on delete set null,
  reviewed_at         timestamptz,
  sent_at             timestamptz
);

-- ── Índices ──────────────────────────────────────────────────────────────────
create index if not exists sala_outreach_targets_profile_url_idx
  on public.sala_outreach_targets (profile_url);

create index if not exists sala_outreach_targets_status_idx
  on public.sala_outreach_targets (status);

create index if not exists sala_outreach_targets_country_specialty_idx
  on public.sala_outreach_targets (country, specialty);

create index if not exists sala_outreach_targets_detected_at_idx
  on public.sala_outreach_targets (detected_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- Solo service_role accede. Sin policies → bloqueado para anon/authenticated.
alter table public.sala_outreach_targets enable row level security;

revoke all on public.sala_outreach_targets from anon, authenticated;

comment on table public.sala_outreach_targets is
  'Cola de outreach: profesionales LATAM detectados por IA como leads para Nebbuler.';
