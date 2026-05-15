-- Tabla de registro de envíos semanales del boletín
CREATE TABLE IF NOT EXISTS boletin_sent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_at timestamptz DEFAULT now(),
  recipients_count integer DEFAULT 0,
  week_of date NOT NULL UNIQUE
);

-- Columna para control de suscripción al boletín
ALTER TABLE sala_profiles ADD COLUMN IF NOT EXISTS boletin_activo boolean DEFAULT true;

-- Tabla de tokens de desuscripción del boletín (separada de sala_unsubscribe_tokens que es para creadores)
CREATE TABLE IF NOT EXISTS boletin_unsubscribe_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES sala_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS boletin_unsubscribe_tokens_token_idx ON boletin_unsubscribe_tokens(token);
CREATE INDEX IF NOT EXISTS boletin_unsubscribe_tokens_user_idx ON boletin_unsubscribe_tokens(user_id);
