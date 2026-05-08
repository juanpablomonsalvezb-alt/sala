import Link from "next/link";

const benefits = [
  {
    roman: "I.",
    title: "Tu sala propia",
    desc: "Un espacio con tu nombre y tu voz. Sin algoritmos que decidan si mereces audiencia.",
  },
  {
    roman: "II.",
    title: "Tus suscriptores",
    desc: "Personas que pagan porque valoran lo que dices. Una relación directa, sin intermediarios.",
  },
  {
    roman: "III.",
    title: "Tu ingreso",
    desc: "Dinero que llega mes a mes sin depender de un algoritmo, de una empresa ni de la viralidad.",
  },
];

const testimonials = [
  {
    quote:
      "Sala me hizo entender que mis análisis macroeconómicos tenían un precio real. En tres meses pasé de escribir gratis a generar un ingreso mensual estable.",
    name: "Camila Rojas",
    specialty: "Economista · Santiago",
    income: "$1.2M CLP/mes",
  },
  {
    quote:
      "Tenía 4.000 seguidores en LinkedIn que leían todo lo que publicaba pero yo no cobraba nada. Sala cambió esa ecuación en quince minutos.",
    name: "Felipe Vargas",
    specialty: "Abogado tributarista · Bogotá",
    income: "$890.000 CLP/mes",
  },
  {
    quote:
      "Lo que publico en Sala es lo que no puedo decir en medios tradicionales. Mis lectores pagan precisamente por eso: la versión sin filtros.",
    name: "Valentina Ibáñez",
    specialty: "Periodista · Ciudad de México",
    income: "$1.5M CLP/mes",
  },
];

function Nav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <Link
            href="/"
            className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none"
            style={{ letterSpacing: "-0.01em" }}
          >
            SALA
          </Link>
          <hr className="nyt-rule w-full" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: "Explorar", href: "/explorar" },
              { label: "Para creadores", href: "/para-creadores" },
              { label: "Precios", href: "/precios" },
              { label: "Entrar", href: "/entrar" },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE]">·</span>}
                <Link
                  href={item.href}
                  className="hover:text-[#121212] transition-colors duration-150"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
      <hr className="nyt-rule" />
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
      <span className="section-label mb-4 inline-block">PARA CREADORES</span>
      <hr className="nyt-rule mb-10" />
      <h1
        className="font-serif text-[#121212] mb-8 leading-[1.06]"
        style={{
          fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
          fontWeight: 800,
          letterSpacing: "-0.01em",
        }}
      >
        Tienes conocimiento que vale. Sala te ayuda a cobrarlo.
      </h1>
      <p className="font-sans text-[18px] text-[#666666] leading-relaxed max-w-xl mx-auto mb-10">
        Miles de profesionales en Chile y LATAM comparten lo que saben gratis.
        Sala existe para cambiar eso.
      </p>
      <Link
        href="/abrir"
        className="inline-block font-sans text-[13px] font-medium px-8 py-3.5 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150"
      >
        Abrir mi sala gratis →
      </Link>
    </section>
  );
}

function ElProblema() {
  return (
    <section className="border-t border-[#DEDEDE] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">EL PROBLEMA</span>
          <hr className="nyt-rule" />
        </div>
        {/* Two-column newspaper layout */}
        <div className="md:columns-2 gap-10 max-w-4xl">
          <p className="font-sans text-[16px] text-[#121212] leading-[1.8] mb-5">
            Llevas años publicando análisis en LinkedIn. Escribes hilos en
            Twitter. Mandas correos a tus contactos. Todo gratis.
          </p>
          <p className="font-sans text-[16px] text-[#121212] leading-[1.8] mb-5">
            Mientras tanto, tus lectores más comprometidos pagarían por más
            profundidad, más contexto, más de ti. Lo que publicas gratis en
            redes es apenas el 20% de lo que realmente sabes.
          </p>
          <p className="font-sans text-[16px] text-[#121212] leading-[1.8]">
            El problema no es tu contenido. El problema es que nunca tuviste
            una infraestructura para cobrarlo. Eso es lo que hace Sala.
          </p>
        </div>
      </div>
    </section>
  );
}

