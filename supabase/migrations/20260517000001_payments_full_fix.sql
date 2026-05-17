-- ============================================================================
-- 2026-05-17 — Reparación COMPLETA del schema de pagos
-- ============================================================================
-- Detectado por auditoría: varias migraciones declaradas en
-- supabase/migrations/ NUNCA se aplicaron en producción. El código asume
-- columnas que no existen → endpoints críticos fallan en silencio:
--   - /api/mp/webhook (welcome email roto, Connect mode roto)
--   - /suscribirse/[creator] (acceptsPayments siempre false)
--   - /api/mp/connect/callback (UPDATE de tokens falla)
--
-- Esta migración es IDEMPOTENTE: usa IF NOT EXISTS en todo. Se puede ejecutar
-- repetidamente sin efectos colaterales.
-- ============================================================================

-- ─── 1. Columnas faltantes en sala_creators ──────────────────────────────────
ALTER TABLE sala_creators
  -- MP Connect (OAuth marketplace) — del migration 20260511000002 nunca aplicado
  ADD COLUMN IF NOT EXISTS mp_access_token      TEXT,
  ADD COLUMN IF NOT EXISTS mp_refresh_token     TEXT,
  ADD COLUMN IF NOT EXISTS mp_user_id           TEXT,
  ADD COLUMN IF NOT EXISTS mp_connected_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mp_token_expires_at  TIMESTAMPTZ,  -- para refresh I5

  -- Nombre y handle para emails y URLs
  ADD COLUMN IF NOT EXISTS display_name         TEXT,
  ADD COLUMN IF NOT EXISTS username             TEXT,

  -- Cache de Stripe Price (fix I9: evita crear price nuevo en cada checkout)
  ADD COLUMN IF NOT EXISTS stripe_price_id      TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_clp     INTEGER;     -- precio cacheado

-- Backfill: display_name = name, username = slug
UPDATE sala_creators
  SET display_name = COALESCE(display_name, name),
      username     = COALESCE(username, slug)
  WHERE display_name IS NULL OR username IS NULL;

-- ─── 2. Columnas faltantes en sala_subscriptions ─────────────────────────────
ALTER TABLE sala_subscriptions
  -- Fix I1: separar fecha de último cobro de fecha de creación de la suscripción.
  -- Antes el webhook pisaba created_at en cada renovación, lo cual perdía
  -- información histórica y rompía el bloqueo de día 35 si MP no notifica.
  ADD COLUMN IF NOT EXISTS last_paid_at         TIMESTAMPTZ,
  -- Identificador de preapproval (MP) o subscription (Stripe) — para reconciliación
  ADD COLUMN IF NOT EXISTS mp_preapproval_id    TEXT,
  -- Estado de cobro de la próxima renovación
  ADD COLUMN IF NOT EXISTS next_charge_at       TIMESTAMPTZ;

-- Backfill: last_paid_at = created_at (para suscripciones existentes)
UPDATE sala_subscriptions
  SET last_paid_at = COALESCE(last_paid_at, created_at)
  WHERE last_paid_at IS NULL;

-- ─── 3. Índices para performance y unicidad ──────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS sala_subscriptions_subscriber_creator_unique
  ON sala_subscriptions (subscriber_id, creator_id);

CREATE INDEX IF NOT EXISTS idx_sala_creators_mp_user_id
  ON sala_creators (mp_user_id)
  WHERE mp_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sala_creators_username
  ON sala_creators (username)
  WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sala_subscriptions_last_paid_at
  ON sala_subscriptions (last_paid_at);

CREATE INDEX IF NOT EXISTS idx_sala_subscriptions_next_charge_at
  ON sala_subscriptions (next_charge_at)
  WHERE next_charge_at IS NOT NULL;

-- ─── 4. Column-level GRANT: tokens MP NO accesibles vía anon ────────────────
-- Postgres soporta GRANT/REVOKE por columna. Supabase (vía PostgREST) lo
-- respeta: si un cliente con la anon key intenta SELECT mp_access_token,
-- recibe error 42501 (insufficient privilege).
--
-- Esto reemplaza la "implementación a nivel de app" que era mentira de
-- seguridad: cualquier atacante con la anon key podía hacer SELECT directo
-- vía curl y robar tokens MP de todos los creadores.

DO $$
BEGIN
  -- Solo si los roles existen (Supabase los tiene siempre, pero por defensa)
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE SELECT (mp_access_token, mp_refresh_token, mp_user_id, mp_token_expires_at) ON sala_creators FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE SELECT (mp_access_token, mp_refresh_token, mp_user_id, mp_token_expires_at) ON sala_creators FROM authenticated';
  END IF;
END $$;

-- Comments documentando seguridad
COMMENT ON COLUMN sala_creators.mp_access_token IS
  'OAuth access token MercadoPago — REVOKEado de anon/authenticated. Solo service role.';
COMMENT ON COLUMN sala_creators.mp_refresh_token IS
  'OAuth refresh token MercadoPago — REVOKEado de anon/authenticated. Solo service role.';
COMMENT ON COLUMN sala_creators.mp_user_id IS
  'User ID numérico MercadoPago — REVOKEado de anon (medio sensible).';
COMMENT ON COLUMN sala_creators.mp_token_expires_at IS
  'Cuando expira el access_token. Usar para detectar tokens próximos a expirar y refresharlos.';
COMMENT ON COLUMN sala_subscriptions.last_paid_at IS
  'Última fecha de cobro/renovación exitosa. Usar para el bloqueo a los 35 días sin renovar (no created_at, que es la fecha de la primera suscripción).';
COMMENT ON COLUMN sala_subscriptions.next_charge_at IS
  'Fecha estimada del próximo cobro. Calculada por el webhook al recibir authorized.';
COMMENT ON COLUMN sala_creators.stripe_price_id IS
  'Price ID cacheado en Stripe. Evita crear un Price nuevo en cada checkout (fix I9).';
