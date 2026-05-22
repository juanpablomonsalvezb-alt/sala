import Link from 'next/link'
import type {
  GrupoHistoria,
  SeleccionHistoria,
  EnfrentamientoCruzado,
  PartidoMundialista,
} from '@/lib/mundial/grupo-historia-types'
import { getPaleta } from '@/lib/mundial/colores-selecciones'

// ─────────────────────────────────────────────────────────────────────────
// HERO — blanco, letra roja, banderas horizontales
// ─────────────────────────────────────────────────────────────────────────
export function GrupoHero({ grupo }: { grupo: GrupoHistoria }) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        {/* Breadcrumb */}
        <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-6">
          Mundial 2026 · Fase de grupos · Grupo {grupo.id}
        </p>

        {/* Título */}
        <div className="flex items-start gap-6 mb-10">
          <div
            className="font-serif font-bold text-[#C41C1C] leading-none select-none hidden sm:block"
            style={{ fontSize: 'clamp(5rem, 12vw, 8rem)' }}
          >
            {grupo.id}
          </div>
          <div className="pt-2">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
              Grupo <span className="text-[#C41C1C]">{grupo.id}</span>: historia y datos
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Todo lo que necesitás saber para cubrir este grupo en el Mundial 2026
            </p>
          </div>
        </div>

        {/* Las 4 selecciones — fila horizontal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {grupo.selecciones.map((s) => {
            const p = getPaleta(s.pais)
            return (
              <div
                key={s.pais}
                className="border border-gray-200 p-4 flex flex-col items-center text-center hover:border-gray-400 transition-colors"
                style={{ borderTopColor: p.primary, borderTopWidth: 3 }}
              >
                <span className="text-4xl mb-2">{s.bandera}</span>
                <p className="font-serif font-bold text-gray-900 text-sm md:text-base leading-tight">
                  {s.pais}
                </p>
                {s.apodo && (
                  <p className="text-[10px] text-gray-400 italic mt-0.5 leading-tight">{s.apodo}</p>
                )}
                {s.fifa_ranking_actual_2026 && (
                  <p className="text-[10px] text-gray-500 mt-2 font-mono">
                    FIFA #{s.fifa_ranking_actual_2026}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// STORYLINE — editorial, fondo gris muy claro
// ─────────────────────────────────────────────────────────────────────────
export function StorylineSection({ grupo }: { grupo: GrupoHistoria }) {
  const { narrativa } = grupo
  return (
    <section className="bg-gray-50 border-b border-gray-200 py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] text-[#C41C1C] font-bold tracking-[0.25em] uppercase mb-4">
          El grupo en una historia
        </p>

        {/* Cita editorial grande */}
        <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-gray-800 leading-snug mb-10 border-l-4 border-[#C41C1C] pl-6">
          {narrativa.storyline_narrativo}
        </blockquote>

        {/* Pills de análisis */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <AnalisisPill
            label="Favorito (por data histórica)"
            value={narrativa.favorito_data_historica}
            accent
          />
          {narrativa.segundo_favorito && (
            <AnalisisPill label="Segundo favorito" value={narrativa.segundo_favorito} />
          )}
          {narrativa.underdog && (
            <AnalisisPill label="Underdog" value={narrativa.underdog} />
          )}
        </div>

        {/* Partido clave */}
        {narrativa.partido_clave_a_cubrir && (
          <div className="bg-white border border-gray-200 p-4 flex items-center gap-4">
            <div className="text-[#C41C1C] font-bold text-xs tracking-[0.2em] uppercase shrink-0">
              Partido<br />clave
            </div>
            <div className="w-px h-8 bg-gray-200 shrink-0" />
            <p className="font-serif text-lg text-gray-900 font-semibold">
              {narrativa.partido_clave_a_cubrir}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function AnalisisPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-4 border ${accent ? 'border-[#C41C1C] bg-[#C41C1C]/5' : 'border-gray-200 bg-white'}`}>
      <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">{label}</p>
      <p className={`font-serif text-sm font-semibold leading-snug ${accent ? 'text-[#C41C1C]' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// TRADING CARDS → ahora son filas de selección con datos claros
// ─────────────────────────────────────────────────────────────────────────
export function TradingCardsSection({ selecciones }: { selecciones: SeleccionHistoria[] }) {
  return (
    <section className="bg-white border-b border-gray-200 py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Las 4 selecciones
          </h2>
          <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase hidden md:block">
            Historia mundialista
          </p>
        </div>

        <div className="space-y-4">
          {selecciones.map((s) => (
            <SeleccionRow key={s.pais} s={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SeleccionRow({ s }: { s: SeleccionHistoria }) {
  const p = getPaleta(s.pais)
  const r = s.record_fase_grupos_ultimos_5_mundiales

  return (
    <article
      className="border border-gray-200 overflow-hidden"
      style={{ borderLeftColor: p.primary, borderLeftWidth: 4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100">
        <span className="text-4xl shrink-0">{s.bandera}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-xl font-bold text-gray-900 leading-none">{s.pais}</h3>
          {s.apodo && <p className="text-xs text-gray-400 italic mt-0.5">{s.apodo}</p>}
        </div>
        {s.fifa_ranking_actual_2026 && (
          <div className="text-right shrink-0">
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400">FIFA</p>
            <p className="font-mono text-xl font-bold text-gray-700">#{s.fifa_ranking_actual_2026}</p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 bg-gray-50">
        <StatCell label="Mundiales jugados" value={String(s.mundiales_jugados_total)} />
        <StatCell
          label="Títulos"
          value={String(s.titulos_mundiales)}
          highlight={s.titulos_mundiales > 0}
        />
        <StatCell label="Mejor resultado" value={s.mejor_resultado_historico} small />
        {r ? (
          <div className="p-4">
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">
              Últ. 5 Mundiales (fase grupos)
            </p>
            <div className="flex gap-3 text-sm font-mono">
              <span className="text-green-700 font-bold">{r.ganados}G</span>
              <span className="text-gray-500">{r.empatados}E</span>
              <span className="text-red-600">{r.perdidos}P</span>
            </div>
            <p className="text-[10px] text-[#C41C1C] font-bold mt-1">
              {r.porcentaje_avance_a_8vos}% pasó a 8vos
            </p>
          </div>
        ) : (
          <StatCell label="Registro grupos" value="Sin datos" small />
        )}
      </div>

      {/* Goleadores + DT + caso especial */}
      {(s.goleadores_historicos_mundiales?.length || s.dt_actual_2026 || s.capitan_2026 || s.caso_especial) ? (
        <div className="px-5 py-4 bg-white grid md:grid-cols-3 gap-5 border-t border-gray-100">
          {s.goleadores_historicos_mundiales && s.goleadores_historicos_mundiales.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
                Top goleadores en Mundiales
              </p>
              <ul className="space-y-1">
                {s.goleadores_historicos_mundiales.slice(0, 3).map((g) => (
                  <li key={g.nombre} className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate pr-2">{g.nombre}</span>
                    <span className="font-mono font-bold text-gray-900 shrink-0">{g.goles} goles</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(s.dt_actual_2026 || s.capitan_2026) && (
            <div className="space-y-2">
              {s.dt_actual_2026 && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">DT 2026</p>
                  <p className="text-sm text-gray-800 font-medium">{s.dt_actual_2026}</p>
                </div>
              )}
              {s.capitan_2026 && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Capitán</p>
                  <p className="text-sm text-gray-800 font-medium">{s.capitan_2026}</p>
                </div>
              )}
            </div>
          )}

          {s.caso_especial && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">Nota</p>
              <p className="text-sm text-gray-600 italic leading-relaxed">{s.caso_especial}</p>
            </div>
          )}
        </div>
      ) : null}
    </article>
  )
}

function StatCell({
  label,
  value,
  highlight,
  small,
}: {
  label: string
  value: string
  highlight?: boolean
  small?: boolean
}) {
  return (
    <div className="p-4">
      <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-1">{label}</p>
      <p
        className={`font-serif font-bold leading-tight ${
          small ? 'text-sm text-gray-700' : 'text-2xl'
        } ${highlight ? 'text-[#C41C1C]' : 'text-gray-900'}`}
      >
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// MATCHUPS — cara a cara en mundiales, estilo marcador limpio
// ─────────────────────────────────────────────────────────────────────────
export function MatchupsSection({
  enfrentamientos,
  banderaMap,
}: {
  enfrentamientos: EnfrentamientoCruzado[]
  banderaMap: Record<string, string>
}) {
  return (
    <section className="bg-gray-50 border-b border-gray-200 py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Cara a cara en Mundiales
          </h2>
          <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase hidden md:block">
            6 cruces posibles
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {enfrentamientos.map((e, i) => (
            <MatchupCard
              key={`${e.team1}-${e.team2}-${i}`}
              e={e}
              banderaMap={banderaMap}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function MatchupCard({
  e,
  banderaMap,
}: {
  e: EnfrentamientoCruzado
  banderaMap: Record<string, string>
}) {
  const b1 = banderaMap[e.team1] ?? '🏳️'
  const b2 = banderaMap[e.team2] ?? '🏳️'
  const hasMundialHistory = e.h2h_en_mundiales_count > 0

  return (
    <article className="bg-white border border-gray-200 overflow-hidden">
      {/* Marcador header */}
      <div className="border-b border-gray-100 p-4">
        <div className="grid grid-cols-7 items-center gap-1">
          {/* Team 1 */}
          <div className="col-span-3 flex flex-col items-center text-center gap-1">
            <span className="text-3xl">{b1}</span>
            <p className="font-serif font-bold text-sm text-gray-900 leading-tight">{e.team1}</p>
            {e.total_historico_h2h && (
              <p className="font-mono text-2xl font-bold text-gray-800">
                {e.total_historico_h2h.victorias_team1}
              </p>
            )}
          </div>

          {/* Centro */}
          <div className="col-span-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-bold">vs</span>
            {e.total_historico_h2h && (
              <div className="text-center mt-1">
                <p className="font-mono text-base font-bold text-gray-500">
                  {e.total_historico_h2h.empates}
                </p>
                <p className="text-[8px] text-gray-400 uppercase tracking-wider">empt</p>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="col-span-3 flex flex-col items-center text-center gap-1">
            <span className="text-3xl">{b2}</span>
            <p className="font-serif font-bold text-sm text-gray-900 leading-tight">{e.team2}</p>
            {e.total_historico_h2h && (
              <p className="font-mono text-2xl font-bold text-gray-800">
                {e.total_historico_h2h.victorias_team2}
              </p>
            )}
          </div>
        </div>

        {/* Partidos en mundiales */}
        <div className="mt-3 text-center">
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${hasMundialHistory ? 'text-[#C41C1C]' : 'text-gray-400'}`}>
            {hasMundialHistory
              ? `${e.h2h_en_mundiales_count} ${e.h2h_en_mundiales_count === 1 ? 'partido' : 'partidos'} en Mundiales`
              : 'Nunca se enfrentaron en un Mundial'
            }
          </span>
        </div>
      </div>

      {/* Historial de Mundiales */}
      {hasMundialHistory ? (
        <div className="divide-y divide-gray-50">
          {e.h2h_en_mundiales_detalle.map((m, i) => (
            <PartidoRow key={i} m={m} />
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-400 italic">Cruce inédito en la historia de los Mundiales.</p>
        </div>
      )}

      {/* Footer — último cruce + dato curioso */}
      {(e.ultimo_enfrentamiento || e.dato_curioso) && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {e.ultimo_enfrentamiento && (
            <div>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-1">Último cruce</p>
              <p className="text-xs text-gray-600">
                {e.ultimo_enfrentamiento.fecha}
                {e.ultimo_enfrentamiento.competicion && ` · ${e.ultimo_enfrentamiento.competicion}`}
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {e.ultimo_enfrentamiento.resultado}
              </p>
            </div>
          )}
          {e.dato_curioso && (
            <div className="flex gap-2 items-start">
              <span className="text-[#C41C1C] font-bold text-sm shrink-0">→</span>
              <p className="text-sm text-gray-700 italic leading-snug">{e.dato_curioso}</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function PartidoRow({ m }: { m: PartidoMundialista }) {
  return (
    <div className="px-4 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors">
      <div className="shrink-0 text-center">
        <p className="font-mono text-sm font-bold text-[#C41C1C]">{m.año}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-sm text-gray-900">{m.resultado}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {m.mundial_sede && `${m.mundial_sede} · `}{m.fase}
          {m.sede_estadio && ` · ${m.sede_estadio}`}
        </p>
        {m.goleadores && m.goleadores.length > 0 && (
          <p className="text-[11px] text-gray-500 mt-1">{m.goleadores.join(', ')}</p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// CURIOSIDADES — lista editorial numerada
// ─────────────────────────────────────────────────────────────────────────
export function CuriosidadesSection({ datos }: { datos: string[] }) {
  if (!datos || datos.length === 0) return null
  return (
    <section className="bg-white border-b border-gray-200 py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] text-[#C41C1C] font-bold tracking-[0.25em] uppercase mb-2">
          Datos curiosos
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-10">
          Lo que tu audiencia no sabe
        </h2>

        <ul className="space-y-0">
          {datos.map((d, i) => (
            <li
              key={i}
              className="flex gap-6 items-start py-6 border-t border-gray-100 first:border-t-0"
            >
              <span className="font-serif text-3xl md:text-4xl font-bold text-gray-200 leading-none shrink-0 select-none w-10 text-right">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed flex-1">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// CTA — rojo sólido, texto blanco
// ─────────────────────────────────────────────────────────────────────────
export function CTAV2({ grupoId }: { grupoId: string }) {
  return (
    <section className="bg-[#C41C1C] py-14 md:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-white/70 text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
          Programa La Sombra · Nebbuler
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4 text-white">
          Cubrís el Grupo {grupoId}.<br />
          <span className="italic">Cobrás en tu moneda.</span>
        </h2>
        <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
          0% comisión variable hasta el 31 de julio para periodistas, podcasters y analistas
          LATAM. Setup en 24 horas. WhatsApp directo con el fundador.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/56992551416?text=${encodeURIComponent(
              `Hola, cubro el Grupo ${grupoId} del Mundial 2026. Quiero aplicar al Programa La Sombra.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#C41C1C] px-7 py-3.5 font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            Aplicar por WhatsApp →
          </a>
          <Link
            href="/mundial"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white px-7 py-3.5 font-medium text-sm hover:bg-white/10 transition-colors"
          >
            Ver Programa La Sombra
          </Link>
        </div>
      </div>
    </section>
  )
}
