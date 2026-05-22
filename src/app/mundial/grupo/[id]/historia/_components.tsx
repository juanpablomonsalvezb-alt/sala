import Link from 'next/link'
import type {
  GrupoHistoria,
  SeleccionHistoria,
  EnfrentamientoCruzado,
  PartidoMundialista,
} from '@/lib/mundial/grupo-historia-types'

export function SeleccionCard({ s }: { s: SeleccionHistoria }) {
  const r = s.record_fase_grupos_ultimos_5_mundiales
  return (
    <div className="border border-white/10 p-6 hover:border-white/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-3xl mb-2">{s.bandera}</p>
          <p className="font-serif text-xl tracking-tight">{s.pais}</p>
          <p className="text-white/50 text-sm italic">{s.apodo}</p>
        </div>
        {s.fifa_ranking_actual_2026 && (
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">FIFA</p>
            <p className="font-mono text-lg">#{s.fifa_ranking_actual_2026}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Mundiales" value={String(s.mundiales_jugados_total)} />
        <Stat label="Títulos" value={String(s.titulos_mundiales)} accent={s.titulos_mundiales > 0} />
      </div>

      <p className="text-sm text-white/70 mb-3">
        <strong className="text-white">Mejor:</strong> {s.mejor_resultado_historico}
      </p>

      {r && (
        <div className="border-t border-white/10 pt-3 mb-3">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
            Últimos 5 Mundiales · fase grupos
          </p>
          <div className="flex gap-3 text-sm">
            <span className="text-white/80"><strong>{r.ganados}</strong>G</span>
            <span className="text-white/60"><strong>{r.empatados}</strong>E</span>
            <span className="text-white/60"><strong>{r.perdidos}</strong>P</span>
            <span className="text-[#C41C1C] ml-auto">{r.porcentaje_avance_a_8vos}% 8vos</span>
          </div>
        </div>
      )}

      {s.goleadores_historicos_mundiales && s.goleadores_historicos_mundiales.length > 0 && (
        <div className="border-t border-white/10 pt-3 mb-3">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
            Top goleadores en Mundiales
          </p>
          <ul className="text-sm space-y-1">
            {s.goleadores_historicos_mundiales.map((g) => (
              <li key={g.nombre} className="flex justify-between text-white/70">
                <span>{g.nombre}</span>
                <span className="font-mono text-white/90">{g.goles}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(s.dt_actual_2026 || s.capitan_2026) && (
        <div className="border-t border-white/10 pt-3 mb-3 text-xs text-white/60 space-y-1">
          {s.dt_actual_2026 && (
            <p><span className="text-white/40 uppercase tracking-wider">DT:</span> {s.dt_actual_2026}</p>
          )}
          {s.capitan_2026 && (
            <p><span className="text-white/40 uppercase tracking-wider">Capitán:</span> {s.capitan_2026}</p>
          )}
        </div>
      )}

      {s.caso_especial && (
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-white/70 italic leading-relaxed">{s.caso_especial}</p>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-white/10 p-3">
      <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1">{label}</p>
      <p className={`font-serif text-xl ${accent ? 'text-[#C41C1C]' : ''}`}>{value}</p>
    </div>
  )
}

export function EnfrentamientoCard({ e, banderaMap }: {
  e: EnfrentamientoCruzado
  banderaMap: Record<string, string>
}) {
  const b1 = banderaMap[e.team1] ?? ''
  const b2 = banderaMap[e.team2] ?? ''

  return (
    <div className="border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-serif text-lg">
          {b1} {e.team1} <span className="text-white/40">vs</span> {b2} {e.team2}
        </p>
        <div className="text-right">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">En Mundiales</p>
          <p className="font-mono text-xl">{e.h2h_en_mundiales_count}</p>
        </div>
      </div>

      {e.total_historico_h2h && (
        <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4 border-y border-white/10 py-3">
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">{e.team1}</p>
            <p className="font-mono text-base">{e.total_historico_h2h.victorias_team1}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">Empates</p>
            <p className="font-mono text-base">{e.total_historico_h2h.empates}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">{e.team2}</p>
            <p className="font-mono text-base">{e.total_historico_h2h.victorias_team2}</p>
          </div>
        </div>
      )}

      {e.h2h_en_mundiales_detalle.length > 0 ? (
        <div className="space-y-3 mb-4">
          {e.h2h_en_mundiales_detalle.map((m, i) => (
            <PartidoCard key={i} m={m} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/50 italic mb-4">
          Nunca se enfrentaron en un Mundial.
        </p>
      )}

      {e.ultimo_enfrentamiento && (
        <p className="text-xs text-white/60 border-t border-white/10 pt-3 mb-2">
          <strong className="text-white">Último cruce:</strong>{' '}
          {e.ultimo_enfrentamiento.fecha} · {e.ultimo_enfrentamiento.competicion} ·{' '}
          {e.ultimo_enfrentamiento.resultado}
        </p>
      )}

      {e.dato_curioso && (
        <p className="text-sm text-[#C41C1C] italic mt-2 leading-relaxed">
          → {e.dato_curioso}
        </p>
      )}
    </div>
  )
}

function PartidoCard({ m }: { m: PartidoMundialista }) {
  return (
    <div className="bg-white/[0.02] border border-white/10 p-4">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-serif text-base">{m.resultado}</p>
        <p className="text-xs text-white/40">{m.año}</p>
      </div>
      <p className="text-xs text-white/50 mb-2">
        Mundial {m.mundial_sede} · {m.fase}
        {m.sede_estadio && ` · ${m.sede_estadio}`}
      </p>
      {m.goleadores && m.goleadores.length > 0 && (
        <ul className="text-xs text-white/60 space-y-0.5">
          {m.goleadores.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function NarrativaSection({ grupo }: { grupo: GrupoHistoria }) {
  const { narrativa } = grupo
  return (
    <section className="bg-gradient-to-br from-[#C41C1C]/15 via-transparent to-transparent border border-white/10 p-8 md:p-10">
      <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
        El grupo en una historia
      </p>
      <p className="text-lg text-white/85 leading-relaxed mb-8 italic">
        {narrativa.storyline_narrativo}
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <NarrativaPill label="Favorito según data" value={narrativa.favorito_data_historica} accent />
        {narrativa.segundo_favorito && (
          <NarrativaPill label="Segundo favorito" value={narrativa.segundo_favorito} />
        )}
        {narrativa.underdog && (
          <NarrativaPill label="Underdog" value={narrativa.underdog} />
        )}
      </div>

      <div className="border-t border-white/10 pt-6 mb-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
          Partido clave para cubrir
        </p>
        <p className="text-xl font-serif">{narrativa.partido_clave_a_cubrir}</p>
      </div>

      {narrativa.datos_curiosos_grupo.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
            Datos curiosos
          </p>
          <ul className="space-y-2">
            {narrativa.datos_curiosos_grupo.map((d, i) => (
              <li key={i} className="flex gap-3 text-white/75">
                <span className="text-[#C41C1C] font-bold">→</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function NarrativaPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-white/10 p-4">
      <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 mb-2">{label}</p>
      <p className={`font-serif text-base ${accent ? 'text-[#C41C1C]' : 'text-white'}`}>{value}</p>
    </div>
  )
}

export function CTACoverGroup({ grupoId }: { grupoId: string }) {
  return (
    <section className="border-t border-white/10 pt-12 mt-12">
      <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
        ¿Cubrís este grupo en tu newsletter o podcast?
      </p>
      <h3 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">
        Convertí este análisis en una sala paga.
      </h3>
      <p className="text-white/70 leading-relaxed mb-6 max-w-3xl">
        Programa La Sombra: 0% comisión variable hasta el 31 de julio para periodistas y
        analistas LATAM que cubran el Mundial 2026. Setup en 24 horas. WhatsApp directo
        con el fundador.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://wa.me/56992551416?text=${encodeURIComponent(
            `Hola, cubro el Grupo ${grupoId} del Mundial 2026. Quiero aplicar al Programa La Sombra.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1ebd5b] transition-colors"
        >
          Aplicar por WhatsApp →
        </a>
        <Link
          href="/mundial"
          className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 font-medium hover:bg-white/5 transition-colors"
        >
          Ver Programa La Sombra
        </Link>
      </div>
    </section>
  )
}
