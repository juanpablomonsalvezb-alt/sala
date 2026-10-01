import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar?next=/onboarding')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from('sala_profiles') as any)
    .select('onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()

  // Ya completó el onboarding (o saltó) — no volver a mostrarlo.
  if (!profile || profile.onboarding_completed !== false) {
    redirect('/')
  }

  return <>{children}</>
}
