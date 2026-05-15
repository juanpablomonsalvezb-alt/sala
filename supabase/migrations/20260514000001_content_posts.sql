CREATE TABLE IF NOT EXISTS social_posted_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('x', 'linkedin')),
  text text NOT NULL,
  image_url text,
  posted_at timestamptz DEFAULT now(),
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_posted_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON social_posted_content FOR ALL USING (true);
