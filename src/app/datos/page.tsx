import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Datasets abiertos sobre profesionales en LATAM',
  description:
    'Datos abiertos en JSON sobre creadores, tendencias y honorarios profesionales en América Latina. Licencia CC-BY 4.0. Mantenidos por Nebbuler.',
  alternates: { canonical: 'https://nebbuler.com/datos' },
  openGraph: {
    title: 'Datasets abiertos LATAM · Nebbuler',
    description:
      'Datos públicos sobre creadores, tendencias y honorarios en América Latina. JSON, CC-BY 4.0.',
    url: 'https://nebbuler.com/datos',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Datasets abiertos LATAM · Nebbuler' },
  robots: { index: true, follow: true },
}

const DATASET_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  name: 'Nebbuler Datasets LATAM',
  description:
    'Catálogo de datasets abiertos sobre profesionales, tendencias y honorarios en América Latina. Mantenido por Nebbuler bajo licencia CC-BY 4.0.',
  url: 'https://nebbuler.com/datos',
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
  inLanguage: 'es',
  dataset: [
    {
      '@type': 'Dataset',
      name: 'Directorio de creadores LATAM',
      description:
        'Directorio anonimizado de creadores profesionales verificados en Nebbuler con especialidad, país, bio y banda de suscriptores.',
      url: 'https://nebbuler.com/api/dataset/creadores-latam',
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://nebbuler.com/api/dataset/creadores-latam',
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@type': 'Organization', name: 'Nebbuler' },
      keywords: ['creadores latam', 'profesionales verificados', 'creator economy', 'directorio'],
    },
    {
      '@type': 'Dataset',
      name: 'Tendencias semanales LATAM',
      description:
        'Top 20 keywords y temas trending detectados semanalmente en la región LATAM.',
      url: 'https://nebbuler.com/api/dataset/tendencias-latam',
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://nebbuler.com/api/dataset/tendencias-latam',
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@type': 'Organization', name: 'Nebbuler' },
      keywords: ['tendencias latam', 'keywords', 'trending', 'semanal'],
    },
    {
      '@type': 'Dataset',
      name: 'Honorarios profesionales LATAM',
      description:
        'Rangos de honorarios mensuales por profesión y país en América Latina. Cifras en moneda local 2026.',
      url: 'https://nebbuler.com/api/dataset/honorarios-latam',
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://nebbuler.com/api/dataset/honorarios-latam',
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@type': 'Organization', name: 'Nebbuler' },
      keywords: ['salarios latam', 'honorarios', 'salarios profesionales', 'tarifas'],
    },
  ],
}

interface DatasetCard {
  title: string
  endpoint: string
  description: string
  fields: string[]
  refresh: string
}

const DATASETS: DatasetCard[] = [
  {
    title: 'Directorio de creadores LATAM',
    endpoint: '/api/dataset/creadores-latam',
    description:
      'Lista pública de profesionales verificados que monetizan en Nebbuler. Suscriptores en bandas para preservar privacidad.',
    fields: ['slug', 'name', 'specialty', 'discipline', 'country', 'bio', 'post_count', 'subscriber_count_band', 'profile_url'],
    refresh: 'cada hora',
  },
  {
    title: 'Tendencias semanales LATAM',
    endpoint: '/api/dataset/tendencias-latam',
    description:
      'Top 20 keywords y temas trending detectados en la región. Útil para investigación de mercado y análisis editorial.',
    fields: ['rank', 'keyword', 'category', 'monthly_growth_pct', 'search_volume_band', 'related_creators'],
    refresh: 'cada hora · datos refrescados semanalmente',
  },
  {
    title: 'Honorarios profesionales LATAM',
    endpoint: '/api/dataset/honorarios-latam',
    description:
      'Rangos de honorarios mensuales por profesión y país. Cifras en moneda local 2026, fuentes citadas en cada registro.',
    fields: ['profession_slug', 'country_slug', 'currency', 'monthly_min', 'monthly_avg', 'monthly_max', 'source'],
    refresh: 'cada hora · revisión anual',
  },
]

