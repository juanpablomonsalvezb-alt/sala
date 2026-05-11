-- Tabla para tracking de referrals
CREATE TABLE IF NOT EXISTS sala_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ref_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sala_referrals_ref_code ON sala_referrals(ref_code);
CREATE INDEX IF NOT EXISTS idx_sala_referrals_referrer ON sala_referrals(referrer_id);

ALTER TABLE sala_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_own" ON sala_referrals FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());
