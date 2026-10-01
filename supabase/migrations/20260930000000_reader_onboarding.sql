-- ═══════════════════════════════════════════════════════════════════════════
-- Onboarding de 6 pantallas para lectores nuevos — 2026-09-30
--
-- Captura profesión, intereses y frecuencia de contenido deseada de cada
-- lector nuevo antes de que llegue a la home. `onboarding_completed`
-- default `true` para no afectar usuarios ya existentes — solo el trigger
-- de creación de usuario lo pone en `false` para signups nuevos.
--
-- No confundir con `sala_onboarding_log` (20260521000009_onboarding_sequence.sql),
-- que es la secuencia de emails de retención por suscripción — tabla y
-- propósito distintos.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.sala_profiles
  add column if not exists onboarding_completed boolean not null default true,
  add column if not exists profession           text,
  add column if not exists interests            text[],
  add column if not exists content_frequency    text;

-- Nuevos signups arrancan sin completar el onboarding; usuarios existentes
-- quedan en `true` por el default de la columna (no se tocan sus filas).
create or replace function public.sala_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.sala_profiles (id, email, full_name, avatar_url, onboarding_completed)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', false)
  on conflict (id) do nothing;
  return new;
end;
$$;
