-- ============================================================================
-- Fix idempotencia webhooks: estado processing → done con TTL para retries
-- ============================================================================
-- Antes: insertar event_id como marca binaria "ya procesado".
-- Problema: si el procesamiento falla a mitad, el evento queda marcado y los
-- reintentos de MP/Stripe se descartan como duplicados → pérdida de cobros.
--
-- Ahora: insertamos 'processing', solo pasamos a 'done' al terminar. Si pasa
-- el TTL sin done, el siguiente reintento puede reprocesar.
-- ============================================================================

ALTER TABLE sala_webhook_events
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'done'
    CHECK (status IN ('processing', 'done')),
  ADD COLUMN IF NOT EXISTS attempted_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Índice para query "reservar/recuperar" (provider + event_id ya tiene unique,
-- agregamos uno parcial para filtrar 'processing' expirados)
CREATE INDEX IF NOT EXISTS idx_webhook_events_processing
  ON sala_webhook_events (provider, attempted_at)
  WHERE status = 'processing';

-- Backfill: todos los registros viejos como 'done' (ya estaban procesados de hecho)
UPDATE sala_webhook_events
  SET status = 'done', processed_at = COALESCE(processed_at, attempted_at, NOW())
  WHERE status IS NULL OR status NOT IN ('processing', 'done');

COMMENT ON COLUMN sala_webhook_events.status IS
  'processing = reservado pero no terminado. done = procesado completamente.';
COMMENT ON COLUMN sala_webhook_events.attempted_at IS
  'Última vez que se intentó procesar. Si status=processing y han pasado >5min, se considera abandonado y otro retry puede tomarlo.';
