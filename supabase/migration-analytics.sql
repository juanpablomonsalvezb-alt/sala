-- ============================================================
-- Migración: analíticas para creadores
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

-- Contador de vistas en posts
ALTER TABLE public.sala_posts
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Tabla de eventos de email
CREATE TABLE IF NOT EXISTS public.sala_email_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug     TEXT NOT NULL,
  creator_id    UUID REFERENCES public.sala_creators(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES public.sala_profiles(id) ON DELETE SET NULL,
  event_type    TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sala_email_events_creator_idx ON public.sala_email_events (creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sala_email_events_post_idx    ON public.sala_email_events (post_slug, event_type);

-- Función para incrementar vistas de forma atómica
CREATE OR REPLACE FUNCTION public.increment_post_view(post_id UUID)
RETURNS VOID AS $$
  UPDATE public.sala_posts SET view_count = view_count + 1 WHERE id = post_id;
$$ LANGUAGE SQL SECURITY DEFINER;

ALTER TABLE public.sala_email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sala_email_events: creator lee los suyos"
  ON public.sala_email_events FOR SELECT
  USING (
    creator_id IN (
      SELECT id FROM public.sala_creators WHERE user_id = auth.uid()
    )
  );
