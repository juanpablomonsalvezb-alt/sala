export interface GlossaryTerm {
  slug: string
  term: string
  discipline: string
  shortDef: string
  fullDef: string
  relatedCreatorSlugs?: string[]
  relatedTermSlugs?: string[]
  seeAlso?: string[]
}

export const disciplineLabels: Record<string, string> = {
  economia: 'Economía',
  finanzas: 'Finanzas Corporativas',
  derecho: 'Derecho',
  medicina: 'Salud Pública',
}

export const disciplineColors: Record<string, string> = {
  economia: 'bg-blue-50 text-blue-700 border-blue-200',
  finanzas: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  derecho: 'bg-amber-50 text-amber-700 border-amber-200',
  medicina: 'bg-rose-50 text-rose-700 border-rose-200',
}

export const glossaryTerms: GlossaryTerm[] = [
  // ECONOMÍA
  {
    slug: 'tasa-de-politica-monetaria-tpm',
    term: 'Tasa de política monetaria (TPM)',
    discipline: 'economia',
    shortDef: 'Tasa de interés de referencia que fija el Banco Central para guiar el costo del crédito en la economía.',
    fullDef: `<p>La tasa de política monetaria (TPM) es el principal instrumento de política monetaria del Banco Central de Chile. Corresponde a la tasa de interés interbancaria de corto plazo que el Banco Central establece como objetivo en sus operaciones de mercado abierto. Todas las demás tasas de la economía —hipotecarias, de consumo, corporativas— se forman a partir de ella.</p>
<p>El Consejo del Banco Central se reúne ocho veces al año para decidir si ajusta la TPM, la mantiene o la modifica. Sus decisiones se basan en la evolución de la inflación proyectada respecto a la meta del 3% con tolerancia de ±1 pp, en la brecha del producto y en las expectativas inflacionarias de mercado. En episodios de presión inflacionaria severa, como el ciclo 2021-2023, la TPM puede subir varios cientos de puntos base en pocos meses.</p>
<p>Para los consumidores, una TPM alta encarece las hipotecas y el crédito de consumo; para las empresas, aumenta el costo del capital de trabajo. Para el tipo de cambio, una TPM elevada respecto a la tasa de la Reserva Federal de EE.UU. puede atraer capitales y apreciar el peso chileno. La TPM es, en consecuencia, la variable macroeconómica de política más vigilada por los agentes financieros locales.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['inflacion-subyacente', 'regla-de-taylor', 'expectativas-de-inflacion'],
    seeAlso: ['Banco Central de Chile', 'Inflación IPC', 'Forward guidance'],
  },
  {
    slug: 'inflacion-subyacente',
    term: 'Inflación subyacente',
    discipline: 'economia',
    shortDef: 'Medida de inflación que excluye precios de energía y alimentos frescos por su alta volatilidad transitoria.',
    fullDef: `<p>La inflación subyacente, también llamada inflación núcleo o core inflation, elimina de la canasta del IPC los componentes más volátiles: combustibles, tarifas de electricidad y alimentos con precios agrícolas fluctuantes. El objetivo es capturar la tendencia inflacionaria estructural y separar el "ruido" de los shocks externos o estacionales.</p>
<p>El Banco Central de Chile monitorea la inflación subyacente como señal más fidedigna de las presiones de demanda doméstica. Cuando la inflación subyacente se desancla de la meta, indica que el problema inflacionario está arraigado en la economía real y no se resolverá solo con el paso de los shocks de oferta. En 2022-2023, la inflación subyacente chilena superó el 10% anual, obligando al Banco Central a mantener la TPM en máximos históricos por más tiempo del esperado.</p>
<p>En la práctica, existen múltiples medidas de inflación subyacente: el IPC sin volátiles del INE, la media podada (trimmed mean), la mediana ponderada y los modelos basados en componentes principales. Cada una tiene sus defensores metodológicos, pero todas comparten el objetivo de medir la inercia inflacionaria que la política monetaria puede y debe controlar.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['tasa-de-politica-monetaria-tpm', 'indice-de-precios-al-consumidor-ipc', 'expectativas-de-inflacion'],
    seeAlso: ['IPC sin volátiles', 'Media podada', 'Inercia inflacionaria'],
  },
  {
    slug: 'regla-de-taylor',
    term: 'Regla de Taylor',
    discipline: 'economia',
    shortDef: 'Fórmula que estima la tasa de política monetaria óptima en función de la brecha del producto y la desviación de la inflación respecto a su meta.',
    fullDef: `<p>La regla de Taylor, propuesta por el economista John B. Taylor de Stanford en 1993, es una ecuación que describe cómo debería fijar su tasa de interés un banco central en función de dos variables: la desviación de la inflación respecto a la meta y la brecha del producto. En su forma estándar: TPM = r* + π + 0.5(π − π*) + 0.5(y − y*), donde r* es la tasa real de equilibrio, π la inflación observada, π* la meta y (y − y*) la brecha del producto.</p>
<p>La regla no es un mandato sino una referencia de política sistemática. Los bancos centrales la usan como benchmarck para comunicar sus decisiones y para evaluar si sus acciones pasadas fueron apropiadas. En Chile, los economistas del Banco Central publican regularmente estimaciones de la regla de Taylor como parte del Informe de Política Monetaria (IPoM). Cuando la TPM efectiva se aleja significativamente de lo que la regla sugiere, los mercados buscan la explicación en el discurso del Consejo.</p>
<p>La crítica más frecuente a la regla de Taylor es que sus parámetros —especialmente la tasa neutral r* y el PIB potencial— no son observables directamente y deben estimarse con alta incertidumbre. Versiones más sofisticadas incluyen el tipo de cambio real, las expectativas de inflación de largo plazo o el crédito como variables adicionales de señal.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['tasa-de-politica-monetaria-tpm', 'brecha-del-producto', 'pib-potencial'],
    seeAlso: ['Tasa neutral', 'IPoM', 'Forward guidance'],
  },
  {
    slug: 'pib-potencial',
    term: 'PIB potencial',
    discipline: 'economia',
    shortDef: 'Nivel de producción que puede sostener una economía de forma consistente con una inflación estable, operando en pleno empleo.',
    fullDef: `<p>El PIB potencial no es el PIB máximo físico posible, sino el nivel de actividad compatible con la plena utilización de los factores productivos sin generar presiones inflacionarias. Se trata de una variable no observable que debe estimarse mediante modelos econométricos, lo que introduce una incertidumbre considerable en las decisiones de política.</p>
<p>En Chile, el Ministerio de Hacienda y el Banco Central tienen sus propias metodologías para estimar el PIB tendencial y el PIB potencial respectivamente. Las diferencias entre estas estimaciones son relevantes: el balance estructural del fisco usa el PIB tendencial para calcular el balance cíclicamente ajustado, de modo que una sobreestimación del potencial llevaría a declarar un balance estructural más favorable del real.</p>
<p>El crecimiento del PIB potencial depende de la acumulación de factores (capital físico, trabajo) y del crecimiento de la productividad total de factores (PTF). Chile enfrenta un debate sobre su PIB potencial post-pandemia: estimaciones recientes sugieren que la tasa de crecimiento sostenible de la economía chilena bajó del 3-4% de la década de 2000 a 2-2,5% anual, lo que tiene implicancias directas para la sostenibilidad fiscal y las proyecciones de largo plazo de las pensiones.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['brecha-del-producto', 'balance-estructural', 'regla-de-taylor'],
    seeAlso: ['PTF', 'Crecimiento tendencial', 'Balance cíclico'],
  },
  {
    slug: 'brecha-del-producto',
    term: 'Brecha del producto',
    discipline: 'economia',
    shortDef: 'Diferencia entre el PIB real observado y el PIB potencial, expresada como porcentaje del PIB potencial.',
    fullDef: `<p>La brecha del producto (output gap) es una variable central en macroeconomía porque sintetiza el estado del ciclo económico. Cuando el PIB real supera al potencial (brecha positiva), la economía opera con exceso de demanda, los precios tienden a subir y el Banco Central considera endurecer la política monetaria. Cuando el PIB cae bajo el potencial (brecha negativa), hay recursos subutilizados —desempleo cíclico, capacidad industrial ociosa— y la política puede ser más expansiva.</p>
<p>En Chile, la brecha del producto alcanzó niveles positivos inusualmente altos en 2021 como consecuencia de los retiros de fondos de pensiones y las transferencias fiscales durante la pandemia, lo que contribuyó al pico inflacionario de 2022. El ajuste posterior fue significativo: la economía pasó a operar con una brecha negativa durante 2023-2024, lo que abrió espacio para el ciclo de recortes de TPM.</p>
<p>La dificultad técnica de la brecha del producto es que es una variable latente: los econometristas la estiman en tiempo real con metodologías como el filtro de Hodrick-Prescott, los modelos de estado-espacio o el enfoque de función de producción, y las revisiones retroactivas son frecuentes. El Banco Central publica periódicamente sus estimaciones de la brecha en el IPoM como guía de comunicación de política.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['pib-potencial', 'tasa-de-politica-monetaria-tpm', 'politica-fiscal-contraccilica'],
    seeAlso: ['Output gap', 'Filtro HP', 'Ciclo económico'],
  },
  {
    slug: 'expectativas-de-inflacion',
    term: 'Expectativas de inflación',
    discipline: 'economia',
    shortDef: 'Proyecciones de inflación futura que los agentes descuentan en sus decisiones presentes de precios, salarios y contratos.',
    fullDef: `<p>Las expectativas de inflación son fundamentales para la dinámica inflacionaria real: si empresas y trabajadores esperan inflación alta, la incorporan en sus negociaciones salariales y en sus listas de precios, generando un proceso de profecía autocumplida. Por eso los bancos centrales dedican gran esfuerzo a "anclar" las expectativas en torno a su meta oficial, construyendo credibilidad con acciones consistentes a lo largo del tiempo.</p>
<p>En Chile, las expectativas se miden por múltiples canales: la Encuesta de Expectativas Económicas (EEE) mensual del Banco Central, las compensaciones inflacionarias implícitas en los diferenciales entre tasas nominales y UF de distintos plazos, y los breakevens de los swaps de inflación. En el ciclo inflacionario 2021-2023, las expectativas a dos años se desanclaron brevemente por sobre el 4%, lo que fue una señal de alarma que justificó la agresividad del ciclo de alzas de TPM.</p>
<p>La moderna teoría monetaria (New Keynesian) asigna un rol central a las expectativas: en la curva de Phillips neo-keynesiana, la inflación de hoy depende de la inflación esperada mañana. Esto implica que la comunicación del Banco Central —su forward guidance— es tan importante como las decisiones de tasa, porque moldea las expectativas antes de que los movimientos de tasa se transmitan a la economía real.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['tasa-de-politica-monetaria-tpm', 'inflacion-subyacente', 'regla-de-taylor'],
    seeAlso: ['EEE', 'Compensación inflacionaria', 'Credibilidad monetaria'],
  },
  {
    slug: 'balance-estructural',
    term: 'Balance estructural',
    discipline: 'economia',
    shortDef: 'Balance fiscal ajustado por el ciclo económico y el precio del cobre, que mide el impulso fiscal estructural independiente de factores transitorios.',
    fullDef: `<p>El balance estructural del gobierno chileno descuenta del balance efectivo los efectos transitorios del ciclo económico y del precio del cobre. Si el cobre está alto o la economía crece sobre su potencial, los ingresos fiscales son coyunturalmente elevados; el balance estructural elimina esa ilusión óptica y muestra el déficit o superávit "verdadero" de largo plazo. Es la base de la regla fiscal chilena, vigente desde 2001.</p>
<p>La metodología oficial usa un precio de referencia del cobre calculado por un panel de expertos independientes y un PIB tendencial estimado por el Ministerio de Hacienda. El objetivo de la regla —que ha variado entre superávit del 1% del PIB y déficit del 1,5% según la administración— actúa como ancla de sostenibilidad fiscal y es monitoreado por los mercados como señal de responsabilidad macroeconómica.</p>
<p>Las críticas más relevantes al balance estructural chileno se refieren a la sensibilidad de los resultados a los supuestos del PIB tendencial y del precio de largo plazo del cobre, ambos estimados con considerable incertidumbre. En años de controversia política, las diferencias metodológicas entre el gobierno y los analistas privados pueden llevar a lecturas muy distintas del mismo dato fiscal.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['regla-fiscal', 'fondo-de-estabilizacion-economica-y-social-fees', 'precio-de-paridad-del-cobre'],
    seeAlso: ['Regla fiscal de Chile', 'Comité de Expertos del Cobre', 'Déficit cíclico'],
  },
  {
    slug: 'tipo-de-cambio-real-tcr',
    term: 'Tipo de cambio real (TCR)',
    discipline: 'economia',
    shortDef: 'Tipo de cambio nominal ajustado por los diferenciales de inflación entre dos países, que mide la competitividad cambiaria real.',
    fullDef: `<p>El tipo de cambio real (TCR) mide el poder adquisitivo relativo entre dos economías: cuántos bienes nacionales se necesitan para comprar una unidad de bienes extranjeros. Se calcula como TCR = E × P* / P, donde E es el tipo de cambio nominal (CLP/USD), P* el nivel de precios externo y P el nivel de precios doméstico. Una depreciación nominal no mejora la competitividad si la inflación doméstica es igualmente alta.</p>
<p>Para Chile, el TCR multilateral —ponderado por los principales socios comerciales— es monitoreado por el Banco Central como indicador de competitividad exportadora. Un TCR depreciado favorece las exportaciones no mineras y encarece las importaciones, contribuyendo al ajuste de la cuenta corriente. Un TCR apreciado, por el contrario, puede afectar la competitividad de la industria y los servicios.</p>
<p>En la práctica, el TCR de Chile está fuertemente influido por el precio del cobre: cuando el metal sube, el peso se aprecia (enfermedad holandesa), lo que puede perjudicar la diversificación exportadora. Por eso los análisis de competitividad deben separar los movimientos de TCR asociados al ciclo del cobre de los que reflejan cambios en fundamentales de productividad.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['tipo-de-cambio-nominal', 'cuenta-de-capitales', 'carry-trade'],
    seeAlso: ['Paridad del poder adquisitivo (PPA)', 'Enfermedad holandesa', 'TCR multilateral'],
  },
  // FINANZAS
  {
    slug: 'ebitda',
    term: 'EBITDA',
    discipline: 'finanzas',
    shortDef: 'Ganancias antes de intereses, impuestos, depreciación y amortización; proxy del flujo de caja operativo bruto de una empresa.',
    fullDef: `<p>El EBITDA (Earnings Before Interest, Taxes, Depreciation and Amortization) es la métrica de rentabilidad operativa más utilizada en finanzas corporativas para comparar empresas dentro de una industria, independientemente de su estructura de capital, política fiscal o activos intangibles. Al excluir la carga financiera y los cargos no monetarios, aproxima la capacidad de la empresa para generar caja desde sus operaciones.</p>
<p>En transacciones de M&A, el EBITDA es la base del múltiplo de valoración EV/EBITDA: si una empresa del sector vale "8x EBITDA", una empresa con EBITDA de $10M se valoraría en ~$80M de valor empresa. Esta simplicidad lo hace útil para negociaciones, pero también lo hace susceptible a manipulación contable: los "EBITDA ajustados" que excluyen costos "extraordinarios" recurrentes son una señal de alerta en los procesos de due diligence.</p>
<p>Las críticas al EBITDA son estructurales: Warren Buffett y Charlie Munger lo han llamado "ganancias de dientes de hadas" porque ignora el capex de mantenimiento necesario para sostener el negocio. Para empresas intensivas en activos —minería, telecomunicaciones, retail de gran superficie— el EBITDA puede sobrestimar significativamente la generación real de caja libre.</p>`,
    relatedCreatorSlugs: ['carolina-vega-toro'],
    relatedTermSlugs: ['valor-empresa-ev', 'multiplo-ev-ebitda', 'dcf-discounted-cash-flow'],
    seeAlso: ['EBIT', 'EBITDA ajustado', 'Flujo de caja libre (FCF)'],
  },
  {
    slug: 'valor-empresa-ev',
    term: 'Valor empresa (EV)',
    discipline: 'finanzas',
    shortDef: 'Capitalización bursátil más deuda financiera neta; representa el precio total de adquisición de una empresa libre de caja.',
    fullDef: `<p>El Enterprise Value (EV) o valor empresa es la medida del valor total de una compañía desde la perspectiva de todos sus proveedores de capital —accionistas y acreedores. Se calcula como: EV = Capitalización bursátil + Deuda financiera − Caja y equivalentes. Para empresas privadas, la capitalización se reemplaza por el equity value implícito en la última ronda de valoración o en la transacción.</p>
<p>El EV es la base para los múltiplos de valoración comparativos: EV/EBITDA, EV/Ventas, EV/EBIT. Al incluir la deuda, permite comparar empresas con distintas estructuras de capital —una empresa muy apalancada y una sin deuda— en igualdad de condiciones. En procesos de M&A en Chile, el precio final de la transacción generalmente se negocia sobre el EV y luego se ajusta por la caja y deuda que realmente tiene la empresa al momento del cierre (enterprise-to-equity bridge).</p>
<p>Los ajustes más relevantes al EV en transacciones sofisticadas incluyen: pasivos contingentes (litigios, contingencias tributarias), deuda off-balance-sheet (arrendamientos bajo NIIF 16), capital de trabajo normalizado y compromisos de pensiones. Un error frecuente en due diligence es no incluir la deuda con proveedores de largo plazo o las obligaciones por earn-outs de adquisiciones previas.</p>`,
    relatedCreatorSlugs: ['carolina-vega-toro'],
    relatedTermSlugs: ['ebitda', 'multiplo-ev-ebitda', 'due-diligence'],
    seeAlso: ['Equity value', 'Deuda neta', 'Bridge EV-equity'],
  },
  {
    slug: 'multiplo-ev-ebitda',
    term: 'Múltiplo EV/EBITDA',
    discipline: 'finanzas',
    shortDef: 'Ratio entre el valor empresa y el EBITDA que permite comparar valoraciones entre compañías de una misma industria.',
    fullDef: `<p>El múltiplo EV/EBITDA responde a la pregunta: ¿cuántos años de EBITDA actual cuesta comprar esta empresa? Un múltiplo de 8x significa que el precio de adquisición equivale a 8 años de generación operativa bruta. En industrias maduras y estables —servicios básicos, retail consolidado— los múltiplos típicos oscilan entre 5x y 8x. En sectores de alto crecimiento —tecnología, salud— pueden superar 15x o 20x.</p>
<p>En Chile, los múltiplos de transacciones de empresas medianas no listadas se ubican habitualmente entre 4x y 7x EBITDA, con primas por control y liquidez. Las empresas del IPSA transadas en la Bolsa de Santiago muestran múltiplos históricos de 7x-10x en promedio, con gran dispersión por sector. El análisis de precedentes de transacciones comparables —comparable transactions— es una fuente clave para calibrar el múltiplo adecuado en un proceso de venta.</p>
<p>Las limitaciones del múltiplo EV/EBITDA son múltiples: no captura diferencias en capex, en capital de trabajo ni en el ciclo de vida de la industria. Por eso los analistas de M&A siempre lo complementan con el múltiplo EV/EBIT (que incluye depreciación), con el P/E (precio/utilidad) y con el análisis de DCF como sanity check del valor intrínseco.</p>`,
    relatedCreatorSlugs: ['carolina-vega-toro'],
    relatedTermSlugs: ['ebitda', 'valor-empresa-ev', 'dcf-discounted-cash-flow'],
    seeAlso: ['Comparable companies analysis', 'EV/Ventas', 'P/E ratio'],
  },
  {
    slug: 'dcf-discounted-cash-flow',
    term: 'DCF (Discounted Cash Flow)',
    discipline: 'finanzas',
    shortDef: 'Método de valoración que estima el valor presente de los flujos de caja futuros esperados descontados a la tasa de costo de capital.',
    fullDef: `<p>El DCF o método de flujos descontados es el enfoque de valoración intrínseca por excelencia: el valor de una empresa o activo equivale al valor presente de todos los flujos de caja libre que generará en el futuro, descontados a una tasa que refleja el riesgo de esos flujos. En finanzas corporativas, la tasa de descuento estándar es el WACC (costo promedio ponderado de capital).</p>
<p>La construcción de un DCF requiere proyectar los flujos de caja libre (FCF) para 5-10 años y calcular un valor terminal que captura el valor de la empresa más allá del período explícito. El valor terminal —calculado con la fórmula de Gordon o con un múltiplo de salida— generalmente representa el 60-80% del valor total, lo que revela la enorme sensibilidad del modelo a los supuestos de largo plazo: tasa de crecimiento terminal y WACC.</p>
<p>En Chile, los errores más frecuentes en DCF son: usar el WACC de EE.UU. sin añadir el riesgo país, proyectar márgenes de EBITDA que superan los máximos históricos de la industria, y no modelar adecuadamente el ciclo de inversiones (capex de expansión vs. mantenimiento). El análisis de sensibilidad y los escenarios Monte Carlo son herramientas obligatorias para cualquier DCF profesional en mercados emergentes.</p>`,
    relatedCreatorSlugs: ['carolina-vega-toro'],
    relatedTermSlugs: ['wacc-costo-promedio-ponderado-de-capital', 'ebitda', 'multiplo-ev-ebitda'],
    seeAlso: ['FCFF', 'FCFE', 'Valor terminal', 'Tasa de descuento'],
  },
  {
    slug: 'wacc-costo-promedio-ponderado-de-capital',
    term: 'WACC (Costo promedio ponderado de capital)',
    discipline: 'finanzas',
    shortDef: 'Tasa de descuento que pondera el costo de la deuda y el costo del patrimonio según la estructura de capital de la empresa.',
    fullDef: `<p>El WACC (Weighted Average Cost of Capital) es la tasa mínima de retorno que una empresa debe generar para crear valor para sus accionistas y acreedores. Se calcula como: WACC = (E/V) × Ke + (D/V) × Kd × (1 − t), donde E es el valor del patrimonio, D la deuda, V = E + D el valor total, Ke el costo del patrimonio (calculado con CAPM), Kd el costo de la deuda y t la tasa impositiva.</p>
<p>Para empresas chilenas, el CAPM requiere estimar el beta de la industria (a veces usando comparables de EE.UU. y relevereando), la prima de riesgo de mercado del mercado chileno (~5-6%) y añadir el riesgo soberano de Chile (spread EMBI). Una práctica frecuente es usar el WACC en USD calculado con parámetros del mercado de referencia y traducirlo a CLP mediante el diferencial de inflación (paridad del poder adquisitivo).</p>
<p>El WACC es extremadamente sensible a sus inputs: un error de 1 pp en la tasa libre de riesgo puede cambiar el valor de una empresa en un 15-20%. Esto convierte al WACC en uno de los mayores campos de disputa en transacciones de M&A y en arbitrajes de valoración regulatoria (tarifas de distribución eléctrica, agua potable), donde las diferencias de 0,5 pp en WACC pueden significar cientos de millones de pesos en la tarifa autorizada.</p>`,
    relatedCreatorSlugs: ['carolina-vega-toro'],
    relatedTermSlugs: ['dcf-discounted-cash-flow', 'riesgo-soberano'],
    seeAlso: ['CAPM', 'Beta apalancado', 'Prima de riesgo de mercado'],
  },
  // DERECHO
  {
    slug: 'iva-credito-fiscal',
    term: 'IVA crédito fiscal',
    discipline: 'derecho',
    shortDef: 'IVA soportado en las compras y servicios recibidos que la empresa puede descontar del IVA débito fiscal que debe enterar al Fisco.',
    fullDef: `<p>El IVA (Impuesto al Valor Agregado) en Chile opera bajo el principio de no acumulación: cada eslabón de la cadena productiva recupera el IVA pagado en sus insumos (crédito fiscal) y entera al Fisco solo la diferencia respecto al IVA que cobró a sus clientes (débito fiscal). La tasa vigente es del 19%. Esta mecánica impide que el impuesto se acumule en la cadena de valor.</p>
<p>Para que el IVA soportado sea válido como crédito fiscal, la Ley de IVA (DL 825) exige que se encuentre respaldado por una factura electrónica emitida por el vendedor, que la operación sea de giro del contribuyente, y que el bien o servicio adquirido se destine a actividades afectas a IVA. El SII puede rechazar el crédito fiscal si detecta que la factura es falsa, que el emisor es una empresa de papel (facturero), o que existe simulación de la operación.</p>
<p>La proporción (proporcionalidad del crédito fiscal) es un tema clave para empresas con actividades mixtas: si una empresa realiza operaciones afectas y exentas de IVA, debe prorratear el crédito fiscal según la proporción de ventas afectas sobre el total. Esto genera distorsiones en sectores como la educación privada y los servicios financieros, que tienen parcialmente exentas sus operaciones.</p>`,
    relatedCreatorSlugs: ['matias-cornejo-silva'],
    relatedTermSlugs: ['base-imponible', 'impuesto-de-primera-categoria-idpc', 'norma-antielusiva-general-nga'],
    seeAlso: ['DL 825', 'Factura electrónica', 'Débito fiscal', 'SII'],
  },
  {
    slug: 'impuesto-de-primera-categoria-idpc',
    term: 'Impuesto de primera categoría (IDPC)',
    discipline: 'derecho',
    shortDef: 'Impuesto del 27% que grava las rentas empresariales en Chile; actúa como crédito contra el Global Complementario de los socios.',
    fullDef: `<p>El Impuesto de Primera Categoría (IDPC) es el tributo que grava las rentas del capital y las empresas en Chile. La tasa es del 27% para empresas acogidas al régimen Pro Pyme (anteriormente semi-integrado), y forma parte del sistema de integración con el impuesto final de los socios o accionistas. La mecánica general es que el IDPC pagado por la empresa puede ser utilizado como crédito —total o parcialmente— por los dueños al tributar sus retiros con el Global Complementario o el Impuesto Adicional.</p>
<p>La reforma tributaria de 2014 (Ley 20.780) y sus modificaciones posteriores complejizaron sustancialmente el sistema, introduciendo el régimen de renta atribuida y el semi-integrado, cada uno con distintos niveles de integración. Hoy las empresas deben elegir entre el régimen general (27% IDPC, integración parcial del 65%) y el régimen Pro Pyme (25% y otras ventajas), decisión que tiene consecuencias estructurales en la planificación tributaria.</p>
<p>Para empresas con socios extranjeros, la integración parcial del IDPC con el Impuesto Adicional que pagan los no residentes es un factor determinante en la carga tributaria total. Los convenios para evitar la doble tributación que Chile ha suscrito —con Alemania, España, EE.UU., entre otros— modifican este cálculo y son un elemento central de la planificación fiscal corporativa internacional.</p>`,
    relatedCreatorSlugs: ['matias-cornejo-silva'],
    relatedTermSlugs: ['global-complementario', 'base-imponible', 'precios-de-transferencia', 'spa'],
    seeAlso: ['Renta atribuida', 'Semi-integrado', 'Impuesto Adicional', 'SII'],
  },
  {
    slug: 'norma-antielusiva-general-nga',
    term: 'Norma antielusiva general (NGA)',
    discipline: 'derecho',
    shortDef: 'Cláusula general del Código Tributario que permite al SII recaracterizar operaciones artificiosas realizadas con el único fin de eludir impuestos.',
    fullDef: `<p>La Norma Antielusiva General (NGA), incorporada en el artículo 4 bis y siguientes del Código Tributario por la reforma de 2014, es la herramienta más poderosa del SII para combatir la elusión tributaria. A diferencia de normas antielusivas específicas (que se refieren a operaciones concretas), la NGA tiene carácter general y permite al Servicio declarar que una operación es "abusiva" o "simulada" cuando carece de sustancia económica y tiene como propósito principal obtener ventajas tributarias.</p>
<p>La aplicación de la NGA requiere que el SII solicite autorización al Tribunal Tributario y Aduanero (TTA) antes de aplicarla. Este control judicial previo fue un contrapeso agregado durante la tramitación legislativa para equilibrar el poder que se otorgaba a la administración. En la práctica, el SII ha sido relativamente cauteloso en su uso, acumulando casos paradigmáticos en reorganizaciones empresariales, goodwill y precios de transferencia.</p>
<p>Para los asesores tributarios, la NGA cambió el estándar de planificación: ya no basta con que una operación sea "legal" en términos literales, sino que debe tener sustancia económica real y propósito de negocios legítimo más allá del ahorro tributario. El concepto de "business purpose" anglosajón se incorporó de facto al sistema tributario chileno con la NGA.</p>`,
    relatedCreatorSlugs: ['matias-cornejo-silva'],
    relatedTermSlugs: ['iva-credito-fiscal', 'precios-de-transferencia', 'impuesto-de-primera-categoria-idpc'],
    seeAlso: ['Código Tributario art. 4 bis', 'Abuso de formas', 'Simulación tributaria', 'TTA'],
  },
  {
    slug: 'precios-de-transferencia',
    term: 'Precios de transferencia',
    discipline: 'derecho',
    shortDef: 'Precios pactados entre empresas relacionadas en transacciones transfronterizas, sujetos a la revisión del SII bajo el principio de plena competencia.',
    fullDef: `<p>Los precios de transferencia son los valores que se fijan en transacciones entre empresas vinculadas —filiales, matrices, empresas bajo control común— de distintos países. Su relevancia tributaria radica en que las partes relacionadas pueden manipular estos precios para trasladar utilidades hacia jurisdicciones de baja tributación, reduciendo artificialmente la base imponible en Chile. El SII puede ajustar estos precios cuando no cumplen el principio arm's length (condiciones de plena competencia entre partes independientes).</p>
<p>Chile adoptó las Directrices de Precios de Transferencia de la OCDE y las incorporó en el artículo 41 E del Código Tributario. Los métodos aceptados incluyen el precio comparable no controlado (CUP), el precio de reventa, el costo adicionado, el margen neto de la transacción (TNMM) y la distribución de beneficios. Las empresas con transacciones significativas con relacionadas del exterior deben presentar anualmente la Declaración Jurada 1907 con su análisis de precios de transferencia.</p>
<p>Los focos de fiscalización más frecuentes del SII en precios de transferencia son: regalías por uso de marcas o tecnología con matrices extranjeras, préstamos intragrupo con tasas de interés no de mercado, servicios de administración y asistencia técnica (management fees), y reestructuraciones empresariales que trasladan activos intangibles al exterior. Tras la incorporación de Chile a la OCDE, el nivel de escrutinio aumentó sustancialmente.</p>`,
    relatedCreatorSlugs: ['matias-cornejo-silva'],
    relatedTermSlugs: ['norma-antielusiva-general-nga', 'impuesto-de-primera-categoria-idpc'],
    seeAlso: ['OCDE BEPS', 'Arm\'s length', 'DJ 1907', 'Comparables'],
  },
  {
    slug: 'spa',
    term: 'SpA (Sociedad por Acciones)',
    discipline: 'derecho',
    shortDef: 'Tipo societario chileno que combina la responsabilidad limitada de una SA con la flexibilidad contractual de una sociedad de personas; estándar para startups.',
    fullDef: `<p>La Sociedad por Acciones (SpA), introducida en Chile por la Ley 20.190 de 2007, es el vehículo jurídico preferido para emprendimientos y startups porque combina tres ventajas clave: responsabilidad limitada de los socios (como en una SA), posibilidad de ser constituida por una sola persona, y alta flexibilidad en el estatuto (permite acordar casi cualquier estructura de derechos económicos y políticos entre las partes).</p>
<p>A diferencia de la SA abierta o cerrada, la SpA no tiene limitaciones legales sobre series de acciones, derechos preferentes de pago, liquidación preferente, antidilución o cláusulas drag-along y tag-along: todo puede pactarse en los estatutos. Esto la hace compatible con el estándar de documentación de inversión de venture capital (term sheets con liquidation preference, participating preferred, etc.) sin necesidad de usar una Delaware C-Corp como vehículo.</p>
<p>Para efectos tributarios, la SpA tributa como empresa del IDPC y sus socios como accionistas. No existe el FUT (Fondo de Utilidades Tributables) en el régimen actual, y los retiros se gravan con el impuesto final del dueño. La planificación tributaria en SpA de fundadores que reciben salario y dividendos requiere optimizar la mezcla entre renta del trabajo (Global Complementario) y dividendos para minimizar la carga total.</p>`,
    relatedCreatorSlugs: ['matias-cornejo-silva'],
    relatedTermSlugs: ['impuesto-de-primera-categoria-idpc', 'fusion-por-absorcion', 'responsabilidad-solidaria'],
    seeAlso: ['SA cerrada', 'EIRL', 'Ley 20.190', 'Cap table'],
  },
  // MEDICINA
  {
    slug: 'epidemiologia',
    term: 'Epidemiología',
    discipline: 'medicina',
    shortDef: 'Ciencia que estudia la distribución, determinantes y control de enfermedades y eventos de salud en poblaciones humanas.',
    fullDef: `<p>La epidemiología es la disciplina científica que examina cómo las enfermedades se distribuyen en las poblaciones, qué factores determinan esa distribución y cómo puede modificarse para mejorar la salud colectiva. A diferencia de la medicina clínica —que se centra en el paciente individual— la epidemiología opera a nivel poblacional y utiliza herramientas estadísticas y de diseño de estudios para establecer relaciones causales.</p>
<p>Los diseños de estudio fundamentales de la epidemiología son: los estudios descriptivos (series de casos, estudios ecológicos), los analíticos observacionales (cohortes, casos y controles, transversales) y los experimentales (ensayos clínicos aleatorizados). La jerarquía de evidencia epidemiológica, con los ensayos clínicos y metaanálisis en la cima, es la base de la medicina basada en evidencia.</p>
<p>En Chile, el Departamento de Epidemiología del MINSAL coordina la vigilancia epidemiológica nacional: notificación obligatoria de enfermedades, brotes, resistencia antimicrobiana y mortalidad por causas específicas. La pandemia de COVID-19 elevó la visibilidad pública de la epidemiología y reveló tanto la fortaleza como las limitaciones del sistema de vigilancia chileno, especialmente en la integración de datos entre hospitales, FONASA y el Registro Civil.</p>`,
    relatedCreatorSlugs: ['andrea-poblete-rios'],
    relatedTermSlugs: ['incidencia-vs-prevalencia', 'tasa-de-mortalidad-ajustada', 'daly-disability-adjusted-life-years'],
    seeAlso: ['Vigilancia epidemiológica', 'MINSAL', 'ENT (enfermedades no transmisibles)'],
  },
  {
    slug: 'incidencia-vs-prevalencia',
    term: 'Incidencia vs prevalencia',
    discipline: 'medicina',
    shortDef: 'Incidencia mide nuevos casos en un período; prevalencia mide todos los casos existentes en un momento dado.',
    fullDef: `<p>La incidencia y la prevalencia son las dos medidas fundamentales de frecuencia de enfermedad en epidemiología. La incidencia (I) es el número de nuevos casos de una enfermedad que aparecen en una población en riesgo durante un período de tiempo. La prevalencia (P) es la proporción de individuos en una población que tienen la enfermedad en un momento o período determinado. La relación entre ambas es: P ≈ I × Duración promedio de la enfermedad.</p>
<p>Esta relación tiene implicancias prácticas importantes: una enfermedad puede tener baja incidencia pero alta prevalencia si es crónica (diabetes, hipertensión), o alta incidencia pero baja prevalencia si es aguda y de corta duración (influenza). Para las políticas de salud, la incidencia es más relevante para medir el éxito de intervenciones preventivas; la prevalencia define la carga de enfermedad que el sistema de salud debe atender.</p>
<p>En Chile, los datos de prevalencia provienen principalmente de las Encuestas Nacionales de Salud (ENS) realizadas cada ~10 años, mientras que la incidencia se estima a través de los registros de notificación obligatoria y los egresos hospitalarios del DEIS. La brecha entre ambas fuentes —especialmente en enfermedades crónicas con bajo diagnóstico— es uno de los principales desafíos del sistema de información sanitaria nacional.</p>`,
    relatedCreatorSlugs: ['andrea-poblete-rios'],
    relatedTermSlugs: ['epidemiologia', 'tasa-de-mortalidad-ajustada'],
    seeAlso: ['ENS Chile', 'DEIS MINSAL', 'Cohorte de incidencia'],
  },
  {
    slug: 'daly-disability-adjusted-life-years',
    term: 'DALY (Disability-Adjusted Life Years)',
    discipline: 'medicina',
    shortDef: 'Métrica que cuantifica los años de vida saludable perdidos por una enfermedad, sumando años de vida perdidos por muerte prematura y años vividos con discapacidad.',
    fullDef: `<p>Los DALYs (años de vida ajustados por discapacidad) son la principal métrica de carga de enfermedad desarrollada por la OMS y el Banco Mundial en el Global Burden of Disease Study. Un DALY equivale a la pérdida de un año de vida en perfecta salud. Se calcula como: DALY = YLL + YLD, donde YLL (Years of Life Lost) son los años perdidos por muerte prematura y YLD (Years Lived with Disability) son los años vividos con una condición de salud discapacitante, ponderados por su severidad.</p>
<p>La métrica DALY permite comparar la carga de enfermedades muy distintas —cáncer, depresión, accidentes de tránsito, enfermedades infecciosas— en una escala común, lo que facilita la priorización de intervenciones en salud pública. Países con recursos limitados pueden usar el análisis costo-efectividad expresado en costo por DALY evitado para asignar su presupuesto sanitario.</p>
<p>En Chile, el análisis de DALYs del estudio chileno de carga de enfermedad muestra un patrón de transición epidemiológica avanzada: las enfermedades crónicas no transmisibles (cardiovasculares, cáncer, diabetes, salud mental) dominan la carga, mientras las enfermedades infecciosas tienen un peso menor. La depresión y los trastornos del ánimo representan una fracción creciente de los YLD, un problema que el sistema de salud mental de Chile enfrenta con recursos insuficientes.</p>`,
    relatedCreatorSlugs: ['andrea-poblete-rios'],
    relatedTermSlugs: ['epidemiologia', 'incidencia-vs-prevalencia', 'tasa-de-mortalidad-ajustada'],
    seeAlso: ['Global Burden of Disease', 'YLL', 'YLD', 'AVISA'],
  },
  {
    slug: 'tasa-de-mortalidad-ajustada',
    term: 'Tasa de mortalidad ajustada',
    discipline: 'medicina',
    shortDef: 'Tasa de mortalidad corregida por estructura etaria para permitir comparaciones válidas entre poblaciones con distintas pirámides de edad.',
    fullDef: `<p>La tasa de mortalidad cruda (número de muertes / población total) no permite comparaciones directas entre países o regiones con estructuras de edad distintas, porque una población más envejecida tendrá naturalmente tasas crudas más altas. La estandarización por edad —usando una población de referencia estándar— elimina este sesgo y produce tasas ajustadas comparables.</p>
<p>El método más usado es la estandarización directa: se calcula la tasa de mortalidad específica por grupo de edad en la población de estudio, y luego se aplica esa tasa a la distribución etaria de la población estándar (generalmente la población mundial estándar de la OMS de 2000 o la población europea estándar). El resultado es la tasa que habría observado la población de estudio si tuviera la misma estructura etaria que la estándar.</p>
<p>En Chile, las tasas ajustadas de mortalidad por enfermedades cardiovasculares, cáncer y accidentes cerebrovasculares muestran tendencias muy distintas a las crudas: la mortalidad ajustada por cardiopatía isquémica ha caído significativamente en las últimas dos décadas gracias a mejoras en tratamiento, aunque la mortalidad cruda sube por envejecimiento poblacional. Distinguir estas tendencias es clave para evaluar el desempeño real del sistema de salud.</p>`,
    relatedCreatorSlugs: ['andrea-poblete-rios'],
    relatedTermSlugs: ['epidemiologia', 'incidencia-vs-prevalencia', 'daly-disability-adjusted-life-years'],
    seeAlso: ['Estandarización directa', 'Población estándar OMS', 'AVISA', 'MINSAL DEIS'],
  },
  // Economía adicional
  {
    slug: 'riesgo-soberano',
    term: 'Riesgo soberano',
    discipline: 'economia',
    shortDef: 'Probabilidad de que un gobierno incumpla sus obligaciones de deuda, reflejada en el diferencial de tasas de sus bonos sobre los del Tesoro de EE.UU.',
    fullDef: `<p>El riesgo soberano mide la percepción que tienen los mercados internacionales sobre la capacidad y voluntad de un gobierno para servir su deuda. Se manifiesta en el spread —diferencial de tasas— que pagan los bonos soberanos de un país respecto a los bonos del Tesoro de EE.UU., considerados libres de riesgo. Un spread alto implica mayor costo de endeudamiento para el gobierno y el sector privado del país.</p>
<p>Las calificadoras de riesgo (Moody's, S&P, Fitch) asignan notas crediticias soberanas que sintetizan variables como la deuda pública sobre PIB, el déficit fiscal, el saldo de cuenta corriente, las reservas internacionales, el crecimiento potencial y la fortaleza institucional. Chile mantiene históricamente una de las mejores calificaciones soberanas de América Latina (A+ en S&P), lo que le permite emitir deuda a tasas significativamente inferiores a sus vecinos.</p>
<p>El riesgo soberano afecta directamente al WACC de las empresas privadas que operan en el país: dado que el riesgo corporativo no puede ser menor que el del soberano, el spread soberano se incorpora como piso mínimo de la prima de riesgo país en los modelos de valoración. Una degradación del rating soberano puede encarecer el costo de capital de todo el sector privado, frenando inversiones y crecimiento.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin', 'carolina-vega-toro'],
    relatedTermSlugs: ['spread-embi', 'wacc-costo-promedio-ponderado-de-capital', 'deuda-publica-bruta-vs-neta'],
    seeAlso: ['Rating soberano', 'CDS soberano', 'Spread EMBI+'],
  },
  {
    slug: 'spread-embi',
    term: 'Spread EMBI',
    discipline: 'economia',
    shortDef: 'Diferencial entre las tasas de bonos de mercados emergentes y los bonos del Tesoro de EE.UU., publicado por JP Morgan como índice de riesgo emergente.',
    fullDef: `<p>El EMBI (Emerging Markets Bond Index), creado por JP Morgan, mide el diferencial de rendimiento entre los bonos soberanos y cuasi-soberanos de países emergentes denominados en dólares y los bonos del Tesoro de EE.UU. de igual plazo. Se expresa en puntos básicos (pb): un spread de 150 pb significa que el país paga 1,5% adicional sobre la tasa del Tesoro. Es el indicador más utilizado para monitorear el "termómetro" de riesgo en mercados emergentes.</p>
<p>El EMBI de Chile es habitualmente el más bajo de América Latina, reflejo de su solidez institucional y fiscal. En períodos de turbulencia global —crisis financiera 2008, pandemia 2020, estallido social 2019— el spread sube, reflejando el mayor riesgo percibido y encareciendo el crédito externo. El diferencial entre el EMBI chileno y el promedio regional es una medida del "premio de calidad" que el mercado asigna a la institucionalidad del país.</p>
<p>Los inversionistas de deuda emergente usan el EMBI como benchmark para calcular retornos y gestionar carteras. Cuando el spread EMBI sube (por factores globales o específicos del país), el precio de los bonos cae y los inversionistas que los tenían en cartera registran pérdidas de valor de mercado (mark-to-market). Esta dinámica conecta la percepción del riesgo país con el costo de capital de toda la economía.</p>`,
    relatedCreatorSlugs: ['rodrigo-fuentes-marin'],
    relatedTermSlugs: ['riesgo-soberano', 'curva-de-rendimiento', 'carry-trade'],
    seeAlso: ['EMBI+', 'CDS soberano', 'Bonos en dólares Chile'],
  },
]
