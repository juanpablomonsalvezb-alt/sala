// GrowthBook A/B testing — EXPERIMENTS_ENABLED=true/false
// Only controls UI/copy in marketing and onboarding pages
// Never controls critical business logic

import { GrowthBook } from '@growthbook/growthbook-react'

export const EXPERIMENTS_ENABLED = process.env.EXPERIMENTS_ENABLED !== 'false'
export const GROWTHBOOK_CLIENT_KEY = process.env.GROWTHBOOK_CLIENT_KEY ?? ''

// Experiment feature flags — ONLY for UI/copy, never for business logic
export type ExperimentFeature =
  | 'cta_main_text'         // CTA principal del landing
  | 'subscribe_widget_pos'  // Posición del widget de suscripción
  | 'registro_copy'         // Copy de la página de registro

// Default values (control variant)
export const EXPERIMENT_DEFAULTS: Record<ExperimentFeature, string> = {
  cta_main_text: 'Empieza gratis',
  subscribe_widget_pos: 'bottom',
  registro_copy: 'Crea tu cuenta',
}

let _gb: GrowthBook | null = null

export function getGrowthBook(): GrowthBook {
  if (!_gb) {
    _gb = new GrowthBook({
      apiHost: 'https://cdn.growthbook.io',
      clientKey: GROWTHBOOK_CLIENT_KEY,
      enableDevMode: process.env.NODE_ENV === 'development',
      subscribeToChanges: true,
    })
  }
  return _gb
}

export async function initGrowthBook(attributes?: Record<string, unknown>): Promise<GrowthBook> {
  const gb = getGrowthBook()
  if (attributes) gb.setAttributes(attributes)
  if (EXPERIMENTS_ENABLED && GROWTHBOOK_CLIENT_KEY) {
    await gb.loadFeatures({ timeout: 2000 }).catch(() => {
      // Timeout or error → use defaults silently
    })
  }
  return gb
}

export function getFeatureValue(feature: ExperimentFeature, fallback: string): string {
  if (!EXPERIMENTS_ENABLED || !_gb) return fallback
  try {
    return _gb.getFeatureValue(feature, fallback) as string
  } catch {
    return fallback
  }
}
