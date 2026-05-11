-- ============================================================
-- Migration: email delivery system — unsubscribe tokens
-- Fecha: 2026-05-11
-- ============================================================

-- Tabla para tokens de cancelación de suscripción
-- Cada token es único por (subscriber, creator) — upsert sobreescribe el anterior.
CREATE TABLE IF NOT EXISTS public.sala_unsubscribe_tokens (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  token        text        UNIQUE NOT NULL,
  subscriber_id uuid       NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id   uuid        NOT NULL REFERENCES public.sala_creators(id) ON DELETE CASCADE,
  created_at   timestamptz DEFAULT now(),
  expires_at   timestamptz NOT NULL,

  -- Un par (subscriber, creator) tiene como máximo un token activo a la vez
  UNIQUE (subscriber_id, creator_id)
);

-- Índice para lookup rápido por token (path: GET /api/unsubscribe?token=...)
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_token
  ON public.sala_unsubscribe_tokens (token);

-- Índice para limpieza periódica de tokens expirados
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_expires
  ON public.sala_unsubscribe_tokens (expires_at);

-- RLS: solo el service role puede operar sobre esta tabla
ALTER TABLE public.sala_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- No exponemos tokens a ningún usuario autenticado directamente
-- El API route usa service role key, que bypasea RLS

-- ── Columnas adicionales en tablas existentes ─────────────────────────────────

-- cancelled_at en sala_subscriptions (ya existe según schema.sql, pero
-- algunos entornos pueden no tenerla si el schema se aplicó parcialmente)
ALTER TABLE public.sala_subscriptions
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- ── Vista de conveniencia para queries de email ───────────────────────────────
-- Retorna suscriptores activos con su email listo para enviar.

CREATE OR REPLACE VIEW public.sala_subscriber_emails AS
SELECT
  s.id           AS subscription_id,
  s.subscriber_id,
  s.creator_id,
  s.status,
  s.price_clp,
  p.email,
  p.full_name
FROM public.sala_subscriptions s
JOIN public.sala_profiles p ON p.id = s.subscriber_id
WHERE s.status = 'active';

-- La vista hereda RLS de las tablas base. El service role la puede leer.
