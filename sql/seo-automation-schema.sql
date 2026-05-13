-- SEO Automation Schema for Nebbuler
-- Tables: trending_keywords, generated_pages, featured_snippets, seo_metrics

-- 1. TRENDING KEYWORDS
CREATE TABLE IF NOT EXISTS trending_keywords (
  id BIGSERIAL PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  search_volume INTEGER,
  monthly_growth FLOAT,
  difficulty_score SMALLINT,
  country_code VARCHAR(2),
  language VARCHAR(5),
  status VARCHAR(20) DEFAULT 'detected', -- detected, processing, generated, published
  last_detected TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trending_keywords_status ON trending_keywords(status) WHERE status != 'published';
CREATE INDEX idx_trending_keywords_search_volume ON trending_keywords(search_volume DESC) WHERE status = 'detected';
CREATE INDEX idx_trending_keywords_country ON trending_keywords(country_code);

-- 2. GENERATED PAGES
CREATE TABLE IF NOT EXISTS generated_pages (
  id BIGSERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  specialty VARCHAR(100),
  country_code VARCHAR(2),
  content_html TEXT,
  content_markdown TEXT,
  word_count INTEGER,
  seo_score SMALLINT,
  traffic_rank INTEGER,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published
  trending_keyword_id BIGINT REFERENCES trending_keywords(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(keyword, country_code)
);

CREATE INDEX idx_generated_pages_status ON generated_pages(status);
CREATE INDEX idx_generated_pages_specialty ON generated_pages(specialty);
CREATE INDEX idx_generated_pages_country ON generated_pages(country_code);
CREATE INDEX idx_generated_pages_keyword ON generated_pages USING GIN(to_tsvector('spanish', keyword));

-- 3. FEATURED SNIPPETS
CREATE TABLE IF NOT EXISTS featured_snippets (
  id BIGSERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  position SMALLINT, -- 0 = snippet, 1-10 = regular ranking
  snippet_text TEXT,
  source_url TEXT,
  difficulty_score SMALLINT,
  status VARCHAR(20) DEFAULT 'monitoring',
  page_id BIGINT REFERENCES generated_pages(id),
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(keyword)
);

CREATE INDEX idx_featured_snippets_position ON featured_snippets(position);
CREATE INDEX idx_featured_snippets_page_id ON featured_snippets(page_id);

-- 4. SEO METRICS
CREATE TABLE IF NOT EXISTS seo_metrics (
  id BIGSERIAL PRIMARY KEY,
  page_id BIGINT NOT NULL REFERENCES generated_pages(id) ON DELETE CASCADE,
  keyword TEXT,
  monthly_organic_traffic INTEGER DEFAULT 0,
  keyword_rank_avg SMALLINT,
  click_through_rate FLOAT,
  conversion_rate FLOAT,
  featured_snippet_position SMALLINT,
  measured_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, measured_at)
);

CREATE INDEX idx_seo_metrics_page_id ON seo_metrics(page_id);
CREATE INDEX idx_seo_metrics_traffic ON seo_metrics(monthly_organic_traffic DESC);
CREATE INDEX idx_seo_metrics_measured_at ON seo_metrics(measured_at DESC);

-- 5. ENABLE RLS
ALTER TABLE trending_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metrics ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES
-- trending_keywords: SELECT public, INSERT/UPDATE service_role only
CREATE POLICY "trending_keywords_select_public" ON trending_keywords
  FOR SELECT USING (true);
CREATE POLICY "trending_keywords_insert_service" ON trending_keywords
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "trending_keywords_update_service" ON trending_keywords
  FOR UPDATE USING (auth.role() = 'service_role');

-- generated_pages: SELECT public, INSERT/UPDATE service_role only
CREATE POLICY "generated_pages_select_public" ON generated_pages
  FOR SELECT USING (true);
CREATE POLICY "generated_pages_insert_service" ON generated_pages
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "generated_pages_update_service" ON generated_pages
  FOR UPDATE USING (auth.role() = 'service_role');

-- featured_snippets: SELECT public, INSERT/UPDATE service_role only
CREATE POLICY "featured_snippets_select_public" ON featured_snippets
  FOR SELECT USING (true);
CREATE POLICY "featured_snippets_insert_service" ON featured_snippets
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "featured_snippets_update_service" ON featured_snippets
  FOR UPDATE USING (auth.role() = 'service_role');

-- seo_metrics: SELECT public, INSERT/UPDATE service_role only
CREATE POLICY "seo_metrics_select_public" ON seo_metrics
  FOR SELECT USING (true);
CREATE POLICY "seo_metrics_insert_service" ON seo_metrics
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "seo_metrics_update_service" ON seo_metrics
  FOR UPDATE USING (auth.role() = 'service_role');

-- 7. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION insert_or_get_keyword(
  p_keyword TEXT,
  p_search_volume INTEGER DEFAULT NULL,
  p_monthly_growth FLOAT DEFAULT NULL,
  p_difficulty_score SMALLINT DEFAULT NULL,
  p_country_code VARCHAR(2) DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id BIGINT;
BEGIN
  INSERT INTO trending_keywords (
    keyword, search_volume, monthly_growth, difficulty_score, country_code
  ) VALUES (
    p_keyword, p_search_volume, p_monthly_growth, p_difficulty_score, p_country_code
  )
  ON CONFLICT (keyword) DO UPDATE
  SET status = 'detected', updated_at = NOW()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_generated_page(
  p_keyword TEXT,
  p_specialty VARCHAR(100),
  p_country_code VARCHAR(2),
  p_content_html TEXT,
  p_content_markdown TEXT DEFAULT NULL,
  p_seo_score SMALLINT DEFAULT 70
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id BIGINT;
  v_word_count INTEGER;
BEGIN
  v_word_count := array_length(string_to_array(p_content_html, ' '), 1);
  INSERT INTO generated_pages (
    keyword, specialty, country_code, content_html, content_markdown, word_count, seo_score, status
  ) VALUES (
    p_keyword, p_specialty, p_country_code, p_content_html, p_content_markdown, v_word_count, p_seo_score, 'draft'
  )
  ON CONFLICT (keyword, country_code) DO UPDATE
  SET content_html = p_content_html, updated_at = NOW()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION record_seo_metric(
  p_page_id BIGINT,
  p_keyword TEXT,
  p_monthly_traffic INTEGER DEFAULT 0,
  p_rank SMALLINT DEFAULT NULL,
  p_ctr FLOAT DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id BIGINT;
BEGIN
  INSERT INTO seo_metrics (
    page_id, keyword, monthly_organic_traffic, keyword_rank_avg, click_through_rate, measured_at
  ) VALUES (
    p_page_id, p_keyword, p_monthly_traffic, p_rank, p_ctr, CURRENT_DATE
  )
  ON CONFLICT (page_id, measured_at) DO UPDATE
  SET monthly_organic_traffic = p_monthly_traffic, keyword_rank_avg = p_rank
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- 8. VIEWS
CREATE OR REPLACE VIEW v_keywords_without_pages AS
SELECT k.id, k.keyword, k.search_volume, k.monthly_growth, k.difficulty_score
FROM trending_keywords k
LEFT JOIN generated_pages p ON p.keyword = k.keyword
WHERE p.id IS NULL AND k.status = 'detected'
ORDER BY k.search_volume DESC;

CREATE OR REPLACE VIEW v_page_performance AS
SELECT
  p.id, p.keyword, p.specialty, p.country_code, p.seo_score, p.status,
  m.monthly_organic_traffic, m.keyword_rank_avg, m.click_through_rate,
  ROW_NUMBER() OVER (ORDER BY m.monthly_organic_traffic DESC NULLS LAST) as traffic_rank
FROM generated_pages p
LEFT JOIN seo_metrics m ON m.page_id = p.id AND m.measured_at = CURRENT_DATE
ORDER BY m.monthly_organic_traffic DESC NULLS LAST;

CREATE OR REPLACE VIEW v_top_performers AS
SELECT * FROM v_page_performance
WHERE monthly_organic_traffic > 0
LIMIT 50;

GRANT SELECT ON trending_keywords TO anon, authenticated;
GRANT SELECT ON generated_pages TO anon, authenticated;
GRANT SELECT ON featured_snippets TO anon, authenticated;
GRANT SELECT ON seo_metrics TO anon, authenticated;
GRANT SELECT ON v_keywords_without_pages TO anon, authenticated;
GRANT SELECT ON v_page_performance TO anon, authenticated;
GRANT SELECT ON v_top_performers TO anon, authenticated;
