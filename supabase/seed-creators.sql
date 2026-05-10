-- ============================================================
-- NEBBULER — Seed de creadores y artículos
-- Ejecutar en SQL Editor de Supabase (requiere service role)
-- ============================================================

-- ─── 1. Creadores en auth.users ───────────────────────────────────────────────

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'rodrigo.fuentes@nebbuler.com', '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rodrigo Fuentes Marín"}', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000002', 'carolina.vega@nebbuler.com',   '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carolina Vega Toro"}',    'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000003', 'matias.cornejo@nebbuler.com',  '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Matías Cornejo Silva"}',  'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000004', 'andrea.poblete@nebbuler.com',  '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Andrea Poblete Ríos"}',   'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000005', 'ignacio.leal@nebbuler.com',    '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ignacio Leal Espinoza"}', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000006', 'francisca.araya@nebbuler.com', '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Francisca Araya Medina"}','authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000007', 'pablo.herrera@nebbuler.com',   '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Pablo Herrera Zúñiga"}',  'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000008', 'valentina.soto@nebbuler.com',  '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Valentina Soto Burgos"}', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000009', 'sebastian.miranda@nebbuler.com','$2a$10$placeholder',NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sebastián Miranda Lagos"}','authenticated','authenticated'),
  ('a1000000-0000-0000-0000-000000000010', 'catalina.rojas@nebbuler.com',  '$2a$10$placeholder', NOW(), '2025-08-01 09:00:00+00', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Catalina Rojas Henríquez"}','authenticated','authenticated')
ON CONFLICT (id) DO NOTHING;

-- ─── 2. sala_profiles ─────────────────────────────────────────────────────────

INSERT INTO public.sala_profiles (id, email, full_name, avatar_url, is_creator, is_superadmin, created_at)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'rodrigo.fuentes@nebbuler.com', 'Rodrigo Fuentes Marín',   NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000002', 'carolina.vega@nebbuler.com',   'Carolina Vega Toro',      NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000003', 'matias.cornejo@nebbuler.com',  'Matías Cornejo Silva',    NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000004', 'andrea.poblete@nebbuler.com',  'Andrea Poblete Ríos',     NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000005', 'ignacio.leal@nebbuler.com',    'Ignacio Leal Espinoza',   NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000006', 'francisca.araya@nebbuler.com', 'Francisca Araya Medina',  NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000007', 'pablo.herrera@nebbuler.com',   'Pablo Herrera Zúñiga',    NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000008', 'valentina.soto@nebbuler.com',  'Valentina Soto Burgos',   NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000009', 'sebastian.miranda@nebbuler.com','Sebastián Miranda Lagos', NULL, true, false, '2025-08-01 09:00:00+00'),
  ('a1000000-0000-0000-0000-000000000010', 'catalina.rojas@nebbuler.com',  'Catalina Rojas Henríquez',NULL, true, false, '2025-08-01 09:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ─── 3. sala_creators ─────────────────────────────────────────────────────────

INSERT INTO public.sala_creators (id, user_id, name, slug, specialty, bio, bio_long, linkedin_url, price_clp, plan, publish_frequency, subscriber_count, stripe_account_id, publication_name, pull_quote, cover_image_url, created_at)
VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Rodrigo Fuentes Marín',
  'rodrigo-fuentes-marin',
  'MACROECONOMÍA Y POLÍTICA MONETARIA',
  'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota. Consultor independiente en política monetaria para gobiernos de la región.',
  'Pasé diecisiete años en el Banco Central redactando informes que nadie leía completos. Este newsletter es el ejercicio contrario: macroeconomía chilena con una posición clara, sin los dos escenarios alternativos por si acaso.',
  NULL, 14990, 'creator', 'Publica cada martes', 847, NULL,
  'Política Monetaria Chile',
  'El consenso macroeconómico rara vez se equivoca dramáticamente. Simplemente no dice lo que importa.',
  NULL, '2025-08-01 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'Carolina Vega Toro',
  'carolina-vega-toro',
  'FINANZAS CORPORATIVAS Y VALORACIÓN',
  'Directora de M&A en Banchile Inversiones por 9 años. MBA por la Universidad de Chicago Booth. Asesora a family offices y fondos de capital privado en transacciones de mediano tamaño.',
  'Nueve años cerrando transacciones de M&A en Chile me enseñaron una cosa: los modelos de valoración son correctos y los supuestos son el problema. Escribo sobre finanzas corporativas desde adentro de las operaciones reales.',
  NULL, 19990, 'creator', 'Publica cada lunes', 634, NULL,
  'Finanzas Corporativas',
  'Un múltiplo EV/EBITDA sin contexto es solo un número. El contexto es todo.',
  NULL, '2025-08-01 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000003',
  'Matías Cornejo Silva',
  'matias-cornejo-silva',
  'DERECHO TRIBUTARIO Y PLANIFICACIÓN FISCAL',
  'Socio del área tributaria en Urenda, Rencoret, Orrego & Dörr. LLM en Tax Law por la Universidad de Leiden. Especialista en reorganizaciones empresariales y tributación internacional.',
  'El SII no audita al azar. Escribo sobre tributación chilena para que los empresarios y sus asesores entiendan qué es lo que realmente buscan cuando entran a revisar.',
  NULL, 17990, 'creator', 'Publica cada miércoles', 512, NULL,
  'Tributación Chile',
  'La planificación tributaria no es elusión. Pero la línea es más delgada de lo que cree la mayoría.',
  NULL, '2025-08-01 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000004',
  'Andrea Poblete Ríos',
  'andrea-poblete-rios',
  'SALUD PÚBLICA Y EPIDEMIOLOGÍA CLÍNICA',
  'Médica epidemióloga. MPH por Johns Hopkins Bloomberg. Investigadora asociada del ICIM y ex asesora técnica del Ministerio de Salud.',
  'Los datos de salud pública en Chile existen. El problema es que nadie los lee junto con el contexto que los hace útiles. Ese es el trabajo que hago aquí.',
  NULL, 12990, 'creator', 'Publica cada jueves', 389, NULL,
  'Salud Pública Chile',
  'El sistema de salud chileno no está en crisis. Está en la transición más difícil de su historia.',
  NULL, '2025-08-10 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000005',
  'Ignacio Leal Espinoza',
  'ignacio-leal-espinoza',
  'CIENCIA POLÍTICA Y SISTEMAS ELECTORALES',
  'Doctor en Ciencia Política por la Universidad de Salamanca. Profesor asociado en la Escuela de Gobierno UAI. Investigador del Observatorio del Sistema Político Chileno.',
  'El sistema político chileno es más frágil de lo que parece en las encuestas y más resistente de lo que sugieren los columnistas. Escribo sobre la diferencia.',
  NULL, 9990, 'creator', 'Publica cada viernes', 418, NULL,
  'Sistema Político Chile',
  'La fragmentación política chilena no es accidente. Es el resultado predecible de un diseño electoral que nadie quiso cambiar.',
  NULL, '2025-08-01 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000006',
  'Francisca Araya Medina',
  'francisca-araya-medina',
  'ARQUITECTURA URBANA Y PLANIFICACIÓN TERRITORIAL',
  'Arquitecta urbanista. Máster en Urban Planning por la Bartlett School of Architecture, UCL. Consultora en proyectos de densificación para el MINVU.',
  'Santiago crece de la manera equivocada desde hace treinta años. No por falta de planificadores: por falta de poder político para hacer que los planes se cumplan.',
  NULL, 11990, 'creator', 'Publica cada lunes', 297, NULL,
  'Ciudad y Territorio',
  'La ciudad no la construyen los arquitectos. La construyen los incentivos tributarios que ningún arquitecto diseñó.',
  NULL, '2025-08-15 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000007',
  'a1000000-0000-0000-0000-000000000007',
  'Pablo Herrera Zúñiga',
  'pablo-herrera-zuniga',
  'DERECHO LABORAL Y RELACIONES COLECTIVAS',
  'Abogado laboralista con 14 años en litigios colectivos. Magíster por la PUC. Ex asesor jurídico de la CUT en tres procesos de huelga estratégica.',
  'He estado en los dos lados de la mesa en negociaciones colectivas. Eso me da una perspectiva que los abogados de empresa y los asesores sindicales rara vez tienen. Escribo desde ahí.',
  NULL, 13990, 'creator', 'Publica cada martes y jueves', 234, NULL,
  'Derecho Laboral Chile',
  'El Código del Trabajo chileno fue diseñado para contener conflictos, no para resolverlos. Esa diferencia lo explica todo.',
  NULL, '2025-09-01 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000008',
  'a1000000-0000-0000-0000-000000000008',
  'Valentina Soto Burgos',
  'valentina-soto-burgos',
  'NUTRICIÓN CLÍNICA Y METABOLISMO',
  'Doctora en Ciencias de la Alimentación por la Universidad de Navarra. Investigadora del Centro de Nutrición Molecular de la Universidad de Chile. 12 publicaciones indexadas en metabolismo.',
  'La nutrición tiene un problema de comunicación: demasiado ruido, poca evidencia. Escribo para profesionales de la salud y pacientes informados que quieren saber qué dice realmente la literatura.',
  NULL, 7990, 'creator', 'Publica cada miércoles', 312, NULL,
  'Nutrición Basada en Evidencia',
  'La mayoría de los consejos nutricionales que circulan en redes no tienen respaldo en la literatura indexada. Ese es el problema que intento resolver.',
  NULL, '2025-09-15 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000009',
  'a1000000-0000-0000-0000-000000000009',
  'Sebastián Miranda Lagos',
  'sebastian-miranda-lagos',
  'INGENIERÍA CIVIL E INFRAESTRUCTURA',
  'Ingeniero civil estructural. Diplomado en Project Finance por el MIT. Gerente técnico en Besalco por 7 años, hoy consultor independiente en concesiones viales.',
  'Los proyectos de infraestructura en Chile siempre sobrecuestan y se atrasan. No porque los ingenieros sean malos: porque los contratos están mal estructurados desde el principio.',
  NULL, 10990, 'creator', 'Publica cada viernes', 178, NULL,
  'Infraestructura y Concesiones',
  'Un proyecto de infraestructura que llega a término en plazo y presupuesto no es éxito normal. Es la excepción que confirma la regla.',
  NULL, '2025-10-01 09:00:00+00'
),
(
  'b1000000-0000-0000-0000-000000000010',
  'a1000000-0000-0000-0000-000000000010',
  'Catalina Rojas Henríquez',
  'catalina-rojas-henriquez',
  'HISTORIA ECONÓMICA DE CHILE Y LATAM',
  'Doctora por El Colegio de México, postdoctorante en Cambridge. Profesora del Instituto de Historia de la PUC. Especialista en ciclos de deuda y crisis financieras latinoamericanas.',
  'La historia económica de Chile que se enseña en las universidades es la historia de los ganadores. Escribo sobre los ciclos, las crisis y los patrones que se repiten porque nadie los estudió la primera vez.',
  NULL, 8990, 'creator', 'Publica cada lunes', 134, NULL,
  'Historia Económica LATAM',
  'LATAM repite sus crisis porque no las estudia. Cada generación las descubre como si fueran nuevas.',
  NULL, '2025-10-01 09:00:00+00'
)
ON CONFLICT (slug) DO NOTHING;

