import type { Metadata } from "next";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface CreatorInfo {
  name: string;
  specialty: string;
  bio: string;
  subscribers: number;
  price: string;
  slug: string;
}

interface ArticleData {
  title: string;
  dek: string;
  readingTime: number;
  date: string;
  lead: string;
  body: ArticleBlock[];
  relatedArticles: { title: string; slug: string }[];
}

type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "heading"; text: string }
  | { type: "paywall" };

// ─── Datos mock ───────────────────────────────────────────────────────────────

const creatorsData: Record<string, CreatorInfo> = {
  "rodrigo-fuentes": {
    name: "Rodrigo Fuentes",
    specialty: "ECONOMÍA",
    bio: "Economista. Ex Banco Central. Analiza el mercado chileno desde adentro.",
    subscribers: 847,
    price: "$9.990",
    slug: "rodrigo-fuentes",
  },
  "isabel-contreras": {
    name: "Isabel Contreras",
    specialty: "DERECHO TRIBUTARIO",
    bio: "Abogada tributaria. Ex SII. Lo que necesitas saber antes de que llegue la carta.",
    subscribers: 523,
    price: "$12.990",
    slug: "isabel-contreras",
  },
  "felipe-mora": {
    name: "Felipe Mora",
    specialty: "FINANZAS",
    bio: "Analista financiero. Mercados emergentes LATAM con perspectiva local.",
    subscribers: 421,
    price: "$14.990",
    slug: "felipe-mora",
  },
};

const defaultCreator: CreatorInfo = {
  name: "Rodrigo Fuentes",
  specialty: "ECONOMÍA",
  bio: "Economista. Ex Banco Central. Analiza el mercado chileno desde adentro.",
  subscribers: 847,
  price: "$9.990",
  slug: "rodrigo-fuentes",
};

const articlesData: Record<string, ArticleData> = {
  "por-que-el-peso-cae-cuando-el-cobre-sube": {
    title:
      "Por qué el peso cae cuando el cobre sube: la paradoja que nadie explica bien",
    dek:
      "Existe una correlación que todos los analistas conocen pero muy pocos se atreven a cuestionar. Este análisis va al fondo.",
    readingTime: 8,
    date: "12 de mayo de 2025",
    lead:
      "Hay una pregunta que recibo cada semana de mis suscriptores: si Chile es el mayor productor de cobre del mundo y el precio del metal sube, ¿por qué el peso chileno no se fortalece igual de rápido? La respuesta corta es que sí se fortalece, pero con un rezago que los medios ignoran y que genera oportunidades reales para quienes entienden el mecanismo.",
    body: [
      {
        type: "paragraph",
        text: "El tipo de cambio es, en esencia, el precio relativo de dos economías. Cuando el cobre sube, Codelco y las mineras privadas reciben más dólares por cada tonelada exportada. Esos dólares eventualmente ingresan al sistema financiero chileno y se convierten en pesos, lo que debería apreciar la moneda. Hasta aquí, la teoría.",
      },
      {
        type: "paragraph",
        text: "El problema está en el tiempo. Entre la venta del mineral en los mercados de futuros y la liquidación efectiva de divisas en el mercado chileno pueden pasar entre 30 y 90 días. Durante ese período, el mercado cambiario opera sobre expectativas, no sobre flujos reales.",
      },
      {
        type: "quote",
        text: "El mercado cambiario no responde al precio del cobre de hoy. Responde a lo que los operadores creen que hará el Banco Central en las próximas seis semanas.",
        attribution: "Conversación con un tesorero de banco de primera línea",
      },
      {
        type: "heading",
        text: "El rol del Banco Central que nadie menciona",
      },
      {
        type: "paragraph",
        text: "El Banco Central tiene un mandato implícito de suavizar la volatilidad cambiaria. Cuando el cobre sube de manera brusca, la institución suele intervenir comprando dólares para evitar una apreciación excesiva del peso que dañe la competitividad de exportadores no mineros: forestales, salmones, vino. Esta intervención esteriliza parte del efecto alcista sobre el tipo de cambio.",
      },
      {
        type: "paragraph",
        text: "Lo que los economistas llaman 'enfermedad holandesa' —la apreciación de la moneda que destruye otros sectores exportadores— es el fantasma que el Central siempre tiene en mente cuando el precio del cobre despega.",
      },
      { type: "paywall" },
      {
        type: "heading",
        text: "Las tres ventanas de oportunidad",
      },
      {
        type: "paragraph",
        text: "Para los que sí tienen acceso a este análisis, las implicaciones son concretas. Existe un patrón estadísticamente robusto en el comportamiento del USDCLP en los 45 días posteriores a un rally del cobre mayor al 8% mensual...",
      },
    ],
    relatedArticles: [
      {
        title: "El IPC de marzo y lo que el INE no pone en el titular",
        slug: "ipc-marzo-lo-que-ine-no-pone",
      },
      {
        title:
          "Tasa de política monetaria: cuándo el Banco Central baja y cuándo miente",
        slug: "tpm-cuando-baja-cuando-miente",
      },
      {
        title: "Dólar a $1.100: el análisis que los corredores de bolsa no te van a dar",
        slug: "dolar-1100-analisis",
      },
    ],
  },
};

