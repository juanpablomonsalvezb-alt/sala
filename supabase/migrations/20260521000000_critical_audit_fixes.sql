-- ═══════════════════════════════════════════════════════════════════════════
-- Critical audit fixes — 2026-05-21
-- Cierra vulnerabilidades CRÍTICAS detectadas en auditoría completa:
--   1. sala_subscriptions: bloquear INSERT/UPDATE/DELETE desde authenticated
--      (acceso gratis al contenido pagado mediante INSERT directo via PostgREST)
--   2. sala_profiles.is_superadmin: bloquear UPDATE de la columna desde
--      authenticated (privilege escalation a superadmin)
--   3. Endurecer policies USING(true) para acotar a service_role
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. sala_subscriptions — cerrar escritura desde clientes ──────────────────
-- Solo service_role (webhook MP/Stripe) puede crear/modificar suscripciones.
drop policy if exists "sala_subscriptions: insert own" on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: update own" on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: delete own" on public.sala_subscriptions;

-- (Se mantienen las policies de SELECT para que cada user vea sus subs.)

-- Revocar grants directos por defensa en profundidad.
revoke insert, update, delete on public.sala_subscriptions from anon, authenticated;

-- ── 2. sala_profiles.is_superadmin — bloquear escalada de privilegios ────────
-- El UPDATE general de profiles sigue habilitado, pero is_superadmin queda
-- protegido por trigger que preserva el valor anterior salvo service_role.
create or replace function public.sala_protect_superadmin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := coalesce(current_setting('request.jwt.claim.role', true), '');
  if v_role <> 'service_role' then
    new.is_superadmin := old.is_superadmin;
  end if;
  return new;
end;
$$;

drop trigger if exists sala_protect_superadmin_trg on public.sala_profiles;
create trigger sala_protect_superadmin_trg
  before update on public.sala_profiles
  for each row
  when (new.is_superadmin is distinct from old.is_superadmin)
  execute function public.sala_protect_superadmin();

-- Defensa en profundidad: además revocar UPDATE de la columna específica.
revoke update (is_superadmin) on public.sala_profiles from anon, authenticated;

-- ── 3. Endurecer policies "FOR ALL USING (true)" a service_role ──────────────
-- social_monitor (20260514000000), content_posts (20260514000001), health (20260514000003)
-- usaban FOR ALL USING (true) que abre lectura/escritura a anon/authenticated.
-- Re-emitimos con TO service_role.

do $$
declare
  t text;
  tables text[] := array[
    'sala_social_accounts',
    'sala_social_signals',
    'sala_social_actions',
    'sala_social_outreach',
    'sala_content_posts',
    'sala_content_metrics',
    'sala_health_check_log'
  ];
begin
  foreach t in array tables loop
    if exists (select 1 from pg_tables where schemaname = 'public' and tablename = t) then
      execute format('drop policy if exists "%s: service_role_all" on public.%I', t, t);
      execute format(
        'create policy "%s: service_role_all" on public.%I for all to service_role using (true) with check (true)',
        t, t
      );
      execute format('revoke all on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;

-- ── 4. CHECK constraint en sala_creators.price_clp ──────────────────────────
-- Rango duro [1000, 100000] CLP — defensa en profundidad contra fraude.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'sala_creators_price_clp_range') then
    alter table public.sala_creators drop constraint sala_creators_price_clp_range;
  end if;
  alter table public.sala_creators
    add constraint sala_creators_price_clp_range
    check (price_clp is null or (price_clp >= 1000 and price_clp <= 100000));
end $$;

-- ── 5. Documentar fix ────────────────────────────────────────────────────────
comment on function public.sala_protect_superadmin() is
  'Anti privilege-escalation: preserva is_superadmin salvo service_role. Audit 2026-05-21.';
comment on constraint sala_creators_price_clp_range on public.sala_creators is
  'Rango duro de precio mensual: 1000-100000 CLP. Audit 2026-05-21.';