-- ─── 4. sala_posts ────────────────────────────────────────────────────────────

INSERT INTO public.sala_posts (creator_id, title, slug, excerpt, content, is_free, published_at, read_time_minutes, created_at)
VALUES

-- ═══ RODRIGO FUENTES MARÍN ═══════════════════════════════════════════════════

('b1000000-0000-0000-0000-000000000001',
'Por qué escribo sobre política monetaria',
'por-que-escribo-sobre-politica-monetaria',
'Diecisiete años en el Banco Central enseñan a hablar con cautela. Este newsletter es el ejercicio contrario.',
'<p>Pasé diecisiete años en el Banco Central. Redacté informes que nadie leyó completos. Presenté proyecciones que se equivocaron con elegancia. Aprendí a hablar en el idioma de la institución: cuidadoso, equilibrado, siempre con dos escenarios alternativos.</p><p>Esto no es eso.</p><p>Cuando salí al mundo privado como consultor, me encontré con un problema que no esperaba. Los ejecutivos y directores de empresa que me contrataban para explicarles qué haría el Banco Central en los próximos seis meses no necesitaban mis dos escenarios. Necesitaban mi opinión. Y yo había pasado casi dos décadas entrenándome para no tenerla, al menos no en voz alta.</p><p>Este newsletter es el ejercicio contrario. Voy a escribir sobre macroeconomía chilena y política monetaria con una posición clara. Voy a señalar cuándo creo que el consenso está equivocado, cuándo las cifras que cita la prensa son las menos relevantes, y cuándo una decisión de política tiene consecuencias que no se mencionan en el comunicado oficial.</p><h2>El problema con la cobertura económica en Chile</h2><p>Los medios tienen incentivos para la simplicidad. "El Banco Central baja la tasa: el crédito se abarata" es un titular funcional. El problema es que ese titular omite el mecanismo de transmisión, que puede tomar entre doce y veinticuatro meses en operar, y que depende de condiciones que rara vez se mencionan: el spread bancario, las expectativas de inflación, el estado del mercado hipotecario, la posición del ciclo económico.</p><p>No estoy criticando a los periodistas económicos. Están haciendo bien su trabajo dado el formato. Estoy diciendo que ese formato deja sin explicar las cosas que más importan a quien toma decisiones.</p><blockquote>El consenso macroeconómico rara vez se equivoca dramáticamente. Simplemente no dice lo que importa.</blockquote><p>Lo que voy a intentar hacer aquí es explicar el mecanismo. Por qué una tasa que baja cincuenta puntos base importa menos de lo que dice el titular pero más de lo que sugiere el mercado. Por qué el tipo de cambio no sigue al cobre de la manera que la mayoría de los analistas asume. Por qué la inflación subyacente y el IPC titular cuentan historias distintas sobre la misma economía.</p><p>Si eso te parece útil, bienvenido.</p>',
true, '2025-08-12 10:00:00+00', 5, '2025-08-12 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'La tasa terminal que el mercado no está leyendo bien',
'tasa-terminal-mercado-no-lee-bien',
'El consenso sobre dónde termina el ciclo de baja tiene un error de diagnóstico en la raíz.',
'<p>Hay un número que aparece en casi todos los informes de renta fija que circulan en Santiago: la tasa terminal del ciclo actual. El consenso de mercado la ubica consistentemente entre 4,5% y 5,0%. Creo que ese rango está mal, y voy a explicar por qué.</p><h2>El error de diagnóstico</h2><p>El problema no es el modelo. El problema es el supuesto de inflación subyacente que alimenta ese modelo. La mayoría de los analistas está usando expectativas de inflación a dos años que implican una convergencia al 3% mucho más rápida de lo que los datos de servicios justifican.</p><p>La inflación de bienes en Chile ya convergió. Eso es cierto. El IPC de bienes transables lleva tres trimestres dentro del rango meta. Pero la inflación de servicios —que el Banco Central monitorea con mayor atención de lo que comunica públicamente— sigue mostrando rigidez. Y la rigidez de servicios tiene una mecánica distinta: no responde a la tasa de política de la misma manera que los bienes.</p><h2>Lo que los datos de mercado laboral están diciendo</h2><p>El mercado laboral formal en Chile tiene una tasa de desempleo que parece benigna en el titular pero esconde una composición preocupante. El empleo asalariado formal crece lento. El empleo por cuenta propia —históricamente el refugio en ciclos recesivos— está creciendo de forma anómala para un momento de expansión moderada.</p><p>Eso sugiere que la brecha de producto está siendo subestimada por los modelos estándar del Banco Central. Y si la brecha de producto es mayor, el espacio para bajar la tasa sin riesgo inflacionario es menor de lo que el consenso asume.</p><blockquote>Una tasa terminal de 4,5% asume condiciones que los datos de servicios y mercado laboral no respaldan todavía.</blockquote><p>Mi estimación: la tasa terminal de este ciclo está entre 5,0% y 5,25%. No porque el Banco Central sea conservador por naturaleza —lo es, pero eso no determina el resultado— sino porque las condiciones estructurales que permitirían ir más abajo no están dadas en el horizonte relevante.</p>',
false, '2025-09-03 10:00:00+00', 7, '2025-09-03 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'El peso chileno y el cobre: una correlación que exagera',
'peso-chileno-cobre-correlacion-exagera',
'El tipo de cambio en Chile no sigue al precio del cobre de la manera que casi todo el mundo asume.',
'<p>La narrativa estándar sobre el peso chileno es simple: el cobre sube, el peso se fortalece; el cobre baja, el peso se deprecia. Es una correlación real. El problema es que se usa como si fuera una relación mecánica, y no lo es.</p><h2>Lo que la correlación esconde</h2><p>Entre 2022 y 2024, el precio del cobre tuvo tres episodios de alza sostenida. En dos de ellos, el peso se fortaleció como la narrativa predice. En el tercero, el peso se depreció mientras el cobre subía. Los modelos que ignoran ese episodio tienen un problema de selección de datos.</p><p>Lo que ocurrió en ese tercer episodio es instructivo: el diferencial de tasas entre Chile y Estados Unidos se amplió en favor del dólar exactamente cuando el cobre subía. El carry trade venció a la correlación del commodity. Ese mecanismo existe siempre, pero solo se hace visible cuando actúa en dirección contraria a la narrativa dominante.</p><h2>Las tres variables que el modelo simple ignora</h2><p>El tipo de cambio en Chile es determinado simultáneamente por el precio del cobre, el diferencial de tasas reales con EE.UU., y las expectativas de riesgo político interno. Un modelo que use solo el cobre como variable explicativa tiene un R² razonable en períodos normales y falla sistemáticamente en los momentos que más importan.</p><blockquote>La correlación cobre-peso existe. Pero usarla como modelo de predicción es lo mismo que conducir mirando el retrovisor.</blockquote><p>La próxima vez que un análisis de renta fija use el precio del cobre como variable dominante para proyectar el tipo de cambio, la pregunta correcta es: ¿qué están asumiendo sobre el diferencial de tasas y sobre el riesgo político? Si la respuesta es "nada", el modelo tiene un problema.</p>',
false, '2025-09-24 10:00:00+00', 6, '2025-09-24 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'Inflación subyacente vs. IPC: las dos historias de un mismo dato',
'inflacion-subyacente-ipc-dos-historias',
'Cuando el Banco Central mira la inflación, no mira lo que publican los periódicos.',
'<p>Cada mes, el INE publica el IPC y los periódicos titulares con el número. Ese número es correcto y es relevante para los contratos indexados, los reajustes salariales y la percepción de los consumidores. No es, sin embargo, el número que determina la política monetaria.</p><h2>Qué mira realmente el Banco Central</h2><p>El Banco Central de Chile monitorea principalmente la inflación subyacente, que excluye alimentos frescos y energía —los componentes más volátiles del IPC. La razón es técnica pero importante: si la tasa de política respondiera a cada movimiento de los precios del petróleo o de las frutas y verduras, estaría reaccionando a shocks de oferta que no puede controlar y que se revierten solos.</p><p>En los últimos doce meses, el IPC titular en Chile ha mostrado convergencia hacia la meta del 3%. La inflación subyacente ha convergido más lento. Esa divergencia no es un problema de medición: es información sobre dónde está la rigidez en el sistema de precios.</p><h2>La rigidez de servicios y sus implicancias</h2><p>Los servicios en Chile —arriendos, educación, salud, servicios financieros— tienen una dinámica de precios distinta a los bienes. No responden rápidamente a las condiciones monetarias porque sus costos están indexados a contratos de largo plazo y a negociaciones salariales que se actualizan con rezago.</p><blockquote>El IPC baja antes de que la inflación subyacente de servicios llegue a la meta. Esa brecha es la que define el espacio real de política monetaria.</blockquote><p>La implicancia práctica es que el ciclo de baja de tasas que el mercado espera tiene un límite estructural que el IPC titular no revela. Para verlo, hay que mirar el componente de servicios. Ese es el dato que importa en el horizonte de doce a dieciocho meses.</p>',
false, '2025-10-14 10:00:00+00', 6, '2025-10-14 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'Ciclo político y expectativas inflacionarias: lo que el mercado evita decir',
'ciclo-politico-expectativas-inflacionarias',
'Las expectativas de inflación en Chile tienen un componente político que los modelos ignoran por convención.',
'<p>Existe una convención no escrita en el análisis macroeconómico chileno: los modelos de inflación no incluyen variables políticas explícitas. La razón es metodológica —es difícil operacionalizar "riesgo político"— pero también es de autoprotección: ningún economista de banco quiere publicar que sus proyecciones dependen de quién gane una elección.</p><h2>El problema con la convención</h2><p>Las expectativas de inflación en Chile se mueven cuando hay anuncios de política fiscal expansiva, cuando hay incertidumbre regulatoria en sectores intensivos en precio, o cuando el debate político sugiere cambios en la indexación de contratos laborales. Esos movimientos son reales y están documentados en las encuestas de expectativas del Banco Central.</p><p>Ignorarlos por convención no los hace desaparecer. Los hace invisibles en los modelos, lo que significa que las proyecciones se equivocan sistemáticamente en períodos electorales y de alta incertidumbre política.</p><h2>Lo que dicen los datos de expectativas</h2><p>Las encuestas de expectativas del Banco Central muestran un patrón consistente: en los seis meses previos a elecciones presidenciales en Chile, la dispersión de las expectativas de inflación a doce meses aumenta. No necesariamente el nivel —la mediana puede mantenerse estable— sino la dispersión. Ese aumento de dispersión es información sobre incertidumbre que los modelos de punto central no capturan.</p><blockquote>Una proyección de inflación que no incluye alguna medida de incertidumbre política está incompleta. La pregunta es si esa incompletitud es tolerable o no.</blockquote><p>Mi posición: en Chile, en este momento del ciclo político, no es tolerable. El horizonte de política monetaria relevante —los próximos doce a dieciocho meses— coincide con un período de definición política que tiene implicancias fiscales reales. Ignorar eso es una decisión metodológica que tiene consecuencias en la calidad de las proyecciones.</p>',
false, '2025-11-05 10:00:00+00', 7, '2025-11-05 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'Lo que Chile puede aprender de Brasil en política monetaria',
'chile-aprender-brasil-politica-monetaria',
'Brasil tiene el banco central más independiente de América Latina y también el más criticado. Hay lecciones en esa paradoja.',
'<p>El Banco Central de Brasil —el BCB— es, por cualquier métrica institucional, el banco central más independiente y técnico de América Latina. Tiene autonomía legal formal desde 2021, publica actas detalladas de sus reuniones, y sus comunicaciones son modelos de claridad técnica. También ha sido consistentemente criticado por mantener tasas reales entre las más altas del mundo.</p><h2>La paradoja de la credibilidad cara</h2><p>Brasil construyó su credibilidad antiinflacionaria a un costo muy alto: tasas reales ex ante que han promediado entre 6% y 8% durante los últimos quince años. Ese nivel de tasa real tiene un efecto supresivo sobre la inversión privada que los modelos estándar capturan mal, porque asumen que la inversión responde principalmente a la tasa nominal y no a la real esperada en horizontes largos.</p><p>El resultado documentado es que Brasil tiene baja inflación y bajo crecimiento potencial. La causalidad es discutida, pero la correlación es consistente.</p><h2>La lección relevante para Chile</h2><p>Chile no tiene el problema de credibilidad de Brasil en los años noventa. El Banco Central chileno tiene un historial antiinflacionario sólido y expectativas bien ancladas. Eso significa que el costo de credibilidad que Brasil tuvo que pagar no es necesario en el caso chileno.</p><blockquote>La independencia del banco central no es un fin en sí mismo. Es un instrumento para mantener la estabilidad de precios a un costo razonable para el crecimiento.</blockquote><p>La lección práctica: Chile puede permitirse una política monetaria más reactiva a las condiciones del ciclo —bajando más rápido cuando corresponde, sin el temor de perder credibilidad— precisamente porque esa credibilidad está más consolidada. El error sería importar el modelo de Brasil sin importar el contexto que lo hizo necesario.</p>',
false, '2025-11-26 10:00:00+00', 7, '2025-11-26 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'Mercado laboral y la ilusión del pleno empleo',
'mercado-laboral-ilusion-pleno-empleo',
'La tasa de desempleo en Chile está en un nivel que en cualquier modelo de libro de texto señala pleno empleo. Los datos dicen otra cosa.',
'<p>La tasa de desempleo en Chile lleva varios trimestres en el rango del 8,5% al 9,0%. En los modelos estándar de política monetaria, ese nivel sugiere que la economía opera cerca de su capacidad potencial y que hay poco espacio para estímulo adicional sin presiones inflacionarias. El problema es que ese modelo asume una composición del empleo que no corresponde a la realidad chilena actual.</p><h2>El empleo que crece y el que no</h2><p>El detalle de los datos de la Encuesta Nacional de Empleo muestra una bifurcación que el número agregado oculta. El empleo asalariado formal —el que tiene contrato, cotizaciones y acceso a beneficios del Código del Trabajo— crece lento, por debajo de la tendencia histórica. El empleo por cuenta propia, en cambio, ha tenido un crecimiento anómalo para un período de expansión moderada.</p><p>Esa bifurcación importa para la política monetaria por una razón específica: el empleo por cuenta propia tiene una dinámica salarial distinta. Los ingresos del trabajo independiente son más volátiles, menos indexados a negociaciones colectivas, y responden de manera diferente a las condiciones monetarias. Un modelo que trata el empleo como homogéneo subestima esa heterogeneidad.</p><blockquote>La tasa de desempleo agrega en un solo número realidades del mercado laboral que son relevantes para la política monetaria de maneras distintas.</blockquote><p>La implicancia: la brecha de producto —la diferencia entre el PIB efectivo y el potencial— está siendo subestimada por los modelos estándar. Y si la brecha es mayor, hay más espacio de estímulo del que el consenso reconoce. Ese es el argumento para tasas más bajas de lo que el mercado actualmente descuenta.</p>',
false, '2025-12-17 10:00:00+00', 7, '2025-12-17 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'Carry trade y el peso chileno: cómo el diferencial de tasas mueve el tipo de cambio',
'carry-trade-peso-chileno-diferencial-tasas',
'El carry trade no es un fenómeno de mercados desarrollados. Opera en el peso chileno de manera sistemática y predecible.',
'<p>El carry trade —pedir prestado en una moneda de baja tasa de interés para invertir en una de alta tasa— no requiere sofisticación institucional. Requiere un diferencial de tasas estable, liquidez suficiente para entrar y salir, y un tipo de cambio que no se mueva lo suficiente como para borrar el beneficio del diferencial.</p><h2>Cómo opera en Chile</h2><p>El peso chileno cumple esas condiciones con frecuencia suficiente como para que el carry trade sea un factor relevante en la determinación del tipo de cambio. En períodos donde la tasa de política monetaria del Banco Central de Chile está significativamente por encima de la de la Fed, el flujo de capitales hacia activos chilenos denominados en pesos genera una presión apreciadora que es independiente de los fundamentales del cobre o del ciclo económico.</p><p>Ese flujo no es infinito ni permanente. Se revierte cuando el diferencial se cierra o cuando aumenta la percepción de riesgo político en Chile. Y cuando se revierte, lo hace más rápido que la velocidad a la que entró, generando episodios de depreciación aguda que los modelos calibrados en condiciones normales no predicen bien.</p><h2>Las implicancias para 2026</h2><p>Si el Banco Central de Chile baja la tasa como el mercado descuenta, el diferencial con la Fed se cierra. Eso reduce el atractivo del carry al peso. En un escenario donde la Fed mantiene tasas o baja más lento que el BCCh, ese cierre de diferencial es un factor de presión depreciadora sobre el peso que los modelos de tipo de cambio estándar capturan mal.</p><blockquote>El tipo de cambio en Chile en 2026 tiene un riesgo al alza —depreción del peso— que el mercado está subestimando si el ciclo de baja del BCCh es más rápido que el de la Fed.</blockquote>',
false, '2026-02-11 10:00:00+00', 7, '2026-02-11 09:00:00+00'),