const defaultArticle: ArticleData = {
  title: "Por qué el peso cae cuando el cobre sube: la paradoja que nadie explica bien",
  dek: "Existe una correlación que todos los analistas conocen pero muy pocos se atreven a cuestionar. Este análisis va al fondo.",
  readingTime: 8,
  date: "12 de mayo de 2025",
  lead: "Hay una pregunta que recibo cada semana de mis suscriptores: si Chile es el mayor productor de cobre del mundo y el precio del metal sube, ¿por qué el peso chileno no se fortalece igual de rápido? La respuesta corta es que sí se fortalece, pero con un rezago que los medios ignoran y que genera oportunidades reales para quienes entienden el mecanismo.",
  body: [
    {
      type: "paragraph",
      text: "El tipo de cambio es, en esencia, el precio relativo de dos economías. Cuando el cobre sube, Codelco y las mineras privadas reciben más dólares por cada tonelada exportada. Esos dólares eventualmente ingresan al sistema financiero chileno y se convierten en pesos, lo que debería apreciar la moneda. Hasta aquí, la teoría.",
    },
    {
      type: "paragraph",
      text: "El problema está en el tiempo. Entre la venta del mineral en los mercados de futuros y la liquidación efectiva de divisas en el mercado chileno pueden pasar entre 30 y 90 días. Durante ese período, el mercado cambiario opera sobre expectativas, no sobre flujos reales.",
    },
    {
      type: "quote",
      text: "El mercado cambiario no responde al precio del cobre de hoy. Responde a lo que los operadores creen que hará el Banco Central en las próximas seis semanas.",
      attribution: "Conversación con un tesorero de banco de primera línea",
    },
    {
      type: "heading",
      text: "El rol del Banco Central que nadie menciona",
    },
    {
      type: "paragraph",
      text: "El Banco Central tiene un mandato implícito de suavizar la volatilidad cambiaria. Cuando el cobre sube de manera brusca, la institución suele intervenir comprando dólares para evitar una apreciación excesiva del peso que dañe la competitividad de exportadores no mineros: forestales, salmones, vino. Esta intervención esteriliza parte del efecto alcista sobre el tipo de cambio.",
    },
    {
      type: "paragraph",
      text: "Lo que los economistas llaman 'enfermedad holandesa' —la apreciación de la moneda que destruye otros sectores exportadores— es el fantasma que el Central siempre tiene en mente cuando el precio del cobre despega.",
    },
    { type: "paywall" },
    {
      type: "heading",
      text: "Las tres ventanas de oportunidad",
    },
    {
      type: "paragraph",
      text: "Para los que sí tienen acceso a este análisis, las implicaciones son concretas. Existe un patrón estadísticamente robusto en el comportamiento del USDCLP en los 45 días posteriores a un rally del cobre mayor al 8% mensual...",
    },
  ],
  relatedArticles: [
    {
      title: "El IPC de marzo y lo que el INE no pone en el titular",
      slug: "ipc-marzo-lo-que-ine-no-pone",
    },
    {
      title: "Tasa de política monetaria: cuándo el Banco Central baja y cuándo miente",
      slug: "tpm-cuando-baja-cuando-miente",
    },
    {
      title: "Dólar a $1.100: el análisis que los corredores de bolsa no te van a dar",
      slug: "dolar-1100-analisis",
    },
  ],
};

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creator: string; post: string }>;
}): Promise<Metadata> {
  const { creator: creatorSlug, post: postSlug } = await params;
  const creator = creatorsData[creatorSlug] ?? defaultCreator;
  const article = articlesData[postSlug] ?? defaultArticle;

  return {
    title: `${article.title} — ${creator.name}`,
    description: article.dek,
  };
}

