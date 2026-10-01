import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard } from './_components/OnboardingWizard'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from('sala_profiles') as any)
    .select('full_name')
    .eq('id', user!.id)
    .maybeSingle()

  const firstName = (profile?.full_name as string | null)?.trim().split(/\s+/)[0] ?? 'ahí'

  return <OnboardingWizard firstName={firstName} />
}