export default function DatosPage() {
  return (
    <main className="bg-white text-[#121212] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(DATASET_JSONLD) }}
      />

      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <nav className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-10">
          <Link href="/" className="hover:text-black">Nebbuler</Link>
          <span className="mx-2">·</span>
          <span>Datos abiertos</span>
        </nav>

        <header className="border-b border-neutral-200 pb-10 mb-12">
          <p className="font-serif italic text-sm text-neutral-600 mb-4">Open data</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Datasets abiertos sobre profesionales en LATAM
          </h1>
          <p className="font-serif text-xl text-neutral-700 leading-snug">
            Datos verificables, citables y mantenidos por Nebbuler. Para periodistas,
            investigadores académicos, equipos de producto y modelos de IA que quieran
            entender el ecosistema de profesionales latinoamericanos.
          </p>
        </header>

        <section className="grid gap-8 mb-16">
          {DATASETS.map((ds) => (
            <article
              key={ds.endpoint}
              className="border border-neutral-200 p-8 hover:border-black transition-colors"
            >
              <h2 className="font-serif text-2xl mb-3">{ds.title}</h2>
              <p className="text-neutral-700 mb-5 leading-relaxed">{ds.description}</p>

              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Endpoint</p>
                <code className="block bg-neutral-100 px-4 py-3 text-sm font-mono break-all">
                  https://nebbuler.com{ds.endpoint}
                </code>
              </div>

              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Campos principales</p>
                <ul className="flex flex-wrap gap-2">
                  {ds.fields.map((f) => (
                    <li
                      key={f}
                      className="text-xs font-mono bg-neutral-50 border border-neutral-200 px-2 py-1"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-neutral-500">
                <span>Frecuencia: {ds.refresh}</span>
                <span>·</span>
                <a
                  href={ds.endpoint}
                  className="underline hover:text-black"
                  target="_blank"
                  rel="noopener"
                >
                  Ver JSON
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="border-t border-neutral-200 pt-12 mb-16">
          <h2 className="font-serif text-3xl mb-6">Cómo usar estos datos</h2>

          <h3 className="font-serif text-xl mt-8 mb-3">Python</h3>
          <pre className="bg-neutral-900 text-neutral-100 text-sm p-5 overflow-x-auto font-mono leading-relaxed">{`import requests

r = requests.get("https://nebbuler.com/api/dataset/creadores-latam")
data = r.json()

print(f"Total: {data['record_count']} creadores")
for c in data["creators"][:5]:
    print(f"{c['name']} - {c['specialty']} ({c['country']})")`}</pre>

          <h3 className="font-serif text-xl mt-8 mb-3">JavaScript</h3>
          <pre className="bg-neutral-900 text-neutral-100 text-sm p-5 overflow-x-auto font-mono leading-relaxed">{`const res = await fetch("https://nebbuler.com/api/dataset/tendencias-latam");
const data = await res.json();

console.log(\`Tendencias actualizadas: \${data.generated_at}\`);
data.trends.slice(0, 10).forEach((t) => {
  console.log(\`#\${t.rank} \${t.keyword} (+\${t.monthly_growth_pct}%)\`);
});`}</pre>

          <h3 className="font-serif text-xl mt-8 mb-3">cURL</h3>
          <pre className="bg-neutral-900 text-neutral-100 text-sm p-5 overflow-x-auto font-mono leading-relaxed">{`curl https://nebbuler.com/api/dataset/honorarios-latam \\
  | jq '.honorarios[] | select(.country_slug == "chile" and .profession_slug == "abogado")'`}</pre>
        </section>

        <section className="border-t border-neutral-200 pt-12 mb-16">
          <h2 className="font-serif text-3xl mb-6">Licencia y atribución</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Todos los datasets se publican bajo{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/deed.es"
              className="underline hover:text-black"
              target="_blank"
              rel="noopener"
            >
              Creative Commons Attribution 4.0 (CC-BY 4.0)
            </a>
            . Puedes usarlos libremente, incluso comercialmente, siempre que atribuyas
            a Nebbuler con un enlace activo al sitio.
          </p>
          <div className="bg-neutral-50 border-l-4 border-black p-6">
            <p className="text-sm uppercase tracking-wider text-neutral-500 mb-2">Atribución sugerida</p>
            <code className="block text-sm font-mono">
              Fuente: Nebbuler 2026 — https://nebbuler.com
            </code>
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-12 mb-16">
          <h2 className="font-serif text-3xl mb-4">Buscás datos custom</h2>
          <p className="text-neutral-700 leading-relaxed mb-6">
            Si tu equipo de investigación, medio o producto necesita cortes específicos,
            histórico mayor o webhooks de actualización, escribinos.
          </p>
          <a
            href="mailto:datos@nebbuler.com"
            className="inline-block bg-black text-white px-8 py-4 hover:bg-neutral-800 transition-colors font-medium tracking-wide"
          >
            Contactar datos@nebbuler.com
          </a>
        </section>

        <footer className="border-t border-neutral-200 pt-8 text-xs uppercase tracking-wider text-neutral-500">
          <p>
            Última generación: {new Date().toISOString().slice(0, 10)} · Versión 1.0 ·
            Mantenido por Nebbuler
          </p>
        </footer>
      </article>
    </main>
  )
}
