'use client'

import { useState, useEffect, useCallback } from 'react'

const CHECK_LABELS: Record<string, string> = {
  database: 'Base de datos',
  supabase_auth: 'Supabase Auth',
  resend_email: 'Resend (email)',
  mp_webhook_secret: 'MP Webhook Secret',
  mp_access_token: 'MP Access Token',
  mp_app_credentials: 'MP App Credentials',
  cron_secret: 'CRON_SECRET',
  social_tables: 'Tablas sociales',
  payment_tables: 'Tablas de pago',
  precios_cta: 'CTA de precios',
  pages_count: 'Páginas generadas',
}

const CHECK_DESCRIPTIONS: Record<string, string> = {
  database: 'Conexión a sala_creators con latencia < 3s',
  supabase_auth: 'Variables de entorno de Supabase',
  resend_email: 'RESEND_API_KEY válida (prefijo re_)',
  mp_webhook_secret: 'MP_WEBHOOK_SECRET definida',
  mp_access_token: 'MP_ACCESS_TOKEN definida',
  mp_app_credentials: 'MP_APP_ID y MP_CLIENT_SECRET (OAuth)',
  cron_secret: 'CRON_SECRET para proteger crons',
  social_tables: 'social_images, social_opportunities, social_posted_content',
  payment_tables: 'sala_subscriptions, sala_creators, sala_profiles',
  precios_cta: 'CTA no apunta a /abrir',
  pages_count: 'Páginas SEO generadas en DB',
}

const FIX_INSTRUCTIONS: Record<string, string> = {
  database: 'Verifica SUPABASE_SERVICE_ROLE_KEY en Vercel → Settings → Environment Variables.',
  supabase_auth: 'Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel.',
  resend_email: 'Agrega RESEND_API_KEY en Vercel (debe empezar con "re_").',
  mp_webhook_secret: 'Agrega MP_WEBHOOK_SECRET en Vercel → Settings → Environment Variables.',
  mp_access_token: 'Agrega MP_ACCESS_TOKEN en Vercel → Settings → Environment Variables.',
  mp_app_credentials: 'Agrega MP_APP_ID y MP_CLIENT_SECRET en Vercel → Settings → Environment Variables.',
  cron_secret: 'Agrega CRON_SECRET en Vercel → Settings → Environment Variables.',
  social_tables: 'Ejecuta la migration 20260514000000_social_monitor.sql en Supabase.',
  payment_tables: 'Verifica que las tablas sala_subscriptions, sala_creators y sala_profiles existan.',
  precios_cta: 'En PreciosClient.tsx reemplaza /abrir por /registro en el ctaHref del plan de pago.',
  pages_count: 'Verifica que la tabla generated_pages exista y el cron /api/cron/generate-pages funcione.',
}

const CRITICAL_CHECKS = new Set(['database', 'mp_webhook_secret', 'mp_access_token', 'payment_tables'])

interface CheckResult {
  ok: boolean
  latency_ms?: number
  error?: string
  tables?: string[]
  href?: string
  count?: number
}

interface HealthData {
  ok: boolean
  timestamp: string
  checks: Record<string, CheckResult>
}

interface HistoryEntry {
  id: string
  checked_at: string
  all_ok: boolean
  failed_checks: string[]
  alerted: boolean
}

function StatusIcon({ ok, warning }: { ok: boolean; warning?: boolean }) {
  if (ok) return <span className="text-[18px]">✅</span>
  if (warning) return <span className="text-[18px]">⚠️</span>
  return <span className="text-[18px]">❌</span>
}

