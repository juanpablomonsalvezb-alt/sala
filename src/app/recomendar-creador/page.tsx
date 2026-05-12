'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DISCIPLINES_LIST = [
  { id: 'economia', name: 'Economía' },
  { id: 'finanzas', name: 'Finanzas' },
  { id: 'derecho', name: 'Derecho' },
  { id: 'medicina', name: 'Medicina' },
  { id: 'salud-publica', name: 'Salud Pública' },
  { id: 'nutricion', name: 'Nutrición' },
  { id: 'psicologia', name: 'Psicología' },
  { id: 'tecnologia', name: 'Tecnología' },
  { id: 'ingenieria', name: 'Ingeniería' },
  { id: 'arquitectura', name: 'Arquitectura' },
  { id: 'negocios', name: 'Negocios' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'comunicaciones', name: 'Comunicaciones' },
  { id: 'educacion', name: 'Educación' },
  { id: 'politica', name: 'Ciencia Política' },
  { id: 'sociologia', name: 'Sociología' },
]

export default function RecomendarCreadorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    creatorName: '',
    creatorSpecialty: '',
    creatorBio: '',
    creatorLinkedIn: '',
    discipline: '',
    nominatorEmail: '',
    whyNominate: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/nominations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push('/directorio')
        }, 3000)
      } else {
        alert('Error al enviar la nominación. Intenta de nuevo.')
      }
    } catch (error) {
      console.error(error)
      alert('Error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#C41C1C] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-3">
            ¡Nominación enviada!
          </h2>
          <p className="font-sans text-[15px] text-[#666] mb-6 leading-relaxed">
            Gracias por recomendar a {formData.creatorName}. Nuestro equipo revisará su nominación y te contactaremos si tenemos más preguntas.
          </p>
          <p className="font-sans text-[13px] text-[#999]">
            Redirigiendo al directorio...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
            <Link
              href="/directorio"
              className="font-sans text-[12px] font-medium text-[#666] hover:text-[#121212] transition-colors"
            >
              Ver directorio →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <nav className="font-sans text-[12px] text-[#999] mb-8">
          <Link href="/" className="hover:text-[#121212]">
            Inicio
          </Link>
          <span className="mx-2">·</span>
          <span className="text-[#121212]">Recomendar creador</span>
        </nav>

        <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            Comunidad
          </p>
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
            Recomienda un creador
          </h1>
          <p className="font-sans text-[17px] text-[#555] leading-relaxed">
            ¿Conoces a un especialista que debería estar en Nebbuler? Cuéntanos sobre él y ayúdanos a crecer la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mb-16">
          <fieldset className="space-y-6">
            <legend className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Sobre el creador
            </legend>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.creatorName}
                onChange={e => setFormData({ ...formData, creatorName: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                Especialidad *
              </label>
              <input
                type="text"
                required
                value={formData.creatorSpecialty}
                onChange={e => setFormData({ ...formData, creatorSpecialty: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                placeholder="p.ej., Derecho Laboral, Macroeconomía"
              />
            </div>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                Disciplina *
              </label>
              <select
                required
                value={formData.discipline}
                onChange={e => setFormData({ ...formData, discipline: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
              >
                <option value="">Selecciona una disciplina</option>
                {DISCIPLINES_LIST.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                Biografía profesional
              </label>
              <textarea
                value={formData.creatorBio}
                onChange={e => setFormData({ ...formData, creatorBio: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                placeholder="Cuéntanos sobre su experiencia y logros profesionales..."
                rows={4}
              />
            </div>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                LinkedIn o web profesional
              </label>
              <input
                type="url"
                value={formData.creatorLinkedIn}
                onChange={e => setFormData({ ...formData, creatorLinkedIn: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Tu información
            </legend>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                Tu email *
              </label>
              <input
                type="email"
                required
                value={formData.nominatorEmail}
                onChange={e => setFormData({ ...formData, nominatorEmail: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                placeholder="tu@email.com"
              />
              <p className="font-sans text-[11px] text-[#999] mt-2">
                Usaremos esto para contactarte si tenemos preguntas
              </p>
            </div>

            <div>
              <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                ¿Por qué lo recomiendas? *
              </label>
              <textarea
                required
                value={formData.whyNominate}
                onChange={e => setFormData({ ...formData, whyNominate: e.target.value })}
                className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                placeholder="Cuéntanos qué lo hace especial y por qué crees que sería un gran aporte para Nebbuler..."
                rows={4}
              />
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] disabled:bg-[#999] transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar nominación →'}
          </button>

          <p className="font-sans text-[12px] text-[#999] text-center">
            Al enviar, aceptas que revisen tu información de contacto. No compartiremos tu email sin permiso.
          </p>
        </form>
      </main>
    </div>
  )
}