('b1000000-0000-0000-0000-000000000001',
'La deuda fiscal chilena: espacio macroeconómico o trampa de largo plazo',
'deuda-fiscal-chilena-espacio-trampa',
'Chile tiene una de las deudas públicas más bajas de América Latina. Usarla como espacio fiscal tiene un costo que el debate político evita mencionar.',
'<p>La deuda pública bruta de Chile como porcentaje del PIB es, por cualquier comparación regional, baja. Eso genera un argumento que reaparece cíclicamente en el debate político: dado que Chile tiene espacio fiscal, debería usarlo para financiar inversión pública o gasto social sin riesgo para la sostenibilidad fiscal.</p><p>El argumento es correcto en su premisa y equivocado en su conclusión.</p><h2>El problema de la velocidad de acumulación</h2><p>Lo que importa para la sostenibilidad fiscal no es el nivel de deuda en un punto del tiempo, sino la velocidad a la que esa deuda se acumula. Chile ha pasado de una deuda bruta del 5% del PIB en 2009 al 38% actual. Ese ritmo de acumulación —sostenido, con interrupciones menores— es el dato relevante, no el nivel.</p><p>Si ese ritmo continúa, Chile llegará a niveles de deuda que empiezan a afectar el costo de financiamiento soberano en un horizonte de diez a quince años. No es una crisis inminente. Es una tendencia que, si no se corrige, produce costos que la generación que hoy debate el presupuesto no va a pagar.</p><h2>El espacio real y el espacio percibido</h2><p>El espacio fiscal real de Chile es más pequeño que el que sugiere el nivel de deuda bruta porque hay pasivos contingentes —principalmente pensiones y garantías a proyectos de infraestructura— que no aparecen en el balance oficial pero que representan obligaciones reales. Cuando se incluyen esos pasivos contingentes en el análisis, el espacio fiscal percibido se reduce significativamente.</p><blockquote>Chile tiene espacio fiscal. Pero ese espacio no es ilimitado, y la velocidad a la que se está usando es relevante para el largo plazo.</blockquote>',
false, '2026-04-08 10:00:00+00', 8, '2026-04-08 09:00:00+00'),