// ─── Componentes ─────────────────────────────────────────────────────────────

function Nav({ creatorSlug }: { creatorSlug: string }) {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <a
            href="/"
            className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none"
            style={{ letterSpacing: "-0.01em" }}
          >
            SALA
          </a>
          <hr className="nyt-rule w-full" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: "Explorar", href: "/explorar" },
              { label: "Para creadores", href: "/abrir" },
              { label: "Precios", href: "/precios" },
              { label: "Entrar", href: "#" },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE]">·</span>}
                <a
                  href={item.href}
                  className="hover:text-[#121212] transition-colors duration-150"
                >
                  {item.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function CreatorSidebar({
  creator,
}: {
  creator: CreatorInfo;
}) {
  return (
    <aside className="hidden lg:block w-[240px] flex-shrink-0">
      <div className="sticky top-8 border border-[#DEDEDE] p-5">
        {/* Avatar placeholder */}
        <div
          className="w-14 h-14 bg-[#F7F7F7] border border-[#DEDEDE] flex items-center justify-center mb-4"
          aria-hidden="true"
        >
          <span className="font-serif text-[20px] font-bold text-[#121212]">
            {creator.name.charAt(0)}
          </span>
        </div>
        <h3
          className="font-serif text-[16px] font-bold text-[#121212] mb-1 leading-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          {creator.name}
        </h3>
        <span
          className="font-sans text-[10px] font-semibold uppercase tracking-widest mb-3 block"
          style={{ color: "#C41C1C" }}
        >
          {creator.specialty}
        </span>
        <p className="font-sans text-[12px] text-[#666666] leading-relaxed mb-4">
          {creator.bio}
        </p>
        <hr className="nyt-rule mb-4" />
        <p className="font-sans text-[11px] text-[#666666] mb-4">
          {creator.subscribers.toLocaleString("es-CL")} suscriptores
        </p>
        <a
          href={`/${creator.slug}`}
          className="font-sans text-[12px] font-medium px-4 py-2.5 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 block text-center"
        >
          Suscribirse · {creator.price}/mes
        </a>
      </div>
    </aside>
  );
}

function PaywallCard({
  creator,
}: {
  creator: CreatorInfo;
}) {
  return (
    <div className="relative my-8">
      {/* blur overlay del texto anterior */}
      <div
        className="pointer-events-none absolute -top-16 left-0 right-0 h-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))",
        }}
      />
      {/* card paywall */}
      <div className="border border-[#DEDEDE] p-8 text-center bg-[#F7F7F7]">
        <span className="section-label mb-3 inline-block">ACCESO EXCLUSIVO</span>
        <h4
          className="font-serif text-[22px] font-bold text-[#121212] mb-3 leading-[1.1]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Este artículo es exclusivo para suscriptores de {creator.name}
        </h4>
        <p className="font-sans text-[13px] text-[#666666] max-w-sm mx-auto mb-6 leading-relaxed">
          Únete para acceder a este análisis completo y a todos los artículos
          anteriores sin restricciones.
        </p>
        <a
          href={`/${creator.slug}`}
          className="font-sans text-[13px] font-medium px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors duration-150 inline-block"
        >
          Suscribirse · {creator.price}/mes
        </a>
        <p className="font-sans text-[11px] text-[#666666] mt-4">
          Cancela cuando quieras. Sin permanencia.
        </p>
      </div>
    </div>
  );
}

