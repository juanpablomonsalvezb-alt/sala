-- ============================================================================
-- Capa de protección: email suppression + rate limits + audit log de secrets
-- ============================================================================
-- Nivel 1 (reputación email): email_suppressions
-- Nivel 3 (rate limit + audit): sala_rate_limits + sala_creator_secrets_audit
-- ============================================================================

-- ─── email_suppressions: nunca enviar a estos ────────────────────────────────
CREATE TABLE IF NOT EXISTS email_suppressions (
  email      TEXT PRIMARY KEY,
  reason     TEXT NOT NULL CHECK (reason IN ('bounce', 'spam_complaint', 'unsubscribe', 'manual')),
  detail     TEXT,
  added_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_suppressions_reason_added
  ON email_suppressions (reason, added_at DESC);

ALTER TABLE email_suppressions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON email_suppressions FROM anon, authenticated;

-- Seed: los 8 bounces de 2026-05-17 (campaign launch)
INSERT INTO email_suppressions (email, reason, detail) VALUES
  ('daniela.dib@restofworld.org', 'bounce', 'launch-2026-05-17: domain rechaza emails desconocidos'),
  ('leo.schwartz@restofworld.org', 'bounce', 'launch-2026-05-17'),
  ('anna.heim@techcrunch.com', 'bounce', 'launch-2026-05-17'),
  ('marina.temkin@techcrunch.com', 'bounce', 'launch-2026-05-17'),
  ('jimena.tolama@bloomberglinea.com', 'bounce', 'launch-2026-05-17'),
  ('andres.engler@bloomberglinea.com', 'bounce', 'launch-2026-05-17'),
  ('lucila.lopardo@forbesargentina.com', 'bounce', 'launch-2026-05-17'),
  ('martina.veneziani@forbesargentina.com', 'bounce', 'launch-2026-05-17')
ON CONFLICT (email) DO NOTHING;

-- ─── sala_rate_limits: contadores por (bucket, key) ────────────────────────
CREATE TABLE IF NOT EXISTS sala_rate_limits (
  id         BIGSERIAL PRIMARY KEY,
  bucket     TEXT NOT NULL,
  key        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para query del rate limiter (bucket+key+ventana de tiempo)
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON sala_rate_limits (bucket, key, created_at DESC);

ALTER TABLE sala_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON sala_rate_limits FROM anon, authenticated;

-- Cleanup periódico: borrar rows > 24h (sin gc activo, esto crece infinito)
-- En lugar de cron de Postgres, lo borra el endpoint /api/cron/cleanup-rate-limits
COMMENT ON TABLE sala_rate_limits IS
  'Contadores de rate limit por (bucket, key). Borrar rows > 24h periódicamente.';

-- ─── audit log: quién toca sala_creator_secrets y cuándo ───────────────────
CREATE TABLE IF NOT EXISTS sala_creator_secrets_audit (
  id          BIGSERIAL PRIMARY KEY,
  creator_id  UUID NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  -- Quién hizo el cambio: 'service_role', 'system', o un user_id si vino con auth
  actor       TEXT,
  -- Snapshot de campos no-sensibles (no guardamos el token, solo metadata)
  mp_user_id  TEXT,
  changed_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secrets_audit_creator_time
  ON sala_creator_secrets_audit (creator_id, changed_at DESC);

ALTER TABLE sala_creator_secrets_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON sala_creator_secrets_audit FROM anon, authenticated;

-- Trigger: cada INSERT/UPDATE/DELETE en sala_creator_secrets se loguea.
-- NO guardamos el token (solo mp_user_id para identificar) — el audit log es
-- evidencia de actividad, no leak adicional.
CREATE OR REPLACE FUNCTION audit_creator_secrets()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO sala_creator_secrets_audit (creator_id, action, actor, mp_user_id)
    VALUES (OLD.creator_id, 'DELETE', current_user, OLD.mp_user_id);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO sala_creator_secrets_audit (creator_id, action, actor, mp_user_id)
    VALUES (NEW.creator_id, 'UPDATE', current_user, NEW.mp_user_id);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO sala_creator_secrets_audit (creator_id, action, actor, mp_user_id)
    VALUES (NEW.creator_id, 'INSERT', current_user, NEW.mp_user_id);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_creator_secrets ON sala_creator_secrets;
CREATE TRIGGER trg_audit_creator_secrets
  AFTER INSERT OR UPDATE OR DELETE ON sala_creator_secrets
  FOR EACH ROW EXECUTE FUNCTION audit_creator_secrets();

COMMENT ON TABLE sala_creator_secrets_audit IS
  'Log inmutable de cambios a tokens MP. Detecta accesos no autorizados ex-post.';