function LaSolucion() {
  return (
    <section className="border-t border-[#DEDEDE] py-14 px-6 bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">LA SOLUCIÓN</span>
          <hr className="nyt-rule" />
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:divide-x md:divide-[#DEDEDE]">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`py-6 ${i > 0 ? "md:pl-8" : ""} ${i < benefits.length - 1 ? "md:pr-8" : ""} border-b md:border-b-0 border-[#DEDEDE] last:border-b-0`}
            >
              <span
                className="font-serif text-[32px] font-bold text-[#DEDEDE] leading-none mb-3 block"
                aria-hidden="true"
              >
                {b.roman}
              </span>
              <h3
                className="font-serif text-[18px] font-bold text-[#121212] mb-2"
                style={{ letterSpacing: "-0.01em" }}
              >
                {b.title}
              </h3>
              <p className="font-sans text-[13px] text-[#666666] leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LosNumeros() {
  return (
    <section className="border-t border-[#DEDEDE] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">LOS NÚMEROS</span>
          <hr className="nyt-rule" />
        </div>
        <div className="max-w-3xl">
          <p
            className="font-serif text-[#121212] leading-tight mb-5"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Con 100 suscriptores a $9.990/mes
            <br />
            <span className="text-[#C41C1C]">→ $998.000 CLP/mes.</span>
          </p>
          <hr className="nyt-rule mb-5" />
          <div className="grid sm:grid-cols-3 gap-0 sm:divide-x sm:divide-[#DEDEDE]">
            <div className="py-4 sm:pr-6 border-b sm:border-b-0 border-[#DEDEDE]">
              <p className="font-serif text-[28px] font-bold text-[#121212] leading-none mb-1">
                50
              </p>
              <p className="font-sans text-[12px] text-[#666666] uppercase tracking-wide">
                suscriptores → $499.500/mes
              </p>
            </div>
            <div className="py-4 sm:px-6 border-b sm:border-b-0 border-[#DEDEDE]">
              <p className="font-serif text-[28px] font-bold text-[#121212] leading-none mb-1">
                200
              </p>
              <p className="font-sans text-[12px] text-[#666666] uppercase tracking-wide">
                suscriptores → $1.998.000/mes
              </p>
            </div>
            <div className="py-4 sm:pl-6">
              <p className="font-serif text-[28px] font-bold text-[#121212] leading-none mb-1">
                500
              </p>
              <p className="font-sans text-[12px] text-[#666666] uppercase tracking-wide">
                suscriptores → $4.995.000/mes
              </p>
            </div>
          </div>
          <hr className="nyt-rule mt-0" />
          <p className="font-sans text-[12px] text-[#666666] mt-4">
            Basado en precio referencial de $9.990 CLP/mes. Tú eliges tu precio.
          </p>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-t border-[#DEDEDE] py-14 px-6 bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">
            CREADORES QUE YA ABRIERON SU SALA
          </span>
          <hr className="nyt-rule" />
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:divide-x md:divide-[#DEDEDE]">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              className={`py-6 ${i > 0 ? "md:pl-6" : ""} ${i < testimonials.length - 1 ? "md:pr-6" : ""} border-b md:border-b-0 border-[#DEDEDE] last:border-b-0`}
            >
              <p
                className="font-serif text-[16px] italic text-[#121212] leading-relaxed mb-5"
                style={{ fontWeight: 400 }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <hr className="nyt-rule mb-4" />
              <p className="font-sans text-[12px] font-semibold text-[#121212] mb-0.5">
                {t.name}
              </p>
              <p className="font-sans text-[11px] text-[#666666] mb-1">
                {t.specialty}
              </p>
              <p className="font-sans text-[11px] font-semibold text-[#C41C1C] uppercase tracking-wide">
                {t.income}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section className="border-t border-[#DEDEDE] py-20 px-6 bg-[#F7F7F7] text-center">
      <div className="max-w-xl mx-auto">
        <h2
          className="font-serif text-[#121212] italic mb-8 leading-tight"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.25rem)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          ¿Listo para abrir tu sala?
        </h2>
        <hr className="nyt-rule mb-8" />
        <Link
          href="/abrir"
          className="inline-block font-sans text-[14px] font-medium px-10 py-4 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 mb-5"
        >
          Empezar gratis →
        </Link>
        <p className="font-sans text-[12px] text-[#666666]">
          Tarda 15 minutos. Sin tarjeta de crédito.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          SALA · CHILE · 2025
        </span>
        <Link
          href="mailto:hello@sala.lat"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          hello@sala.lat
        </Link>
      </div>
    </footer>
  );
}

export default function ParaCreadoresPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ElProblema />
        <LaSolucion />
        <LosNumeros />
        <Testimonials />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