-- ═══ CAROLINA VEGA TORO ═══════════════════════════════════════════════════════

('b1000000-0000-0000-0000-000000000002',
'Por qué los múltiplos de valoración mienten en Chile',
'multiplos-valoracion-mienten-chile',
'Nueve años cerrando M&A me enseñaron que el EV/EBITDA es un punto de partida, no una respuesta.',
'<p>Cuando llegué a mi primer trabajo en M&A, me enseñaron a valorar empresas usando múltiplos de mercado. EV/EBITDA, Price/Earnings, EV/Sales. Comparabas la empresa objetivo con transacciones similares, aplicabas el múltiplo al EBITDA del target, y tenías una valoración. Simple, rápido, defendible en una presentación al board.</p><p>Nueve años de transacciones reales me enseñaron que ese método es correcto en promedio y peligroso en casos específicos. El problema no es el múltiplo. El problema es lo que el múltiplo no captura.</p><h2>Lo que el EBITDA no dice</h2><p>El EBITDA excluye amortizaciones e intereses por diseño. En industrias con activos de larga vida útil —retail, manufactura, infraestructura— esa exclusión distorsiona la capacidad real de generación de caja. Una empresa con activos viejos y capex de mantenimiento alto puede mostrar un EBITDA atractivo que se transforma en flujo de caja libre negativo cuando se contabiliza el capex que la empresa necesita para mantener su capacidad operativa.</p><p>En las transacciones chilenas donde he participado, este problema es más frecuente en retail y en empresas de servicios con flota vehicular propia. El vendedor presenta el EBITDA normalizado. El comprador que hace la due diligence bien descubre que el capex de mantenimiento no estaba normalizado.</p><h2>El problema de los comparables en mercados ilíquidos</h2><p>Chile tiene un mercado de capitales relativamente pequeño. La bolsa chilena tiene menos de cincuenta empresas con liquidez real. Eso significa que cuando buscas comparables públicos para una empresa mediana en un sector específico, el universo de comparables genuinamente comparables puede ser de tres o cuatro empresas.</p><blockquote>Un múltiplo calculado sobre cuatro comparables con fundamentales distintos es estadísticamente indefendible. El mercado lo acepta de todas formas porque no tiene alternativa mejor.</blockquote><p>La implicancia práctica: en el mercado chileno, los múltiplos de valoración son referencias, no respuestas. La due diligence financiera —el análisis del flujo de caja libre real, la calidad del EBITDA, los pasivos contingentes— es lo que determina el precio real.</p>',
true, '2025-08-20 10:00:00+00', 7, '2025-08-20 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'Due diligence: lo que los compradores nunca preguntan',
'due-diligence-compradores-no-preguntan',
'En cuarenta procesos de M&A, hay tres preguntas que casi ningún comprador hace y que determinan si la transacción crea o destruye valor.',
'<p>He estado en el lado comprador y en el lado vendedor de transacciones de M&A en Chile. He visto procesos bien ejecutados y procesos donde la due diligence fue básicamente una revisión de estados financieros auditados y una checklist legal. La diferencia en términos de valor creado o destruido en los años post-cierre es consistente.</p><h2>Las tres preguntas que no se hacen</h2><p>La primera es sobre la concentración de clientes. No el número de clientes —ese dato siempre aparece en el IM— sino la naturaleza contractual de esa concentración. ¿Los contratos con los tres principales clientes tienen cláusulas de cambio de control que requieren notificación o consentimiento? ¿Cuántas veces se han renovado y en qué condiciones? En varias transacciones que he visto, el cliente que representa el 30% de los ingresos tiene un contrato anual renovable que se firmó originalmente por la relación personal del dueño, no por la propuesta de valor de la empresa.</p><p>La segunda pregunta es sobre el equipo de management de segunda línea. Todo comprador pregunta por el CEO y los gerentes de área. Casi ninguno pregunta: si mañana se van el CEO y los dos gerentes comerciales, ¿quién sabe hacer qué? En empresas medianas chilenas, la concentración de conocimiento operativo en dos o tres personas es un riesgo que no aparece en los estados financieros.</p><p>La tercera es sobre los litigios laborales no declarados. Los pasivos legales declarados están en los estados financieros. Los litigios laborales en instancias previas a la demanda formal —quejas ante la Dirección del Trabajo, mediaciones en curso, disputas sindicales sin formalizar— no siempre aparecen en la declaración de pasivos contingentes.</p><blockquote>La due diligence que solo mira lo que el vendedor presenta es un ejercicio de confirmación de supuestos, no de descubrimiento de riesgos.</blockquote>',
false, '2025-09-10 10:00:00+00', 7, '2025-09-10 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'Capital privado vs. banca tradicional: qué conviene a las medianas empresas',
'capital-privado-banca-tradicional-medianas-empresas',
'La pregunta no es si tomar deuda o equity. Es si el perfil de riesgo de la empresa justifica el costo de cada fuente.',
'<p>Cuando una empresa mediana chilena necesita capital para crecer, la pregunta que enfrenta el gerente financiero o el dueño es frecuentemente mal formulada: ¿banco o fondo de capital privado? La pregunta correcta es más específica: ¿cuál es el perfil de flujo de caja de la empresa en los próximos cinco años, y qué tipo de capital es compatible con ese perfil?</p><h2>Lo que la banca ofrece realmente</h2><p>La banca chilena tiene un producto razonablemente estandarizado para empresas medianas: crédito a tasa fija o variable, con garantías reales o personales del dueño, con amortización periódica. Es capital predecible en costo y en estructura de repago. El problema es que ese producto requiere flujo de caja operativo estable y positivo para servir la deuda. Si la empresa está en una fase de inversión donde el flujo de caja libre va a ser negativo durante dos o tres años, la banca no es la fuente adecuada.</p><h2>Lo que el capital privado ofrece realmente</h2><p>Un fondo de capital privado no es solo dinero. Es dinero con una tesis de inversión, un horizonte de salida, y expectativas de retorno que implican una tasa de crecimiento que la empresa tiene que cumplir. Eso tiene valor cuando la empresa necesita capital paciente para una fase de crecimiento. Tiene costo cuando el ritmo de crecimiento que el fondo requiere no es consistente con la estrategia de largo plazo del negocio.</p><blockquote>El capital privado no es una alternativa a la banca. Es un producto distinto para un perfil de empresa distinto. La confusión entre los dos genera malas decisiones de financiamiento.</blockquote>',
false, '2025-10-01 10:00:00+00', 6, '2025-10-01 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'El family office chileno: cómo invierte, qué busca, qué evita',
'family-office-chileno-como-invierte',
'Los family offices chilenos son el capital más relevante del mercado privado local. Y el menos estudiado.',
'<p>En Chile existen entre ochenta y ciento veinte family offices activos, dependiendo de cómo se defina el término. Son la fuente de capital privado más importante del mercado local —más relevante que los fondos de PE formales en términos de volumen de transacciones— y también la menos documentada.</p><h2>El perfil de inversión típico</h2><p>El family office chileno tiene un portafolio que en promedio incluye activos inmobiliarios locales, acciones de bolsa local e internacional, y participaciones en empresas privadas que son operadas por la familia o en las que la familia tiene conocimiento sectorial directo. La asignación a activos alternativos —PE, VC, hedge funds— es creciente pero todavía menor que en family offices de economías comparables.</p><p>Lo que buscan cuando invierten en empresas privadas no es solo retorno financiero. En la mayoría de los casos que he observado, buscan tres cosas: claridad sobre el management (prefieren invertir con el fundador activo, no en buyouts sin operador conocido), visibilidad de los fundamentales (empresas con contabilidad clara y sin pasivos contingentes ocultos), y un horizonte de salida que no los obligue a un proceso de M&A formal en menos de cinco años.</p><h2>Lo que evitan sistemáticamente</h2><p>Los family offices chilenos evitan consistentemente las inversiones que requieren trabajo operativo intensivo post-inversión. No tienen estructura para turnarounds. Evitan sectores con alta regulación cambiante —salud, educación con subsidio estatal— y sectores con alta dependencia de un cliente o contrato gubernamental.</p><blockquote>El family office chileno es el inversionista más paciente del mercado privado local. Y también el más conservador en su definición de riesgo aceptable.</blockquote>',
false, '2025-10-22 10:00:00+00', 6, '2025-10-22 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'Cómo se estructura un proceso de M&A mediano en Chile',
'como-estructura-proceso-ma-mediano-chile',
'Un proceso de venta bien estructurado puede mejorar el precio final entre un 15% y un 25%. La mayoría de las empresas medianas en Chile no lo estructuran bien.',
'<p>Un proceso de M&A tiene tres fases que, bien ejecutadas, maximizan el valor para el vendedor: preparación, mercadeo, y negociación. En el mercado chileno de empresas medianas —transacciones entre USD 5 millones y USD 50 millones— la fase de preparación es sistemáticamente subestimada.</p><h2>La preparación que nadie hace</h2><p>La preparación correcta de una empresa para un proceso de venta incluye tres elementos que la mayoría de los dueños de empresas medianas chilenas no ejecutan: la normalización del EBITDA, la resolución de pasivos contingentes, y la documentación del pipeline comercial.</p><p>La normalización del EBITDA no es maquillaje contable. Es el proceso de separar los gastos que son genuinamente operativos de los que son discrecionales del dueño —viajes personales, vehículos familiares, sueldos de familiares sin función operativa real— y presentarlos de forma que un comprador externo pueda entender cuál es la utilidad real del negocio sin el dueño presente.</p><h2>El mercadeo selectivo vs. el proceso amplio</h2><p>Para empresas medianas en el mercado chileno, el proceso de venta amplio —contactar a veinte o treinta potenciales compradores— rara vez genera mejores resultados que un proceso selectivo de cinco a ocho compradores bien calificados. La razón es que el proceso amplio genera ruido en el mercado, reduce la confidencialidad, y diluye la atención del equipo vendedor.</p><blockquote>Un comprador que ha hecho su tarea antes de llegar a la primera reunión es más valioso que diez compradores que están explorando sin convicción.</blockquote>',
false, '2025-11-12 10:00:00+00', 7, '2025-11-12 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'Estructura de deuda y covenants: lo que el CFO firma sin leer',
'estructura-deuda-covenants-cfo-firma-sin-leer',
'Los covenants financieros en los contratos de crédito corporativo chileno son más restrictivos de lo que los CFOs asumen cuando firman.',
'<p>Un covenant financiero es una restricción contractual que el deudor acepta como condición para acceder al crédito. En teoría, el CFO entiende todos los covenants antes de firmar el contrato. En la práctica, he visto CFOs de empresas medianas chilenas entrar en procesos de discusión con sus bancos por incumplimientos de covenants que no recordaban haber aceptado.</p><h2>Los covenants que más problemas generan</h2><p>El covenant de leverage —típicamente expresado como Deuda Neta/EBITDA máximo— es el que más frecuentemente genera fricciones en empresas en crecimiento. La empresa firma con un leverage de 3,0x que parece razonable en el momento del crédito. Dos años después, si la empresa ha crecido por adquisición y el EBITDA consolidado no creció a la misma velocidad que la deuda, el ratio supera el límite y el banco tiene el derecho contractual de acelerar el pago.</p><p>El covenant de distribución de dividendos es el segundo más problemático. Muchas empresas familiares chilenas usan la empresa operativa como vehículo de distribución de liquidez a la familia. Un covenant que restringe los dividendos a un porcentaje del EBITDA o que los prohíbe en caso de leverage por encima de cierto nivel cambia completamente la mecánica de cash management de la empresa.</p><blockquote>El costo real de un crédito corporativo no es la tasa. Es la suma de la tasa más el valor de la opcionalidad que los covenants le entregan al banco.</blockquote>',
false, '2025-12-03 10:00:00+00', 7, '2025-12-03 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'Valoración de startups en Chile: los tres métodos y sus problemas',
'valoracion-startups-chile-tres-metodos',
'Valorar una startup sin EBITDA positivo requiere métodos distintos. El problema es que esos métodos tienen supuestos que rara vez se hacen explícitos.',
'<p>Cuando un fondo de capital de riesgo o un angel investor en Chile valora una startup en etapa temprana, no puede usar los métodos estándar de valoración que funcionan para empresas maduras. No hay EBITDA histórico. No hay flujo de caja libre positivo. Los estados financieros muestran pérdidas por diseño.</p><h2>El método de comparables de ronda</h2><p>El método más usado en la práctica chilena es el de comparables de ronda: ¿a qué valoración se financiaron startups similares en etapas similares en Chile y en la región? Este método tiene la ventaja de ser rápido y de anclar la discusión en transacciones reales. Tiene el problema de que el universo de comparables en Chile es pequeño y las valuaciones de Silicon Valley o CDMX no son directamente transferibles a un mercado con menos liquidez y menor base de clientes potenciales.</p><h2>El DCF con escenarios</h2><p>El DCF aplicado a startups requiere construir escenarios de penetración de mercado, ticket promedio, churn y costos de adquisición que son, en etapa temprana, básicamente suposiciones con estructura matemática. El resultado es un rango de valoración que puede ir de USD 2M a USD 20M dependiendo de los supuestos, lo que hace que el modelo sea más útil para el análisis de sensibilidad que para la determinación del precio.</p><blockquote>Una valoración de startup es un ejercicio de negociación disfrazado de modelo financiero. Entender eso no la invalida. La hace más honesta.</blockquote>',
false, '2025-12-24 10:00:00+00', 6, '2025-12-24 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'M&A en Chile en 2025: el mercado frío que no es tan frío',
'ma-chile-2025-mercado-frio',
'El volumen de transacciones de M&A en Chile bajó en 2024. Los datos de pipeline sugieren que 2025 es distinto.',
'<p>El mercado de M&A en Chile tuvo un año 2024 de bajo volumen por cualquier métrica que se use: número de transacciones, valor total transado, múltiplos promedio. Las razones son conocidas: tasas de interés altas que encarecieron el financiamiento de adquisiciones, incertidumbre política que retrasó decisiones de inversión, y un ciclo económico que redujo el EBITDA de varias industrias objetivo.</p><h2>Lo que el pipeline dice sobre 2025</h2><p>El pipeline de transacciones —las operaciones en proceso de due diligence o en negociación exclusiva— es un indicador adelantado del volumen de cierre de tres a seis meses. El pipeline que observo en el primer trimestre de 2025 es significativamente mayor que el del mismo período de 2024. Las razones también son conocidas: las tasas han bajado, mejorando el acceso a financiamiento; el ciclo económico está en recuperación moderada; y hay una cohorte de empresas fundadas entre 2015 y 2018 que están llegando a la etapa de madurez donde los fundadores evalúan opciones de liquidez.</p><h2>Los sectores con más actividad</h2><p>Los sectores con mayor actividad de pipeline en Chile en 2025 son tecnología y software B2B, servicios de salud no hospitalarios (clínicas ambulatorias, centros de diagnóstico), y logística de última milla. Todos comparten una característica: márgenes predecibles, contratos de largo plazo, y potencial de escalamiento regional que hace atractiva la inversión de compradores con presencia en más de un país de la región.</p><blockquote>El mercado de M&A en Chile no está frío. Está seleccionando. Los activos de calidad con management sólido se están transando. Los activos medianos con pasivos contingentes no declarados no encuentran comprador a precio razonable.</blockquote>',
false, '2026-02-18 10:00:00+00', 7, '2026-02-18 09:00:00+00'),

