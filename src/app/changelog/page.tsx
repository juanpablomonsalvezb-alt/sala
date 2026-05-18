import type { Metadata } from 'next'
import Link from 'next/link'
import { execSync } from 'child_process'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Changelog — Nebbuler',
  description: 'Historial de cambios técnicos en Nebbuler. Cada release con su fecha, commits y descripción.',
  alternates: { canonical: 'https://nebbuler.com/changelog' },
  openGraph: {
    title: 'Changelog — Nebbuler',
    description: 'Historial de cambios.',
    url: 'https://nebbuler.com/changelog',
    type: 'website',
  },
}

type Entry = { date: string; title: string; commits: { hash: string; msg: string }[] }

// En producción esto se genera con git log durante el build.
// En desarrollo / cuando git no está disponible, usamos un fallback hardcoded.
function getChangelog(): Entry[] {
  try {
    const raw = execSync('git log --pretty=format:"%H|%ad|%s" --date=short --no-merges -100', {
      encoding: 'utf-8',
      cwd: process.cwd(),
    })
    const lines = raw.trim().split('\n').filter(Boolean)
    const byDate: Record<string, { hash: string; msg: string }[]> = {}
    for (const line of lines) {
      const [hash, date, ...msgParts] = line.split('|')
      const msg = msgParts.join('|')
      if (!byDate[date]) byDate[date] = []
      byDate[date].push({ hash: hash.slice(0, 7), msg })
    }
    return Object.entries(byDate)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([date, commits]) => {
        const title = commits[0]?.msg.split(':')[0] ?? 'Cambios'
        return { date, title, commits }
      })
      .slice(0, 30)
  } catch {
    return [
      {
        date: '2026-05-17',
        title: 'Sistema de pagos endurecido + AEO masivo',
        commits: [
          { hash: 'main', msg: 'fix(security): tokens MP a tabla separada con RLS estricta' },
          { hash: 'main', msg: 'fix(payments): críticos C1-C5 del sistema de pagos' },
          { hash: 'main', msg: 'feat(aeo): llms.txt, /vs/[competidor], /monetizar, HowTo schemas' },
        ],
      },
    ]
  }
}

export default function ChangelogPage() {
  const entries = getChangelog()

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold">NEBBULER</Link>
            <Link href="/roadmap" className="font-sans text-[12px] text-[#666] hover:text-[#121212]">Ver roadmap →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">Changelog</p>
        <h1 className="font-serif text-[2.5rem] font-bold leading-[1.1] mb-4">Cambios técnicos</h1>
        <p className="font-sans text-[17px] text-[#444] leading-relaxed mb-12">
          Historial de cambios derivado directamente de los commits del repositorio.
          Cada entrada es un día con uno o varios commits. Los <code>hash</code> linkean al repositorio.
        </p>

        <ul className="space-y-10">
          {entries.map((entry) => (
            <li key={entry.date} className="border-l-2 border-[#DEDEDE] pl-6">
              <p className="font-sans text-[12px] uppercase tracking-wider text-[#999] mb-1">{entry.date}</p>
              <h2 className="font-serif text-[1.3rem] font-bold mb-3">{entry.title}</h2>
              <ul className="space-y-1.5">
                {entry.commits.map((c, i) => (
                  <li key={i} className="text-[13px] text-[#444] font-mono leading-snug">
                    <span className="text-[#C41C1C] mr-2">{c.hash}</span>
                    <span>{c.msg}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <section className="mt-16 pt-8 border-t border-[#DEDEDE] text-center text-[14px] text-[#666]">
          Para ver qué viene: <Link href="/roadmap" className="text-[#C41C1C] underline">/roadmap</Link>
        </section>
      </main>
    </div>
  )
}
