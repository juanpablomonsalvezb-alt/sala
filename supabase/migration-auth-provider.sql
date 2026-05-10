-- ============================================================
-- Migración: auth_provider en sala_profiles
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

ALTER TABLE public.sala_profiles
  ADD COLUMN IF NOT EXISTS auth_provider text;

-- Trigger para poblar sala_profiles automáticamente al crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sala_profiles (id, email, full_name, avatar_url, is_creator, is_superadmin, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    CASE WHEN NEW.raw_app_meta_data->>'provider' = 'linkedin_oidc' THEN true ELSE false END,
    false,
    NEW.raw_app_meta_data->>'provider'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
