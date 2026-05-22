/**
 * Contenido editorial real para páginas de partido del Mundial 2026.
 * Enfocado en partidos con equipos LATAM y partido inaugural.
 * Cada entrada tiene: análisis previo, contexto, dato histórico, ángulo para creadores.
 */

export type PartidoEditorial = {
  slug: string
  analisis: string
  contexto: string
  dato_historico: string
  angulo_creador: string
}

export type GrupoEditorial = {
  grupo: string
  descripcion: string
  latam_contexto: string
}

export const GRUPOS_EDITORIAL: Record<string, GrupoEditorial> = {
  A: {
    grupo: 'A',
    descripcion: 'El Grupo A arranca la Copa del Mundo con el partido inaugural en el Estadio Azteca. México debuta como anfitrión ante Sudáfrica en un duelo cargado de presión histórica. Corea del Sur y República Checa completan un grupo parejo donde cualquier resultado es posible.',
    latam_contexto: 'México lleva cuatro décadas siendo anfitrión o potencia regional. La presión de jugar en casa, ante millones de hinchas mexicanos, convierte cada partido del Tri en un evento televisivo descomunal para toda América Latina.',
  },
  C: {
    grupo: 'C',
    descripcion: 'El Grupo C es el de mayor atractivo mediático del torneo. Brasil llega como uno de los favoritos globales, con una generación que mezcla veteranos del ciclo anterior con jóvenes de clase mundial. Marruecos, semifinalista en 2022, buscará repetir la sorpresa. Haití y Escocia completan el grupo.',
    latam_contexto: 'Brasil es el equipo más seguido de América Latina. Cada partido de la Canarinha genera audiencias récord desde México hasta la Patagonia. Un periodista o analista que cubra al equipo brasileño tiene garantizado un público ávido en todos los países hispanohablantes.',
  },
  D: {
    grupo: 'D',
    descripcion: 'Estados Unidos en casa es una propuesta diferente al país que conocemos en el fútbol. Con una generación de jugadores que compiten en las mejores ligas de Europa, el equipo americano aspira por primera vez de forma seria a una semifinal mundialista. Paraguay y Australia protagonizan el duelo por el segundo puesto. Turquía completa el grupo.',
    latam_contexto: 'Paraguay llega al Mundial con una base sólida construida en la liga local y el fútbol europeo. Para los aficionados paraguayos, este es el torneo de la confirmación: si el equipo supera la fase de grupos, habrá una explosión de interés mediático sin precedentes en el país.',
  },
  E: {
    grupo: 'E',
    descripcion: 'Alemania llega al Grupo E como favorita absoluta, con el peso de la renovación generacional completada. Ecuador, el único representante sudamericano de este grupo, busca repetir la hazaña de Corea 2002, cuando debutó en mundiales con victorias. Curazao e Ivory Coast completan un grupo donde la segunda plaza es todo menos obvia.',
    latam_contexto: 'Ecuador tiene la historia del debutante exitoso. En su primera Copa del Mundo (Corea 2002) pasó la fase de grupos. En Alemania 2006 llegó a octavos. Una nueva generación ecuatoriana, liderada por jugadores que militan en Europa, tiene argumentos para soñar con los cuartos de final.',
  },
  H: {
    grupo: 'H',
    descripcion: 'El Grupo H reúne a España, potencia europea de primer nivel, con Uruguay, que nunca llega al Mundial sin ser candidato a sorprender. Arabia Saudita, que eliminó a Argentina en 2022, y Cabo Verde completan un grupo que promete partidos de altísima intensidad.',
    latam_contexto: 'Uruguay tiene la mayor densidad histórica de logros mundialistas por habitante del planeta. Con dos títulos mundiales y múltiples semifinales, la Celeste convierte cada Copa del Mundo en un acontecimiento de proporciones enormes en el Río de la Plata.',
  },
  I: {
    grupo: 'I',
    descripcion: 'Francia e Iraq no deberían generar muchas dudas sobre quién lidera el Grupo I. Pero el fútbol del Mundial 2026 ha mostrado que las certezas no existen. Perú, volviendo a un Mundial tras varios ciclos de ausencia, y Noruega completan un grupo donde la segunda plaza puede definirse en la última jornada.',
    latam_contexto: 'Perú regresa al Mundial con una generación que mezcla experiencia acumulada y hambre de reivindicación. Los aficionados peruanos, que vivieron de cerca la eliminación en 2018 y los ciclos posteriores, esperan este torneo como una fiesta de reencuentro con el fútbol del más alto nivel.',
  },
  J: {
    grupo: 'J',
    descripcion: 'El Grupo J tiene a Argentina como carta indiscutida. El campeón vigente llega a defender el título y, aunque el equipo ha sufrido cambios generacionales importantes, mantiene una columna vertebral de jugadores de clase mundial. Argelia, Austria y Jordania son los rivales.',
    latam_contexto: 'Argentina es el campeón mundial vigente. Defender una copa es el reto más difícil del fútbol internacional — solo Brasil en 1962 (con Pelé lesionado) y Italia en 1938 lo lograron. Cada partido de la Albiceleste convoca audiencias récord en Argentina y genera debates apasionados en todo LATAM.',
  },
  K: {
    grupo: 'K',
    descripcion: 'El Grupo K concentra dos potencias sudamericanas: Portugal y Colombia. El duelo entre ellos en la segunda jornada puede ser el partido decisivo de la fase de grupos. Uzbekistán y la República Democrática del Congo completan el grupo.',
    latam_contexto: 'Colombia llega con una generación que combina juventud explosiva y veteranos experimentados. El talento colombiano en este ciclo es de los más interesantes de Sudamérica. Un buen desempeño de la Tricolor en este Mundial sería combustible perfecto para periodistas deportivos en todo el país.',
  },
  L: {
    grupo: 'L',
    descripcion: 'El Grupo L tiene a Inglaterra como favorita, pero Panamá y Ghana tienen la capacidad de complicar la ecuación. Croacia, campeón europeo en 2018, busca aprovechar la experiencia acumulada de su generación dorada.',
    latam_contexto: 'Panamá regresa a un Mundial con el aprendizaje de Rusia 2018. El primer gol mundialista panameño, anotado por Baloy en aquella Copa, es parte del folclor futbolístico de Centroamérica. Una actuación sólida en 2026 convertiría al equipo canalero en protagonista mediático de toda la región.',
  },
}