function CheckRow({ name, result }: { name: string; result: CheckResult }) {
  const isCritical = CRITICAL_CHECKS.has(name)
  const isWarning = !result.ok && !isCritical

  return (
    <div className={`px-6 py-4 border-b border-[#DEDEDE] last:border-b-0 ${!result.ok ? (isCritical ? 'bg-[#FFF5F5]' : 'bg-[#FFFBF0]') : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-0.5">
          <StatusIcon ok={result.ok} warning={isWarning} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-semibold text-[#121212]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              {CHECK_LABELS[name] ?? name}
            </span>
            {isCritical && (
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] bg-[#C41C1C] text-white px-1.5 py-0.5">
                CRÍTICO
              </span>
            )}
            {result.latency_ms !== undefined && (
              <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${result.latency_ms < 500 ? 'bg-green-50 text-green-700' : result.latency_ms < 1500 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                {result.latency_ms}ms
              </span>
            )}
            {result.count !== undefined && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#F7F7F7] text-[#666]">
                {result.count} páginas
              </span>
            )}
            {result.href && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#F7F7F7] text-[#666]">
                {result.href}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#666] mt-0.5" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            {CHECK_DESCRIPTIONS[name] ?? ''}
          </p>
          {result.error && (
            <p className="text-[12px] text-[#C41C1C] mt-1 font-mono bg-[#FFF5F5] px-2 py-1 rounded">
              {result.error}
            </p>
          )}
          {result.tables && (
            <p className="text-[11px] text-[#888] mt-1">
              Tablas OK: {result.tables.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SaludClient({ initialHistory }: { initialHistory: HistoryEntry[] }) {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(30)

  const fetchHealth = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      const data: HealthData = await res.json()
      setHealth(data)
      setLastRefresh(new Date())
      setCountdown(30)
    } catch (e) {
      console.error('Error fetching health:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchHealth()
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [fetchHealth])

  const checks = health?.checks ?? {}
  const failedChecks = Object.keys(checks).filter((k) => !checks[k].ok)
  const criticalFailed = failedChecks.filter((k) => CRITICAL_CHECKS.has(k))
  const warningChecks = failedChecks.filter((k) => !CRITICAL_CHECKS.has(k))

  return (
    <main className="flex-1 overflow-y-auto px-8 py-7 space-y-6">

      {/* Estado global */}
      <div className={`border p-6 flex items-center justify-between gap-4 ${
        loading ? 'bg-[#F7F7F7] border-[#DEDEDE]' :
        health?.ok ? 'bg-[#F0FFF4] border-[#86EFAC]' : 'bg-[#FFF5F5] border-[#FECACA]'
      }`}>
        <div className="flex items-center gap-4">
          <span className="text-[32px]">
            {loading ? '⏳' : health?.ok ? '✅' : '❌'}
          </span>
          <div>
            <p className="text-[18px] font-bold text-[#121212]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              {loading ? 'Verificando sistemas...' :
               health?.ok ? 'Todos los sistemas operativos' :
               `${criticalFailed.length} crítico${criticalFailed.length !== 1 ? 's' : ''} · ${warningChecks.length} advertencia${warningChecks.length !== 1 ? 's' : ''}`}
            </p>
            {health?.timestamp && (
              <p className="text-[12px] text-[#666]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                Última verificación: {new Date(health.timestamp).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[12px] text-[#888]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            Refresca en {countdown}s
          </span>
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="bg-[#121212] text-white text-[12px] font-semibold px-4 py-2 hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {loading ? 'Verificando...' : 'Verificar ahora'}
          </button>
        </div>
      </div>

      {/* Acciones requeridas */}
      {!loading && failedChecks.length > 0 && (
        <section>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-bold mb-3" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            Acciones requeridas
          </p>
          <div className="bg-white border border-[#DEDEDE] divide-y divide-[#DEDEDE]">
            {failedChecks.map((key) => {
              const isCritical = CRITICAL_CHECKS.has(key)
              return (
                <div key={key} className={`px-6 py-4 flex items-start gap-3 ${isCritical ? 'bg-[#FFF5F5]' : 'bg-[#FFFBF0]'}`}>
                  <span className="text-[16px] flex-shrink-0 pt-0.5">{isCritical ? '❌' : '⚠️'}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#121212]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                      {CHECK_LABELS[key] ?? key}
                      {isCritical && <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.12em] bg-[#C41C1C] text-white px-1.5 py-0.5">CRÍTICO</span>}
                    </p>
                    <p className="text-[13px] text-[#444] mt-0.5" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                      {FIX_INSTRUCTIONS[key] ?? 'Revisar logs en Vercel.'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Grid de checks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Críticos */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-bold mb-3" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            Críticos
          </p>
          <div className="bg-white border border-[#DEDEDE]">
            {['database', 'mp_webhook_secret', 'mp_access_token', 'payment_tables'].map((key) => (
              checks[key] ? <CheckRow key={key} name={key} result={checks[key]} /> : null
            ))}
          </div>
        </div>

        {/* Advertencias */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-bold mb-3" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            Servicios y configuración
          </p>
          <div className="bg-white border border-[#DEDEDE]">
            {['supabase_auth', 'resend_email', 'mp_app_credentials', 'cron_secret', 'social_tables', 'precios_cta', 'pages_count'].map((key) => (
              checks[key] ? <CheckRow key={key} name={key} result={checks[key]} /> : null
            ))}
          </div>
        </div>
      </section>

      {/* Historial 7 días */}
      <section>
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-bold mb-3" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          Historial de verificaciones (últimos 7 días)
        </p>
        {initialHistory.length === 0 ? (
          <div className="bg-white border border-[#DEDEDE] px-6 py-8 text-center">
            <p className="text-[14px] text-[#666]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              Sin registros aún. El cron diario (06:00 UTC) comenzará a guardar el historial.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#DEDEDE]">
            <div className="grid px-6 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]" style={{ gridTemplateColumns: '1fr 80px 1fr 80px' }}>
              {['Fecha', 'Estado', 'Sistemas con fallo', 'Alerta'].map(h => (
                <span key={h} className="text-[11px] uppercase tracking-[0.1em] text-[#666] font-medium" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>{h}</span>
              ))}
            </div>
            {initialHistory.map((entry, i) => (
              <div
                key={entry.id}
                className={`grid px-6 py-3.5 items-center ${i !== initialHistory.length - 1 ? 'border-b border-[#DEDEDE]' : ''}`}
                style={{ gridTemplateColumns: '1fr 80px 1fr 80px' }}
              >
                <span className="text-[13px] text-[#444]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  {new Date(entry.checked_at).toLocaleString('es-CL', { timeZone: 'America/Santiago', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[14px]">{entry.all_ok ? '✅' : '❌'}</span>
                <span className="text-[12px] text-[#666]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  {entry.failed_checks.length === 0 ? '—' : entry.failed_checks.map(k => CHECK_LABELS[k] ?? k).join(', ')}
                </span>
                <span className="text-[12px]">{entry.alerted ? '📧' : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {lastRefresh && (
        <p className="text-[11px] text-[#bbb] text-right" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          Actualizado: {lastRefresh.toLocaleTimeString('es-CL')} · Auto-refresco cada 30s
        </p>
      )}
    </main>
  )
}
