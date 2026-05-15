-- Health check log table
CREATE TABLE IF NOT EXISTS health_check_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_at timestamptz DEFAULT now(),
  all_ok boolean NOT NULL,
  failed_checks text[] DEFAULT '{}',
  details jsonb,
  alerted boolean DEFAULT false
);

ALTER TABLE health_check_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON health_check_log FOR ALL USING (true);

-- Index para queries de historial reciente
CREATE INDEX IF NOT EXISTS health_check_log_checked_at_idx ON health_check_log (checked_at DESC);
