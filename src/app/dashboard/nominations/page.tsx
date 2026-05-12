'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

interface Nomination {
  id: string
  creator_name: string
  creator_specialty: string
  creator_bio: string | null
  creator_linkedin: string | null
  discipline_id: string
  nominator_email: string
  why_nominate: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
  created_at: string
}

export default function NominationsDashboard() {
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchNominations()
  }, [])

  async function fetchNominations() {
    try {
      setLoading(true)
      const query = supabase
        .from('sala_creator_nominations')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setNominations(data || [])
    } catch (error) {
      console.error('Error fetching nominations:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      setUpdatingId(id)
      const { error } = await supabase
        .from('sala_creator_nominations')
        .update({
          status: newStatus,
          notes: notes || null,
        })
        .eq('id', id)

      if (error) throw error

      setSelectedId(null)
      setNotes('')
      fetchNominations()
    } catch (error) {
      console.error('Error updating nomination:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredNominations = filter === 'all'
    ? nominations
    : nominations.filter(n => n.status === filter)

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
            <div className="font-sans text-[12px] text-[#666]">
              Dashboard Administrativo
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] mb-4">
            Nominaciones de Creadores
          </h1>
          <p className="font-sans text-[15px] text-[#666]">
            Total: {nominations.length} nominaciones
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-8">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => {
                setFilter(status)
                fetchNominations()
              }}
              className={`font-sans text-[12px] font-bold px-4 py-2 border transition-colors ${
                filter === status
                  ? 'bg-[#C41C1C] text-white border-[#C41C1C]'
                  : 'border-[#DEDEDE] text-[#666] hover:border-[#C41C1C]'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendientes' : status === 'approved' ? 'Aprobadas' : 'Rechazadas'}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-sans text-[14px] text-[#999]">Cargando...</p>
          </div>
        ) : filteredNominations.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-sans text-[14px] text-[#999]">No hay nominaciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#DEDEDE]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DEDEDE] bg-[#F7F7F7]">
                  <th className="font-sans text-[12px] font-bold text-[#121212] px-4 py-3 text-left">
                    Creador
                  </th>
                  <th className="font-sans text-[12px] font-bold text-[#121212] px-4 py-3 text-left">
                    Especialidad
                  </th>
                  <th className="font-sans text-[12px] font-bold text-[#121212] px-4 py-3 text-left">
                    Disciplina
                  </th>
                  <th className="font-sans text-[12px] font-bold text-[#121212] px-4 py-3 text-left">
                    Estado
                  </th>
                  <th className="font-sans text-[12px] font-bold text-[#121212] px-4 py-3 text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredNominations.map(nomination => (
                  <tr key={nomination.id} className="border-b border-[#DEDEDE] hover:bg-[#FAFAFA]">
                    <td className="font-sans text-[13px] text-[#121212] px-4 py-3">
                      <p className="font-bold">{nomination.creator_name}</p>
                      <p className="text-[#999] text-[11px] mt-1">{nomination.nominator_email}</p>
                    </td>
                    <td className="font-sans text-[13px] text-[#666] px-4 py-3">
                      {nomination.creator_specialty}
                    </td>
                    <td className="font-sans text-[13px] text-[#666] px-4 py-3">
                      {nomination.discipline_id}
                    </td>
                    <td className="font-sans text-[12px] px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold ${
                          nomination.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : nomination.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {nomination.status === 'pending'
                          ? 'Pendiente'
                          : nomination.status === 'approved'
                          ? 'Aprobada'
                          : 'Rechazada'}
                      </span>
                    </td>
                    <td className="font-sans text-[12px] px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedId(selectedId === nomination.id ? null : nomination.id)}
                        className="text-[#C41C1C] font-bold hover:underline"
                      >
                        {selectedId === nomination.id ? 'Cerrar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail modal */}
        {selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              {nominations.find(n => n.id === selectedId) && (
                <>
                  <h2 className="font-serif text-[24px] font-bold text-[#121212] mb-6">
                    {nominations.find(n => n.id === selectedId)?.creator_name}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="font-sans text-[11px] font-bold uppercase text-[#999] mb-1">
                        Especialidad
                      </p>
                      <p className="font-sans text-[14px] text-[#121212]">
                        {nominations.find(n => n.id === selectedId)?.creator_specialty}
                      </p>
                    </div>

                    <div>
                      <p className="font-sans text-[11px] font-bold uppercase text-[#999] mb-1">
                        Biografía
                      </p>
                      <p className="font-sans text-[14px] text-[#666] leading-relaxed">
                        {nominations.find(n => n.id === selectedId)?.creator_bio || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="font-sans text-[11px] font-bold uppercase text-[#999] mb-1">
                        Por qué lo recomienda
                      </p>
                      <p className="font-sans text-[14px] text-[#666] leading-relaxed">
                        {nominations.find(n => n.id === selectedId)?.why_nominate}
                      </p>
                    </div>

                    <div>
                      <p className="font-sans text-[11px] font-bold uppercase text-[#999] mb-1">
                        LinkedIn o web
                      </p>
                      <p className="font-sans text-[14px]">
                        {nominations.find(n => n.id === selectedId)?.creator_linkedin ? (
                          <a
                            href={nominations.find(n => n.id === selectedId)?.creator_linkedin!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C41C1C] hover:underline"
                          >
                            Ver perfil →
                          </a>
                        ) : (
                          '—'
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-sans text-[11px] font-bold uppercase text-[#999] mb-1">
                        Email del nominador
                      </p>
                      <p className="font-sans text-[14px] text-[#121212]">
                        {nominations.find(n => n.id === selectedId)?.nominator_email}
                      </p>
                    </div>
                  </div>

                  {/* Status update section */}
                  <div className="space-y-4 pt-6 border-t border-[#DEDEDE]">
                    <div>
                      <label className="block font-sans text-[12px] font-bold text-[#121212] mb-2">
                        Notas (opcional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full font-sans text-[14px] px-3 py-2 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                        placeholder="Notas internas..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(selectedId, 'approved')}
                        disabled={updatingId === selectedId}
                        className="flex-1 font-sans text-[12px] font-bold px-4 py-3 bg-green-600 text-white hover:bg-green-700 disabled:bg-[#999] transition-colors"
                      >
                        {updatingId === selectedId ? 'Guardando...' : 'Aprobar'}
                      </button>
                      <button
                        onClick={() => updateStatus(selectedId, 'rejected')}
                        disabled={updatingId === selectedId}
                        className="flex-1 font-sans text-[12px] font-bold px-4 py-3 bg-red-600 text-white hover:bg-red-700 disabled:bg-[#999] transition-colors"
                      >
                        {updatingId === selectedId ? 'Guardando...' : 'Rechazar'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedId(null)}
                    className="w-full mt-6 font-sans text-[12px] font-bold px-4 py-2 border border-[#DEDEDE] text-[#666] hover:bg-[#F7F7F7] transition-colors"
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
