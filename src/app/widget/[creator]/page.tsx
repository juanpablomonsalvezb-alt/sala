import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { creators } from '@/data/creators'
import { WidgetInstaller } from './widget-installer'

interface Props {
  params: Promise<{ creator: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { creator: slug } = await params
  const found = creators.find((c) => c.slug === slug)
  if (!found) return {}
  return {
    title: `Widget de ${found.name} · Nebbuler`,
    description: `Instala el widget de Nebbuler de ${found.name} en tu sitio web para mostrar tus últimas publicaciones y aumentar suscriptores.`,
    robots: 'noindex',
  }
}

export default async function WidgetPage({ params }: Props) {
  const { creator: slug } = await params
  const found = creators.find((c) => c.slug === slug)
  if (!found) notFound()

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header mínimo */}
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-serif text-[22px] font-bold tracking-[-0.02em] text-[#121212]">
            NEBBULER
          </a>
          <span className="font-sans text-[12px] text-[#666] uppercase tracking-[0.06em]">
            Instalar widget
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="mb-10">
          <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#C41C1C] mb-2">
            Tu widget de suscripción
          </p>
          <h1 className="font-serif text-[28px] font-bold text-[#121212] leading-tight mb-3">
            Instala tu widget en cualquier sitio
          </h1>
          <p className="font-sans text-[14px] text-[#666] max-w-xl leading-relaxed">
            Copia el código HTML y pégalo en tu blog, sitio web o plataforma. El widget se actualiza
            automáticamente con tus nuevas publicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Preview del widget */}
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] mb-3">
              Previsualización
            </p>
            <div className="flex justify-center lg:justify-start">
              <iframe
                src={`/embed/${slug}`}
                width={300}
                height={420}
                frameBorder={0}
                style={{ borderRadius: '4px', display: 'block' }}
                title={`Widget de ${found.name}`}
              />
            </div>
          </div>

          {/* Instalador con selector de tamaño y código */}
          <WidgetInstaller slug={slug} creatorName={found.name} />
        </div>

        {/* Nota informativa */}
        <div className="mt-10 border border-[#DEDEDE] bg-white rounded p-4 max-w-xl">
          <p className="font-sans text-[12px] text-[#666] leading-relaxed">
            <span className="font-semibold text-[#121212]">Actualización automática.</span>{' '}
            Este widget se actualiza automáticamente con tus nuevas publicaciones. No necesitas
            cambiar el código en tu sitio.
          </p>
        </div>
      </div>
    </div>
  )
}
