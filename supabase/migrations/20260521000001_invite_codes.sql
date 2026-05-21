-- ═══════════════════════════════════════════════════════════════════════════
-- Sistema de invitaciones para influencers — 2026-05-21
--
-- Permite que el equipo de Nebbuler emita códigos de invitación a influencers
-- y profesionales seleccionados para que abran su sala SIN pagar la tarifa de
-- plataforma (US$19/mes).
--
-- Flujo:
--   1. Superadmin crea código en /dashboard/admin/invites
--   2. Comparte link nebbuler.com/invite/CODIGO
--   3. Influencer hace signup
--   4. POST /api/invites/redeem activa creator.plan='creator' sin cobrar
--   5. times_used++ en el código
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.sala_invite_codes (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  -- Quién creó el código (superadmin)
  created_by      uuid references public.sala_profiles (id) on delete set null,
  -- Si se asigna a email específico, solo ese email puede redimirlo
  assigned_email  text,
  -- Nombre del invitado (display interno, ej: "Lucas Lacoste")
  assigned_name   text,
  -- Notas internas (medio de contacto, contexto, etc.)
  notes           text,
  -- Cuántas redenciones se permiten (default 1 — invite personal)
  max_uses        integer not null default 1 check (max_uses > 0 and max_uses <= 1000),
  -- Cuántas veces se ha redimido
  times_used      integer not null default 0,
  -- Caducidad opcional
  expires_at      timestamptz,
  -- Revocación (admin puede invalidar antes de tiempo)
  revoked_at      timestamptz,
  -- Plan que otorga al redimir (siempre 'creator' por ahora, dejamos flexible)
  grants_plan     text not null default 'creator' check (grants_plan in ('creator', 'pro')),
  created_at      timestamptz not null default now()
);

-- Índices para lookup rápido
create index if not exists sala_invite_codes_code_idx on public.sala_invite_codes (code);
create index if not exists sala_invite_codes_created_by_idx on public.sala_invite_codes (created_by);
create index if not exists sala_invite_codes_active_idx
  on public.sala_invite_codes (code)
  where revoked_at is null;

-- ── Redenciones ──────────────────────────────────────────────────────────────
-- Registro auditable de quién redimió qué código y cuándo.
create table if not exists public.sala_invite_redemptions (
  id            uuid primary key default uuid_generate_v4(),
  invite_id     uuid not null references public.sala_invite_codes (id) on delete cascade,
  redeemed_by   uuid not null references public.sala_profiles (id) on delete cascade,
  creator_id    uuid references public.sala_creators (id) on delete set null,
  redeemed_at   timestamptz not null default now(),
  ip_address    text,
  user_agent    text,
  -- Un usuario solo puede redimir un código una vez (anti-doble-redención)
  unique (invite_id, redeemed_by)
);

create index if not exists sala_invite_redemptions_redeemed_by_idx
  on public.sala_invite_redemptions (redeemed_by);
create index if not exists sala_invite_redemptions_invite_id_idx
  on public.sala_invite_redemptions (invite_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.sala_invite_codes enable row level security;
alter table public.sala_invite_redemptions enable row level security;

-- Solo service_role escribe códigos. No hay policies → bloqueado para anon/auth.
revoke all on public.sala_invite_codes from anon, authenticated;
revoke all on public.sala_invite_redemptions from anon, authenticated;

-- ── Función pública: validar código (sin exponer estructura completa) ────────
-- Retorna información mínima para que la landing /invite/[code] pueda
-- pre-validar el código antes del signup. Solo metadatos seguros.
create or replace function public.sala_validate_invite(p_code text)
returns table (
  is_valid     boolean,
  reason       text,
  display_name text,
  grants_plan  text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row record;
begin
  select * into v_row from public.sala_invite_codes where code = upper(p_code);

  if v_row is null then
    return query select false, 'not_found'::text, null::text, null::text;
    return;
  end if;

  if v_row.revoked_at is not null then
    return query select false, 'revoked'::text, null::text, null::text;
    return;
  end if;

  if v_row.expires_at is not null and v_row.expires_at < now() then
    return query select false, 'expired'::text, null::text, null::text;
    return;
  end if;

  if v_row.times_used >= v_row.max_uses then
    return query select false, 'used_up'::text, null::text, null::text;
    return;
  end if;

  return query select true, 'ok'::text, v_row.assigned_name, v_row.grants_plan;
end;
$$;

-- Permitir que cualquier rol llame la función de validación (solo lee metadatos no sensibles)
grant execute on function public.sala_validate_invite(text) to anon, authenticated;

comment on table public.sala_invite_codes is
  'Códigos de invitación VIP para influencers — bypass tarifa plataforma US$19/mes.';
comment on table public.sala_invite_redemptions is
  'Audit trail de redenciones de códigos de invitación.';