function ArticleBody({
  blocks,
  creator,
}: {
  blocks: ArticleBlock[];
  creator: CreatorInfo;
}) {
  let paywallShown = false;

  return (
    <div className="font-sans text-[18px] text-[#121212] leading-[1.8]">
      {blocks.map((block, i) => {
        if (block.type === "paywall") {
          paywallShown = true;
          return <PaywallCard key={i} creator={creator} />;
        }

        if (paywallShown) {
          // Texto tras el paywall aparece difuminado
          return (
            <div
              key={i}
              className="relative"
              style={{ filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}
              aria-hidden="true"
            >
              {block.type === "paragraph" && (
                <p className="mb-6">{block.text}</p>
              )}
              {block.type === "heading" && (
                <h2
                  className="font-serif text-[24px] font-bold text-[#121212] mt-10 mb-4 leading-[1.15]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {block.text}
                </h2>
              )}
            </div>
          );
        }

        if (block.type === "paragraph") {
          return <p key={i} className="mb-6">{block.text}</p>;
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="my-8 pl-6 border-l-[3px] border-[#C41C1C]"
            >
              <p
                className="font-serif text-[20px] italic text-[#121212] leading-[1.5] mb-2"
                style={{ fontWeight: 400 }}
              >
                &ldquo;{block.text}&rdquo;
              </p>
              {block.attribution && (
                <cite className="font-sans text-[12px] text-[#666666] not-italic">
                  — {block.attribution}
                </cite>
              )}
            </blockquote>
          );
        }

        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="font-serif text-[24px] font-bold text-[#121212] mt-10 mb-4 leading-[1.15]"
              style={{ letterSpacing: "-0.01em" }}
            >
              {block.text}
            </h2>
          );
        }

        return null;
      })}
    </div>
  );
}

function RelatedArticles({
  articles,
  creator,
}: {
  articles: { title: string; slug: string }[];
  creator: CreatorInfo;
}) {
  return (
    <section className="mt-16 border-t-[3px] border-[#121212] pt-6">
      <span className="section-label-dark mb-5 inline-block">
        MÁS DE {creator.name.toUpperCase()}
      </span>
      <ul className="divide-y divide-[#DEDEDE]">
        {articles.map((a, i) => (
          <li key={i} className="py-4">
            <a
              href={`/${creator.slug}/${a.slug}`}
              className="font-serif text-[18px] font-bold text-[#121212] hover:text-[#C41C1C] transition-colors duration-150 leading-tight block"
              style={{ letterSpacing: "-0.01em" }}
            >
              {a.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          SALA · CHILE · 2025
        </span>
        <a
          href="mailto:hello@sala.lat"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          hello@sala.lat
        </a>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: Promise<{ creator: string; post: string }>;
}) {
  const { creator: creatorSlug, post: postSlug } = await params;

  const creator = creatorsData[creatorSlug] ?? defaultCreator;
  const article = articlesData[postSlug] ?? defaultArticle;

  return (
    <>
      <Nav creatorSlug={creatorSlug} />

      <main className="px-6 py-10">
        <div className="max-w-5xl mx-auto flex gap-12 items-start">
          {/* Columna principal */}
          <div className="flex-1 min-w-0">
            {/* Header del artículo */}
            <header className="mb-8">
              <span
                className="font-sans text-[11px] font-semibold uppercase tracking-widest mb-4 block"
                style={{ color: "#C41C1C" }}
              >
                {creator.specialty}
              </span>
              <hr className="nyt-rule mb-5" />
              <h1
                className="font-serif text-[#121212] mb-5 leading-[1.05]"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {article.title}
              </h1>
              <p className="font-sans text-[20px] text-[#666666] leading-[1.4] mb-5">
                {article.dek}
              </p>
              <hr className="nyt-rule mb-4" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[13px] text-[#121212]">
                    Por{" "}
                    <a
                      href={`/${creator.slug}`}
                      className="font-semibold hover:underline underline-offset-2"
                    >
                      {creator.name}
                    </a>
                  </span>
                  <span className="text-[#DEDEDE]">·</span>
                  <span className="font-sans text-[13px] text-[#666666]">
                    {article.date}
                  </span>
                </div>
                <span className="font-sans text-[12px] text-[#666666]">
                  {article.readingTime} minutos de lectura
                </span>
              </div>
              <hr className="nyt-rule mt-4" />
            </header>

            {/* Lead */}
            <p className="font-sans text-[18px] text-[#121212] leading-[1.8] font-semibold mb-6">
              {article.lead}
            </p>

            {/* Cuerpo */}
            <div style={{ maxWidth: "680px" }}>
              <ArticleBody blocks={article.body} creator={creator} />
            </div>

            {/* Artículos relacionados */}
            <div style={{ maxWidth: "680px" }}>
              <RelatedArticles
                articles={article.relatedArticles}
                creator={creator}
              />
            </div>
          </div>

          {/* Sidebar */}
          <CreatorSidebar creator={creator} />
        </div>
      </main>

      <Footer />
    </>
  );
}
