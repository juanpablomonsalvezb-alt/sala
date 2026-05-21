-- ═══════════════════════════════════════════════════════════════════════════
-- Programa de referidos viral — 2026-05-21
--
-- Extiende la tabla `sala_referrals` (creada en 20260511000000_referrals.sql)
-- con las columnas necesarias para el sistema win-win:
--   - Tracking de estado (pending -> signup -> subscribed -> converted -> rewarded)
--   - Tipos de recompensa (descuento, mes gratis, cash)
--   - UTM tagging para attribution
--   - Anti self-referral y anti-spam (UNIQUE(referrer_id, referred_id))
--
-- Reglas de negocio (hardcoded en código):
--   * 1 signup completo = trackeo del referente
--   * 3 conversions (signups que pagan 1 mes) = 1 mes gratis para referrer
--   * Lectores que refieren a otros lectores: TODO (out-of-scope ahora)
-- ═══════════════════════════════════════════════════════════════════════════

-- Asegurarse de que la tabla base exista (idempotente).
create table if not exists public.sala_referrals (
  id            uuid primary key default gen_random_uuid(),
  referrer_id   uuid references auth.users(id) on delete set null,
  referred_id   uuid references auth.users(id) on delete cascade,
  ref_code      text,
  created_at    timestamptz default now()
);

-- ── Columnas nuevas (todas con IF NOT EXISTS / safe-add) ──────────────────
alter table public.sala_referrals
  add column if not exists source text default 'link',
  add column if not exists status text default 'pending',
  add column if not exists reward_type text default 'none',
  add column if not exists reward_amount_usd numeric(8,2) default 0,
  add column if not exists rewarded_at timestamptz,
  add column if not exists subscribed_at timestamptz,
  add column if not exists source_url text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

-- Asegurar default en created_at por si la tabla era pre-existente sin él.
alter table public.sala_referrals
  alter column created_at set default now();

-- Hacer ref_code opcional (en el nuevo flujo usamos el slug del creador,
-- guardado en utm_source o derivado del referrer_id).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='sala_referrals'
      and column_name='ref_code' and is_nullable='NO'
  ) then
    alter table public.sala_referrals alter column ref_code drop not null;
  end if;
end$$;

-- ── CHECK constraints (drop/add para que sean idempotentes) ───────────────
alter table public.sala_referrals
  drop constraint if exists sala_referrals_source_check;
alter table public.sala_referrals
  add constraint sala_referrals_source_check
  check (source in ('link','share','email'));

alter table public.sala_referrals
  drop constraint if exists sala_referrals_status_check;
alter table public.sala_referrals
  add constraint sala_referrals_status_check
  check (status in ('pending','signup','subscribed','converted','rewarded','expired'));

alter table public.sala_referrals
  drop constraint if exists sala_referrals_reward_type_check;
alter table public.sala_referrals
  add constraint sala_referrals_reward_type_check
  check (reward_type in ('none','discount_3mo','cash_usd','free_month'));

-- Anti-self-referral: un usuario no puede referirse a sí mismo.
alter table public.sala_referrals
  drop constraint if exists sala_referrals_no_self;
alter table public.sala_referrals
  add constraint sala_referrals_no_self
  check (referrer_id is null or referred_id is null or referrer_id <> referred_id);

-- Anti-spam: un usuario solo puede ser referido UNA vez.
-- (Permitimos NULLs múltiples porque PostgreSQL no los considera iguales).
create unique index if not exists sala_referrals_unique_referred
  on public.sala_referrals (referred_id)
  where referred_id is not null;

-- También un par (referrer, referred) único — defensivo.
create unique index if not exists sala_referrals_unique_pair
  on public.sala_referrals (referrer_id, referred_id)
  where referrer_id is not null and referred_id is not null;

-- ── Índices para queries del dashboard ────────────────────────────────────
create index if not exists sala_referrals_referrer_idx on public.sala_referrals(referrer_id);
create index if not exists sala_referrals_referred_idx on public.sala_referrals(referred_id);
create index if not exists sala_referrals_status_idx   on public.sala_referrals(status);
create index if not exists sala_referrals_created_idx  on public.sala_referrals(created_at desc);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.sala_referrals enable row level security;

-- Limpiar policies viejas para reaplicar de forma limpia.
drop policy if exists "referrals_own"          on public.sala_referrals;
drop policy if exists "referrals_select_own"   on public.sala_referrals;
drop policy if exists "referrals_insert_admin" on public.sala_referrals;

-- SELECT: referrer puede ver sus propios referidos.
create policy "referrals_select_own"
  on public.sala_referrals for select
  using (referrer_id = auth.uid() or referred_id = auth.uid());

-- INSERT: solo service_role (las APIs lo hacen con createServiceClient).
-- No exponemos INSERT a usuarios autenticados para evitar fraude.
create policy "referrals_insert_admin"
  on public.sala_referrals for insert
  with check (false);

-- UPDATE: solo service_role.
create policy "referrals_update_admin"
  on public.sala_referrals for update
  using (false);

-- ── Comentario informativo ────────────────────────────────────────────────
comment on table public.sala_referrals is
  'Programa de referidos viral. Cada fila representa una relación referrer -> referred. Estado evoluciona pending -> signup -> subscribed -> converted -> rewarded.';

comment on column public.sala_referrals.source is
  'Canal por el que llegó el referido: link (URL /r/[username]), share (botón social), email (invitación directa).';

comment on column public.sala_referrals.status is
  'pending: cookie seteada pero sin signup; signup: usuario creó cuenta; subscribed: usuario abrió sala (pagó 1 mes); converted: 3 meses pagados; rewarded: recompensa aplicada.';