('b1000000-0000-0000-0000-000000000002',
'El error más frecuente en la primera ronda de inversión',
'error-frecuente-primera-ronda-inversion',
'El 60% de los fundadores que levantaron su primera ronda en Chile en los últimos tres años sobreestimaron el capital que necesitaban o subestimaron el costo real de levantarlo.',
'<p>La primera ronda de inversión en una startup chilena tiene un conjunto de errores recurrentes que he observado desde el lado del inversionista. No son errores de inteligencia ni de capacidad. Son errores de información: los fundadores hacen la ronda sin conocer las convenciones del mercado, los derechos que están cediendo, o el impacto de esos derechos en rondas futuras.</p><h2>El error de la valoración aspiracional</h2><p>El primer error frecuente es llegar a una negociación con una valoración basada en el potencial del mercado total —el TAM— en lugar de en las métricas actuales del negocio. Un inversionista que evalúa una startup chilena en etapa seed no paga por el TAM. Paga por la calidad del equipo, la tracción temprana, y la tesis de mercado. La valoración que se puede defender con métricas es la que cierra rondas.</p><h2>El error de los derechos preferentes sin entender sus consecuencias</h2><p>Las acciones preferentes que los inversionistas reciben en una primera ronda vienen con derechos que el fundador frecuentemente no lee con el cuidado que merecen: preferencia de liquidación, derechos de antidilución, drag-along. En una salida donde el precio está por debajo de la valoración de la última ronda, esos derechos determinan cuánto recibe el fundador y cuánto recibe el fondo. He visto fundadores chilenos que vendieron su empresa a un precio razonable y recibieron menos de lo que esperaban porque la estructura de preferencias de liquidación absorbió la mayor parte del proceeds.</p><blockquote>Los term sheets son documentos legales que tienen consecuencias financieras reales en los escenarios de salida que nadie quiere imaginar cuando está levantando capital.</blockquote>',
false, '2026-04-15 10:00:00+00', 7, '2026-04-15 09:00:00+00')

ON CONFLICT (slug) DO NOTHING;
