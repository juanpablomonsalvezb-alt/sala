-- ═══════════════════════════════════════════════════════════════════════════
-- Migration tracking — Substack & otros — 2026-05-21
--
-- Permite que cualquier creador migre su contenido y suscriptores desde
-- Substack (u otras plataformas) hacia Nebbuler. Trazabilidad completa.
-- ═══════════════════════════════════════════════════════════════════════════

-- Columnas de origen en sala_posts
alter table public.sala_posts
  add column if not exists migrated_from text,
  add column if not exists migrated_url  text;

create index if not exists sala_posts_migrated_from_idx
  on public.sala_posts (migrated_from)
  where migrated_from is not null;

create index if not exists sala_posts_migrated_url_idx
  on public.sala_posts (migrated_url)
  where migrated_url is not null;

-- ── Tabla de invitaciones por migración (CSV de suscriptores) ──────────────
create table if not exists public.sala_migration_invites (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid not null references public.sala_creators (id) on delete cascade,
  email           text not null,
  name            text,
  status          text not null default 'pending' check (status in ('pending', 'sent', 'redeemed', 'failed', 'bounced')),
  invite_code_id  uuid references public.sala_invite_codes (id) on delete set null,
  source          text not null default 'substack',
  sent_at         timestamptz,
  redeemed_at     timestamptz,
  error_message   text,
  created_at      timestamptz not null default now()
);

-- Índices para performance
create index if not exists sala_migration_invites_creator_idx
  on public.sala_migration_invites (creator_id);

create index if not exists sala_migration_invites_email_idx
  on public.sala_migration_invites (email);

create unique index if not exists sala_migration_invites_unique_per_creator
  on public.sala_migration_invites (creator_id, email);

create index if not exists sala_migration_invites_status_idx
  on public.sala_migration_invites (status)
  where status in ('pending', 'failed');

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.sala_migration_invites enable row level security;

-- Solo service_role escribe; creator lee únicamente sus propias filas
revoke all on public.sala_migration_invites from anon, authenticated;

create policy sala_migration_invites_creator_select
  on public.sala_migration_invites
  for select
  to authenticated
  using (
    creator_id in (
      select id from public.sala_creators where user_id = auth.uid()
    )
  );

grant select on public.sala_migration_invites to authenticated;
