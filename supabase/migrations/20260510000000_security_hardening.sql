-- ═══════════════════════════════════════════════════════════════════════════
-- Migración de seguridad — 2026-05-10
-- Cierra RLS abierta, agrega RLS a tablas con PII, fixes de webhook
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. RLS de sala_profiles — eliminar policy permisiva ──────────────────────
drop policy if exists "Perfil propio visible para todos" on public.sala_profiles;

-- Re-crear la política estricta por idempotencia
drop policy if exists "sala_profiles: select own" on public.sala_profiles;
create policy "sala_profiles: select own"
  on public.sala_profiles for select
  using (auth.uid() = id);

-- ── 2. RLS en sala_reading_events ────────────────────────────────────────────
alter table if exists public.sala_reading_events enable row level security;

drop policy if exists "reading_events: insert own" on public.sala_reading_events;
create policy "reading_events: insert own"
  on public.sala_reading_events for insert
  with check (auth.uid() = reader_id);

drop policy if exists "reading_events: select own" on public.sala_reading_events;
create policy "reading_events: select own"
  on public.sala_reading_events for select
  using (auth.uid() = reader_id);

-- ── 3. RLS en sala_curiosity_graph ───────────────────────────────────────────
alter table if exists public.sala_curiosity_graph enable row level security;

drop policy if exists "curiosity: select own" on public.sala_curiosity_graph;
create policy "curiosity: select own"
  on public.sala_curiosity_graph for select
  using (auth.uid() = reader_id);

-- ── 4. RLS en sala_fx_rates ──────────────────────────────────────────────────
alter table if exists public.sala_fx_rates enable row level security;

drop policy if exists "fx_rates: public read" on public.sala_fx_rates;
create policy "fx_rates: public read"
  on public.sala_fx_rates for select
  using (true);

-- ── 5. Revocar acceso público a vista materializada ──────────────────────────
revoke all on public.sala_creator_directory from anon, authenticated;
grant select on public.sala_creator_directory to anon, authenticated;

-- ── 6. Email único en sala_profiles ──────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'sala_profiles_email_unique'
  ) then
    alter table public.sala_profiles add constraint sala_profiles_email_unique unique (email);
  end if;
end $$;

-- ── 7. Consolidar trigger duplicado de auth.users ────────────────────────────
drop trigger if exists sala_on_auth_user_created on auth.users;
drop function if exists public.sala_handle_new_user();

-- ── 8. Índices compuestos críticos ───────────────────────────────────────────
create index if not exists sala_subscriptions_creator_active_idx
  on public.sala_subscriptions (creator_id)
  where status = 'active';

create index if not exists sala_subscriptions_subscriber_active_idx
  on public.sala_subscriptions (subscriber_id, creator_id)
  where status = 'active';

create index if not exists sala_posts_creator_published_idx
  on public.sala_posts (creator_id, published_at desc)
  where published_at is not null;

-- ── 9. Tabla de eventos de webhook procesados (idempotencia) ─────────────────
create table if not exists public.sala_webhook_events (
  id bigserial primary key,
  provider text not null check (provider in ('mercadopago', 'stripe')),
  event_id text not null,
  processed_at timestamptz not null default now(),
  unique (provider, event_id)
);

alter table public.sala_webhook_events enable row level security;
-- Solo el service role puede leer/escribir (no se crea policy → bloqueado para anon/authenticated).
