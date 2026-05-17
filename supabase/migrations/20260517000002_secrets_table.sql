-- ============================================================================
-- C10 fix: mover tokens MP a tabla separada con RLS estricta.
--
-- Verificado con curl real: la anon key PUEDE leer mp_access_token de
-- sala_creators porque PostgREST no respeta REVOKE column-level por defecto.
-- La anon key está en el bundle público del frontend → cualquiera puede robar
-- tokens MP de todos los creadores.
--
-- Solución: mover columnas sensibles a sala_creator_secrets, una tabla con
-- RLS habilitada y SIN policies de lectura. Solo service_role la lee
-- (bypasea RLS por convención de Supabase).
-- ============================================================================

-- 1. Crear tabla de secretos
CREATE TABLE IF NOT EXISTS sala_creator_secrets (
  creator_id           UUID PRIMARY KEY REFERENCES sala_creators(id) ON DELETE CASCADE,
  mp_access_token      TEXT,
  mp_refresh_token     TEXT,
  mp_user_id           TEXT,
  mp_connected_at      TIMESTAMPTZ,
  mp_token_expires_at  TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS habilitada SIN policies → nadie con anon/authenticated puede leer.
-- service_role bypasea RLS automáticamente en Supabase.
ALTER TABLE sala_creator_secrets ENABLE ROW LEVEL SECURITY;

-- 3. Revocar GRANTs por defecto a anon/authenticated (defensa en profundidad)
REVOKE ALL ON sala_creator_secrets FROM anon, authenticated;

-- 4. Índice para lookup por mp_user_id (webhook MP usa esto)
CREATE INDEX IF NOT EXISTS idx_sala_creator_secrets_mp_user_id
  ON sala_creator_secrets (mp_user_id)
  WHERE mp_user_id IS NOT NULL;

-- 5. Migrar datos existentes (si los hay) — en prod actual hay 0, igual incluido.
INSERT INTO sala_creator_secrets (creator_id, mp_access_token, mp_refresh_token, mp_user_id, mp_connected_at, mp_token_expires_at)
SELECT id, mp_access_token, mp_refresh_token, mp_user_id, mp_connected_at, mp_token_expires_at
FROM sala_creators
WHERE mp_access_token IS NOT NULL OR mp_refresh_token IS NOT NULL
ON CONFLICT (creator_id) DO NOTHING;

-- 6. DROP columnas viejas de sala_creators
ALTER TABLE sala_creators
  DROP COLUMN IF EXISTS mp_access_token,
  DROP COLUMN IF EXISTS mp_refresh_token,
  DROP COLUMN IF EXISTS mp_user_id,
  DROP COLUMN IF EXISTS mp_connected_at,
  DROP COLUMN IF EXISTS mp_token_expires_at;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_creator_secrets_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_creator_secrets_updated_at ON sala_creator_secrets;
CREATE TRIGGER trg_creator_secrets_updated_at
  BEFORE UPDATE ON sala_creator_secrets
  FOR EACH ROW EXECUTE FUNCTION update_creator_secrets_timestamp();

COMMENT ON TABLE sala_creator_secrets IS
  'Tokens OAuth MercadoPago por creador. RLS estricta — solo service_role lee/escribe. Separada de sala_creators porque PostgREST no respeta column-level REVOKE.';
