// Formbricks in-app surveys — SURVEYS_ENABLED=true/false
// Only triggers on positive events, never in payment or critical flows
// Initialized only for authenticated users, after full render

export const SURVEYS_ENABLED = process.env.SURVEYS_ENABLED !== 'false'
export const FORMBRICKS_ENV_ID = process.env.FORMBRICKS_ENV_ID ?? ''

// Survey trigger event names (must match Formbricks dashboard configuration)
export type SurveyTrigger =
  | 'first_content_published'  // After creator publishes their first post
  | 'seven_days_active'        // After 7 days of active use

export async function initFormbricks(userId: string, email: string): Promise<void> {
  if (typeof window === 'undefined') return
  if (!SURVEYS_ENABLED || !FORMBRICKS_ENV_ID) return

  try {
    const { default: formbricks } = await import('@formbricks/js')
    await formbricks.setup({
      environmentId: FORMBRICKS_ENV_ID,
      appUrl: 'https://app.formbricks.com',
    })
    await formbricks.setEmail(email)
    await formbricks.setAttribute('userId', userId)
  } catch {
    // Never throw — surveys are non-critical
  }
}

export async function triggerSurvey(event: SurveyTrigger): Promise<void> {
  if (typeof window === 'undefined') return
  if (!SURVEYS_ENABLED || !FORMBRICKS_ENV_ID) return

  try {
    const { default: formbricks } = await import('@formbricks/js')
    // Track event by setting a special attribute — Formbricks uses this for survey triggers
    await formbricks.setAttribute('last_event', event)
  } catch {
    // Never throw
  }
}
