-- Social Monitor: 5 tablas para detección y publicación asistida

CREATE TABLE IF NOT EXISTS social_monitored_accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        text NOT NULL CHECK (platform IN ('x', 'linkedin')),
  account_handle  text NOT NULL,
  followers_count integer DEFAULT 0,
  avg_engagement_rate numeric(5,4) DEFAULT 0,
  last_refreshed_at   timestamptz,
  is_active       boolean DEFAULT true,
  country_code    text,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (platform, account_handle)
);

CREATE TABLE IF NOT EXISTS social_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    text NOT NULL UNIQUE,
  storage_url text NOT NULL,
  tone        text NOT NULL CHECK (tone IN ('professional', 'viral')),
  last_used_at timestamptz,
  times_used  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_comment_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text        text NOT NULL,
  platform    text NOT NULL CHECK (platform IN ('x', 'linkedin', 'both')),
  tone        text NOT NULL CHECK (tone IN ('professional', 'viral')),
  times_used  integer DEFAULT 0,
  last_used_at timestamptz,
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_rate_limits (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform         text NOT NULL CHECK (platform IN ('x', 'linkedin')),
  date             date NOT NULL DEFAULT CURRENT_DATE,
  count_today      integer DEFAULT 0,
  last_published_at timestamptz,
  UNIQUE (platform, date)
);

CREATE TABLE IF NOT EXISTS social_opportunities (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform            text NOT NULL CHECK (platform IN ('x', 'linkedin')),
  post_url            text NOT NULL,
  post_id             text NOT NULL,
  post_text           text,
  author_handle       text,
  author_followers    integer DEFAULT 0,
  engagement_score    integer DEFAULT 0,
  mode                text CHECK (mode IN ('professional', 'viral')),
  detected_at         timestamptz DEFAULT now(),
  status              text DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'skipped')),
  suggested_image_id  uuid REFERENCES social_images(id),
  suggested_comment_id uuid REFERENCES social_comment_templates(id),
  custom_comment      text,
  published_at        timestamptz,
  country_code        text,
  UNIQUE (platform, post_id)
);

-- Seed: 20 templates de comentarios
INSERT INTO social_comment_templates (text, platform, tone) VALUES
  ('¿Monetizaste ya el conocimiento que compartís acá? En Nebbuler los profesionales ya cobran por su contenido 👉 nebbuler.com', 'x', 'professional'),
  ('Contenido como este merece ser pagado. En Nebbuler podés cobrar membresía y vender cursos directamente 🚀 nebbuler.com', 'x', 'professional'),
  ('¿Tenés audiencia fiel? Ya es hora de monetizarla. Nebbuler es la plataforma para profesionales LATAM 👇 nebbuler.com', 'x', 'professional'),
  ('Este tipo de análisis vale plata. ¿Ya abriste tu portal en Nebbuler? nebbuler.com', 'x', 'professional'),
  ('Exactamente el tipo de expertise que los profesionales venden en Nebbuler. ¿Te unís? nebbuler.com', 'x', 'professional'),
  ('Esto es justo lo que los creadores de conocimiento comparten en Nebbuler con sus suscriptores 💡 nebbuler.com', 'x', 'viral'),
  ('La gente que sabe de esto ya está creando portales en Nebbuler y cobrando por su conocimiento 🎯 nebbuler.com', 'x', 'viral'),
  ('Si esto genera este engagement, imaginate lo que lograrías con suscriptores propios en Nebbuler 🔥', 'x', 'viral'),
  ('El conocimiento vale. Mirá cómo los profesionales latinoamericanos lo monetizan en nebbuler.com', 'x', 'viral'),
  ('Post de calidad → audiencia fiel → monetización. Así funciona en Nebbuler 💪 nebbuler.com', 'x', 'viral'),
  ('El conocimiento profesional tiene un valor real. En Nebbuler podés cobrarlo con membresías y cursos. nebbuler.com', 'linkedin', 'professional'),
  ('Contenido de esta calidad merece ser monetizado directamente. Nebbuler es la plataforma para profesionales de LATAM. nebbuler.com', 'linkedin', 'professional'),
  ('¿Ya pensaste en crear tu propio portal de conocimiento? En Nebbuler los profesionales cobran 0% comisión. nebbuler.com', 'linkedin', 'professional'),
  ('Este análisis muestra exactamente el expertise que tiene valor en el mercado. Nebbuler ayuda a monetizarlo. nebbuler.com', 'linkedin', 'professional'),
  ('La curva de aprendizaje de años merece una recompensa. Nebbuler permite a los profesionales cobrar por su conocimiento. nebbuler.com', 'linkedin', 'professional'),
  ('Gran aporte. Justamente este tipo de contenido es el que las audiencias pagan en Nebbuler. nebbuler.com', 'linkedin', 'viral'),
  ('El engagement que generás acá podría convertirse en ingresos recurrentes en Nebbuler. nebbuler.com', 'linkedin', 'viral'),
  ('Si tu contenido genera esta reacción, ya tenés la audiencia para monetizar en Nebbuler. nebbuler.com', 'linkedin', 'viral'),
  ('Nebbuler es donde los profesionales latinoamericanos convierten su conocimiento en negocio real. nebbuler.com', 'linkedin', 'viral'),
  ('El conocimiento es el activo más valioso. En Nebbuler podés construir tu negocio alrededor de él. nebbuler.com', 'linkedin', 'viral')
ON CONFLICT DO NOTHING;

-- Seed: cuentas iniciales a monitorear
INSERT INTO social_monitored_accounts (platform, account_handle, followers_count, country_code) VALUES
  ('x', 'federicoseeber', 80000, 'AR'),
  ('x', 'MartinLousteau', 500000, 'AR'),
  ('x', 'NicolasMaduro', 4000000, 'VE'),
  ('x', 'CarlosLoret', 3000000, 'MX'),
  ('x', 'FelipeKast', 400000, 'CL'),
  ('x', 'BorisBrejcha', 600000, 'CL'),
  ('linkedin', 'nebbuler', 5000, 'CL')
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE social_monitored_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON social_monitored_accounts FOR ALL USING (true);
CREATE POLICY "service_role_all" ON social_images FOR ALL USING (true);
CREATE POLICY "service_role_all" ON social_comment_templates FOR ALL USING (true);
CREATE POLICY "service_role_all" ON social_rate_limits FOR ALL USING (true);
CREATE POLICY "service_role_all" ON social_opportunities FOR ALL USING (true);