export const PARTIDOS_EDITORIAL: Record<string, PartidoEditorial> = {
  // ── GRUPO A — MÉXICO ──────────────────────────────────────────────────────
  'mexico-vs-sudafrica-grupo-a-mundial-2026': {
    slug: 'mexico-vs-sudafrica-grupo-a-mundial-2026',
    analisis: 'México inaugura el Mundial 2026 en el Estadio Azteca ante Sudáfrica en lo que es, históricamente, el partido más visto de la primera jornada. Para el Tri, ganar el partido inaugural en casa es más que tres puntos: es el impulso anímico que un equipo local necesita para creer que puede llegar lejos. Sudáfrica, potencia regional africana, no vendrá a ceder terreno y apuesta por su potencia física y velocidad en las transiciones.',
    contexto: 'México juega en el Azteca, el estadio más icónico del fútbol latinoamericano. El mismo escenario que vio a Maradona en el 86. La presión de jugar en casa ante 80.000 personas es un arma de doble filo: energía ilimitada o parálisis ante la responsabilidad.',
    dato_historico: 'México lleva seis mundiales consecutivos llegando a octavos de final. El "quinto partido" es la obsesión del fútbol mexicano: superar los octavos y llegar a cuartos. Este partido inaugural define el tono de toda esa travesía.',
    angulo_creador: 'El partido inaugural del Mundial es el evento deportivo más visto del año en México. Cualquier periodista, analista o podcaster mexicano que cubra el debut del Tri tiene frente a sí una audiencia masiva lista para pagar por análisis premium. El Programa La Sombra de Nebbuler permite cobrar en pesos mexicanos desde el primer minuto del torneo.',
  },

  'mexico-vs-corea-del-sur-grupo-a-mundial-2026': {
    slug: 'mexico-vs-corea-del-sur-grupo-a-mundial-2026',
    analisis: 'México y Corea del Sur tienen historia mundialista reciente: ambos equipos se cruzaron en Rusia 2018, cuando una victoria coreana eliminó a Alemania y de paso clasificó a México. En 2026, la revancha tiene sabor de definición grupal. Un México que no haya ganado el primer partido llegará a este duelo bajo presión máxima.',
    contexto: 'Corea del Sur lleva al Mundial una generación con varios jugadores en las mejores ligas europeas. No es el equipo de resistencia táctica de otros ciclos — tiene velocidad, técnica y hambre de otro momento histórico como el 2002 en casa.',
    dato_historico: 'En Rusia 2018, Corea del Sur derrotó a Alemania 2-0 en el último partido del Grupo F. Ese resultado, combinado con la victoria de Suecia sobre México, clasificó a los mexicanos segundos del grupo. Una danza de resultados improbable que México no quiere repetir.',
    angulo_creador: 'El duelo México-Corea en grupos despierta memoria histórica entre aficionados que recuerdan 2018. Para un analista o periodista deportivo mexicano, este partido es material narrativo de primer orden: dos mundiales entrelazados, una revancha pendiente.',
  },

  // ── GRUPO C — BRASIL ──────────────────────────────────────────────────────
  'brasil-vs-marruecos-grupo-c-mundial-2026': {
    slug: 'brasil-vs-marruecos-grupo-c-mundial-2026',
    analisis: 'Brasil vs Marruecos es el duelo más atractivo del Grupo C y uno de los más esperados de la fase de grupos. Marruecos llegó a semis en Qatar 2022 y aspira a repetir esa hazaña. Brasil, que no levanta la Copa desde 2002, llega con una presión acumulada de 24 años sin título. El choque de estilos es total: el fútbol técnico y alegre de la Canarinha contra el bloque defensivo organizado y el contraataque marroquí.',
    contexto: 'Marruecos demostró en 2022 que un equipo africano puede superar a potencias europeas con organización táctica, mentalidad colectiva y la energía de una hinchada transnacional. Contra Brasil, el desafío es mayor, pero el libreto es conocido.',
    dato_historico: 'Brasil no ha ganado el Mundial desde Corea-Japón 2002. Desde entonces, ha tenido cuatro generaciones talentosas (2006, 2010, 2014, 2018/2022) que no convirtieron el talento en título. El peso de 24 años sin Copa pesa en cada decisión técnica.',
    angulo_creador: 'Brasil-Marruecos en fase de grupos es un partido que los aficionados brasileños de todo LATAM — y son millones — van a consumir con intensidad máxima. El periodista deportivo que tenga un análisis de calidad de este partido va a atraer suscriptores no solo desde Brasil sino desde Argentina, Colombia, México y todo el continente.',
  },

  'brasil-vs-haiti-grupo-c-mundial-2026': {
    slug: 'brasil-vs-haiti-grupo-c-mundial-2026',
    analisis: 'Brasil vs Haití tiene una carga simbólica más allá del resultado deportivo. Haití, que clasificó al Mundial por primera vez en décadas, es la historia de resiliencia de un pueblo que usa el fútbol como identidad nacional. Brasil, el gigante vecino del Caribe, tiene la obligación de ganar pero el partido tiene dimensiones humanistas que trascienden los tres puntos.',
    contexto: 'Haití clasificó al Mundial después de un ciclo lleno de dificultades extradeportivas. Su presencia en el torneo es un logro que va más allá del fútbol. Para los haitianos de la diáspora en toda América, este Mundial es un motivo de orgullo colectivo.',
    dato_historico: 'La única vez que Haití disputó una Copa del Mundo fue en 1974, en Alemania. Jugó el famoso gol de Emmanuel Sanon contra Italia. 52 años después, regresa con una generación nueva y el peso de toda una nación.',
    angulo_creador: 'El regreso de Haití al fútbol mundial es una historia que los medios de comunicación de toda Latinoamérica y el Caribe hispano quieren contar. No es solo fútbol — es identidad, resiliencia y diáspora. Un periodista que cubra este partido con profundidad tiene material para contenido premium que va más allá del resultado.',
  },

  // ── GRUPO D — PARAGUAY ────────────────────────────────────────────────────
  'estados-unidos-vs-paraguay-grupo-d-mundial-2026': {
    slug: 'estados-unidos-vs-paraguay-grupo-d-mundial-2026',
    analisis: 'El duelo anfitrión vs LATAM en el Grupo D tiene connotaciones que van más allá del fútbol: es la confrontación entre la potencia norteamericana que construye su identidad futbolística y el Paraguay que siempre llega al Mundial dispuesto a sorprender. Estados Unidos, en casa, tiene el apoyo local. Paraguay tiene la experiencia de quien ya no teme a nada en este escenario.',
    contexto: 'Paraguay fue cuarto en el Mundial de Sudáfrica 2010 — la mejor actuación de un equipo guaraní en la historia del torneo. Esa generación marcó un precedente. La actual, más joven, aspira a repetir algo similar.',
    dato_historico: 'En el Mundial 2010, Paraguay eliminó a Japón y España en octavos y cuartos respectivamente. Solo una semifinal ante España los detuvo. La Albirroja tiene ADN de sorpresear en mundiales.',
    angulo_creador: 'Para el periodismo deportivo paraguayo, cada partido del Mundial es una oportunidad única. Paraguay es un país con pasión futbolística intensa pero con una infraestructura mediática más pequeña que sus vecinos. Los analistas independientes que cubran al equipo guaraní tienen un mercado desatendido y ansioso de contenido de calidad.',
  },

  'paraguay-vs-australia-grupo-d-mundial-2026': {
    slug: 'paraguay-vs-australia-grupo-d-mundial-2026',
    analisis: 'Paraguay vs Australia es el duelo por el segundo lugar del Grupo D. Dos equipos de tradición mundialista reciente — los socceroos llegaron a cuartos en 2006, Paraguay a semis en 2010 — con estilos completamente distintos. El físico australiano contra la técnica y la astucia paraguaya. Un partido que probablemente defina quién acompaña a Estados Unidos en los octavos de final.',
    contexto: 'Australia llega al Mundial con una base importante de jugadores que militan en el fútbol europeo. El seleccionado oceánico ya no es el equipo exótico de otros tiempos: tiene calidad y mentalidad competitiva.',
    dato_historico: 'Australia y Paraguay tienen un historial mundialista curioso: ambos llegaron a los cuartos del mismo ciclo (2006 y 2010 respectivamente) pero nunca se han enfrentado en fase de grupos.',
    angulo_creador: 'Para los hinchas paraguayos, este partido define si la clasificación a octavos es posible o si el grupo se cierra anticipadamente. Un analista que cubra la Albirroja con datos precisos, historia y análisis táctico tiene un público que paga por ese nivel de profundidad.',
  },

  // ── GRUPO E — ECUADOR ─────────────────────────────────────────────────────
  'alemania-vs-ecuador-grupo-e-mundial-2026': {
    slug: 'alemania-vs-ecuador-grupo-e-mundial-2026',
    analisis: 'Ecuador contra una potencia europea es el patrón que definió el inicio de la era dorada del fútbol ecuatoriano: en 2002 debutaron mundialmente con victorias ante México y Croacia. Ahora enfrentan a Alemania, una potencia en reconstrucción tras años de resultados irregulares. No es el partido imposible que parece.',
    contexto: 'Alemania viene de un proceso de renovación profunda tras el fracaso de 2018. Con una nueva generación comprometida con el colectivo, los germanos aspiran a volver a las semifinales. Pero Ecuador tiene argumentos para robarles puntos.',
    dato_historico: 'Ecuador debutó en los mundiales en Corea 2002 y pasó la fase de grupos. En Alemania 2006 llegó a octavos. En Qatar 2022, ganó el partido inaugural contra el anfitrión. La selección ecuatoriana tiene un historial de partidos inaugurales/primeras jornadas que impresiona.',
    angulo_creador: 'Ecuador vs Alemania es el partido que Ecuador no quiere perder. Para los aficionados ecuatorianos, cada Copa del Mundo es una fiesta nacional. Los periodistas deportivos del país cubren al equipo con una devoción que no existe en otros ámbitos. Un analista de calidad tiene en cada partido de La Tri una audiencia masiva que busca profundidad, no solo titulares.',
  },

  // ── GRUPO H — URUGUAY ─────────────────────────────────────────────────────
  'espana-vs-uruguay-grupo-h-mundial-2026': {
    slug: 'espana-vs-uruguay-grupo-h-mundial-2026',
    analisis: 'España vs Uruguay es el duelo que determina quién lidera el Grupo H desde el primer partido. Dos campeones mundiales — España en 2010, Uruguay en 1930 y 1950 — con estilos complementariamente opuestos. El toque español y la garra charrúa son categorías futbolísticas que trascienden lo táctico.',
    contexto: 'Uruguay llega con el equilibrio entre la veteranía de Cavani y Muslera y la frescura de una generación intermedia. El equipo uruguayo siempre llega al Mundial como mínimo con opciones reales de octavos — la historia lo obliga.',
    dato_historico: 'Uruguay ganó la Copa América 2011 con muchos de los jugadores que luego llegaron al Mundial de Brasil 2014 y dieron pelea. La nueva generación mezcla ese ADN ganador con frescura táctica.',
    angulo_creador: 'El fútbol uruguayo tiene una densidad cultural extraordinaria para su tamaño. En Uruguay se habla de fútbol con una seriedad que pocos países igualan. Los periodistas deportivos uruguayos tienen una audiencia exigente que diferencia calidad de relleno. Un análisis real sobre La Celeste tiene mercado inmediato.',
  },

  'uruguay-vs-arabia-saudita-grupo-h-mundial-2026': {
    slug: 'uruguay-vs-arabia-saudita-grupo-h-mundial-2026',
    analisis: 'Arabia Saudita derrotó a Argentina en 2022 en uno de los resultados más impactantes de la historia mundialista reciente. Uruguay no puede darse el lujo de subestimarlos. Para la Celeste, este partido es la oportunidad de consolidar la clasificación antes de la definición contra España.',
    contexto: 'Arabia Saudita construyó el triunfo ante Argentina 2022 sobre una trampa de offside quirúrgica y una segunda mitad de contraataques demoledores. El equipo saudí tiene memoria táctica y sabe cómo sorprender a favoritos.',
    dato_historico: 'Arabia Saudita 2-1 Argentina, Qatar 2022. Uno de los cinco resultados más impactantes de los últimos 30 años mundialistas. Uruguay lo sabe. El entrenador lo tiene en el video de preparación.',
    angulo_creador: 'Cualquier partido de Uruguay en el Mundial genera debates apasionados en el Río de la Plata. El hincha uruguayo consume análisis con voracidad. Para un periodista o analista uruguayo, cubrir el Mundial con Nebbuler implica tener suscriptores que pagan mensualmente por acceso exclusivo a su perspectiva del torneo.',
  },

  // ── GRUPO J — ARGENTINA ───────────────────────────────────────────────────
  'argentina-vs-argelia-grupo-j-mundial-2026': {
    slug: 'argentina-vs-argelia-grupo-j-mundial-2026',
    analisis: 'Argentina debuta como campeón mundial ante Argelia en un partido que, sobre el papel, parece definido. Pero Qatar 2022 enseñó que ningún debut está garantizado: la propia Argentina perdió su primer partido ante Arabia Saudita. El campeón vigente necesita demostrar que la defensa del título comienza bien, y Argelia tiene jugadores de la Ligue 1 francesa con capacidad de generar problemas.',
    contexto: 'Argelia clasificó a su tercer Mundial consecutivo con una generación de jugadores que militan masivamente en Francia. No es una selección de adorno — tiene jugadores con experiencia en Champions League y Ligue 1.',
    dato_historico: 'El partido inaugural de Argentina en Qatar 2022 terminó 2-1 en contra vs Arabia Saudita. Una de las mayores sorpresas de la historia reciente del torneo. La Albiceleste luego ganó el Mundial, pero ese tropiezo inicial quedó grabado en la memoria colectiva.',
    angulo_creador: 'Argentina defiende el título. Cada partido de la Albiceleste en el Mundial genera más búsquedas en Google en todo LATAM que casi cualquier otro evento deportivo. Para un periodista o analista argentino que cubra el torneo, el primer partido del campeón es el momento de máxima audiencia.',
  },

  'argentina-vs-austria-grupo-j-mundial-2026': {
    slug: 'argentina-vs-austria-grupo-j-mundial-2026',
    analisis: 'Austria lleva años construyendo una generación de jugadores de primer nivel europeo. Para Argentina, este duelo en la segunda jornada puede ser el momento de asegurar la clasificación — o el partido en el que el campeón se complica inesperadamente. Austria tiene calidad técnica para dar guerra.',
    contexto: 'Austria tiene en su plantilla jugadores de Bundesliga y Premier League. El fútbol austríaco creció exponencialmente en infraestructura y talento en la última década. No es el rival fácil que el nombre sugiere.',
    dato_historico: 'Argentina y Austria tienen uno de los enfrentamientos históricos más recordados del fútbol: el "Miracle of Córdoba" en 1978, cuando se acusó a Austria de ceder el partido a Alemania en el Mundial local. Una historia de política y fútbol que el tiempo no borró.',
    angulo_creador: 'El segundo partido del campeón mundial es siempre el de la confirmación. El periodista o analista que cubra a Argentina en el Mundial tiene frente a sí un ciclo completo de tres partidos de grupos, posibles octavos, cuartos, semis y final. Una cobertura sostenida que convierte suscriptores eventuales en lectores fieles.',
  },

  'argentina-vs-jordania-grupo-j-mundial-2026': {
    slug: 'argentina-vs-jordania-grupo-j-mundial-2026',
    analisis: 'El tercer partido del Grupo J puede ser el momento de rotación del plantel argentino — si ya están clasificados — o la definición del grupo en caso de resultados ajustados. Jordania, en su debut mundialista, tendrá el incentivo de hacer historia contra el campeón vigente.',
    contexto: 'Jordania clasifica por primera vez a un Mundial. Para cualquier selección que debuta, el partido contra el campeón vigente tiene una dimensión histórica única: es el escenario soñado por cada jugador desde la infancia.',
    dato_historico: 'El debut mundialista de una selección siempre genera historias de impacto. Haití 1974 le metió un gol a Italia. Senegal 2002 derrotó a Francia. Corea del Norte 1966 eliminó a Italia. Los debuts en mundiales tienen sus propias leyendas.',
    angulo_creador: 'Para la audiencia argentina, el tercer partido del grupo es el de la celebración anticipada o la tensión de última hora. En cualquiera de los dos escenarios, el periodismo deportivo que cubra el torneo con profundidad gana relevancia. Nebbuler permite que esa relevancia se traduzca en ingresos directos.',
  },

  // ── GRUPO K — COLOMBIA ────────────────────────────────────────────────────
  'portugal-vs-colombia-grupo-k-mundial-2026': {
    slug: 'portugal-vs-colombia-grupo-k-mundial-2026',
    analisis: 'Portugal vs Colombia es el duelo de primera jornada que puede definir el liderato del Grupo K desde el primer día. Colombia llega con una generación que incluye jugadores en la Premier League, La Liga y la Bundesliga. Portugal, con Ronaldo en el ocaso y una transición generacional avanzada, es favorito — pero Colombia tiene argumentos.',
    contexto: 'Colombia no gana un partido mundialista desde 2014, cuando llegó a cuartos de final con James Rodríguez como figura. Doce años después, hay una nueva generación que quiere escribir su propio capítulo.',
    dato_historico: 'En Brasil 2014, Colombia fue el equipo revelación: James Rodríguez ganó el Botín de Oro del torneo, Falcao se perdió la Copa por lesión y aun así el equipo llegó a cuartos. La expectativa de 2026 es recuperar ese nivel.',
    angulo_creador: 'El fútbol colombiano tiene una audiencia masiva y apasionada. Cada partido de la Selección Colombia en el Mundial genera interacciones récord en las redes sociales del país. Para un periodista deportivo colombiano, este es el partido de máxima exposición: Portugal como rival, el grupo en juego, la memoria de 2014 en el aire.',
  },

  'colombia-vs-uzbekistan-grupo-k-mundial-2026': {
    slug: 'colombia-vs-uzbekistan-grupo-k-mundial-2026',
    analisis: 'Colombia vs Uzbekistán es el partido que la selección cafetera necesita ganar para consolidar su posición en el grupo. Uzbekistán, potencia futbolística emergente de Asia Central, tiene jugadores en el fútbol europeo y no vendrá a ser sparring. Pero Colombia, con su calidad individual, parte como clara favorita.',
    contexto: 'Uzbekistán está construyendo una identidad futbolística sólida. Su clasificación al Mundial es el resultado de un trabajo sistemático de base que lleva años. No tiene el perfil mediático de otros rivales, pero tiene competitividad real.',
    dato_historico: 'Colombia tiene el record de haber ganado sus últimos partidos de fase de grupos ante equipos de Asia en los mundiales donde ha participado.',
    angulo_creador: 'Para los hinchas colombianos, el segundo partido del grupo es el de la tranquilidad o la alarma. Un triunfo claro sobre Uzbekistán pone a Colombia con un pie en octavos y genera el tipo de euforia que convierte oyentes casuales en suscriptores activos.',
  },

  // ── GRUPO I — PERÚ ───────────────────────────────────────────────────────
  'peru-vs-noruega-grupo-i-mundial-2026': {
    slug: 'peru-vs-noruega-grupo-i-mundial-2026',
    analisis: 'Perú y Noruega se disputan la tercera y cuarta plaza del Grupo I. Para la selección peruana, este puede ser el partido definitorio de si el regreso al Mundial 2026 tiene continuidad o queda como una participación testimonial. Noruega, con Haaland como figura de nivel mundial, parte como favorita, pero el fútbol peruano tiene recursos técnicos y tácticos para competir.',
    contexto: 'Perú regresa a un Mundial después de años de eliminaciones en repechajes. La expectativa es alta, el equipo tiene calidad, pero enfrenta a Noruega — uno de los equipos más interesantes de Europa — en lo que puede ser un partido de altísimo nivel.',
    dato_historico: 'La última vez que Perú jugó en un Mundial fue Rusia 2018, donde fue eliminado en fase de grupos tras partidos competitivos contra Francia y Australia. El nivel mostrado en Rusia generó expectativa de continuidad que tarda en concretarse.',
    angulo_creador: 'El regreso de Perú al fútbol mundialista es un evento que la prensa deportiva peruana cubre con intensidad máxima. Para un periodista o analista que sigue a la selección, el Mundial es el pico de audiencia de cuatro años de trabajo. Nebbuler permite convertir esa atención en ingresos directos desde el primer partido.',
  },

  'francia-vs-peru-grupo-i-mundial-2026': {
    slug: 'francia-vs-peru-grupo-i-mundial-2026',
    analisis: 'Francia vs Perú tiene el peso específico del favorito contra el regresado. Para Perú, enfrentar a la selección francesa — bicampeona del mundo, potencia generacional absoluta — es una prueba de fuego que puede revelar el verdadero nivel del equipo. Un resultado digno valdría oro.',
    contexto: 'Francia llega al Mundial como uno de los dos o tres máximos favoritos al título. Su generación actual combina veteranos de 2018 con nuevas estrellas. Ante Perú, la expectativa de goleada es alta — pero el fútbol nunca garantiza nada.',
    dato_historico: 'Francia ha ganado todos sus partidos ante selecciones sudamericanas en la última década mundialista, con margen amplio en todos los casos. El historial pesa, pero Perú tiene argumentos propios.',
    angulo_creador: 'Para los hinchas peruanos, el partido contra Francia es el de las expectativas versus la realidad. Un periodista que cubra a Perú con honestidad técnica — reconociendo el nivel del rival pero valorando el esfuerzo — genera más confianza y fidelidad de audiencia que uno que promete victorias imposibles.',
  },

  // ── GRUPO L — PANAMÁ ──────────────────────────────────────────────────────
  'inglaterra-vs-panama-grupo-l-mundial-2026': {
    slug: 'inglaterra-vs-panama-grupo-l-mundial-2026',
    analisis: 'Panamá llega a su segundo Mundial con la memoria de 2018, donde perdió ante Inglaterra 6-1 en lo que fue una de las goleadas más recordadas de aquella Copa. Pero el fútbol panameño creció, tiene jugadores en ligas de primer nivel, y la revancha simbólica está en el horizonte.',
    contexto: 'En Rusia 2018, la primera Copa del Mundo de Panamá, el equipo canalero recibió 11 goles en tres partidos pero anotó el histórico gol de Baloy. Ocho años después, la selección tiene más herramientas para competir.',
    dato_historico: 'Felipe Baloy anotó el primer gol mundialista de Panamá en Rusia 2018, ante los mismos ingleses que les ganaron 6-1. Un momento de celebración nacional que trasciende el resultado. Ese gol vive en el folclor futbolístico centroamericano.',
    angulo_creador: 'Panamá tiene en este Mundial la oportunidad de consolidar su identidad futbolística internacional. Para el periodismo deportivo panameño y centroamericano, cada partido de Los Canaleros es un evento nacional. La cobertura de calidad tiene audiencia garantizada en un mercado que aún no está saturado de analistas.',
  },

  'panama-vs-ghana-grupo-l-mundial-2026': {
    slug: 'panama-vs-ghana-grupo-l-mundial-2026',
    analisis: 'Panamá vs Ghana es el duelo por la supervivencia en el Grupo L. Ambos equipos necesitan puntos para mantenerse en carrera y ambos tienen suficiente calidad para ganar. Ghana, potencia africana con historia mundialista sólida (cuartos en 2010), es favorito, pero Panamá tiene el factor motivacional de quien juega sin nada que perder.',
    contexto: 'Ghana en 2010 llegó a cuartos y fue eliminado por Uruguay en penales tras el infame manotazo de Suárez. La "Black Stars" busca desde entonces repetir esa profundidad en el torneo. 16 años después, la oportunidad es esta.',
    dato_historico: 'En 2010, Uruguay eliminó a Ghana con la mano de Suárez sobre la línea. Un episodio que dividió al mundo del fútbol y que ambos países recuerdan con emociones opuestas.',
    angulo_creador: 'Para la audiencia centroamericana y panameña, el partido ante Ghana es el de la esperanza real de clasificación. El periodista que cubra a Panamá con datos y análisis, no solo con euforia, construye una audiencia que lo seguirá más allá del Mundial.',
  },
}
