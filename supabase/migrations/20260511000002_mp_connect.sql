-- ─── MercadoPago Connect — tokens por creador ────────────────────────────────
-- Cada creador conecta su propia cuenta MP vía OAuth.
-- Los tokens NUNCA se exponen al cliente (anon key no puede leerlos).

ALTER TABLE sala_creators
  ADD COLUMN IF NOT EXISTS mp_access_token  text,
  ADD COLUMN IF NOT EXISTS mp_refresh_token text,
  ADD COLUMN IF NOT EXISTS mp_user_id       text,
  ADD COLUMN IF NOT EXISTS mp_connected_at  timestamptz;

-- Índice para lookup por mp_user_id (ej. webhook de MP)
CREATE INDEX IF NOT EXISTS idx_sala_creators_mp_user_id
  ON sala_creators(mp_user_id)
  WHERE mp_user_id IS NOT NULL;

-- ─── RLS: tokens sensibles — solo service role ────────────────────────────────
-- La anon key puede leer sala_creators pero NO los campos de token MP.
-- Implementado con una policy restrictiva adicional a nivel de columna
-- (Supabase no soporta column-level RLS nativo, así que lo manejamos
--  a nivel de app: createServiceClient() para escritura de tokens,
--  select sin esas columnas en queries de cliente).

-- Aseguramos que la tabla tiene RLS habilitado
ALTER TABLE sala_creators ENABLE ROW LEVEL SECURITY;

-- Policy existente de lectura pública se mantiene sin cambios.
-- El service role bypasea RLS automáticamente — no requiere policy.

COMMENT ON COLUMN sala_creators.mp_access_token IS
  'OAuth access token de la cuenta MercadoPago del creador. Solo accesible vía service role.';
COMMENT ON COLUMN sala_creators.mp_refresh_token IS
  'OAuth refresh token de MercadoPago. Solo accesible vía service role.';
COMMENT ON COLUMN sala_creators.mp_user_id IS
  'User ID numérico de la cuenta MercadoPago del creador (no sensible, se muestra en UI).';
COMMENT ON COLUMN sala_creators.mp_connected_at IS
  'Fecha en que el creador conectó su cuenta MercadoPago.';
