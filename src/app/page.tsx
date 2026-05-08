"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, TrendingUp, BookOpen, ChevronRight } from "lucide-react";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

// ─── Hook: detectar scroll ────────────────────────────────────────────────────

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const scrolled = useScrolled();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/[0.05]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-serif text-[26px] italic text-[#C9A96E] tracking-tight hover:text-[#E0C896] transition-colors duration-200 leading-none"
        >
          Sala
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-9">
          {["Explorar", "Para creadores", "Precios"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-sans text-[13px] text-[#F5F0E8]/55 hover:text-[#F5F0E8] transition-colors duration-200 tracking-wide"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden md:inline-flex font-sans text-[13px] px-4 py-[9px] rounded border border-[#F5F0E8]/18 text-[#F5F0E8]/75 hover:border-[#F5F0E8]/35 hover:text-[#F5F0E8] transition-all duration-200"
          >
            Entrar
          </a>
          <a
            href="#"
            className="inline-flex font-sans text-[13px] px-4 py-[9px] rounded bg-[#C9A96E] text-[#0A0A0A] font-semibold hover:bg-[#E0C896] transition-all duration-200 shadow-[0_4px_20px_rgba(201,169,110,0.18)]"
          >
            Publicar en Sala
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero stat badge ──────────────────────────────────────────────────────────

function StatBadge({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#111111] border border-white/[0.07]"
    >
      <Icon className="w-3.5 h-3.5 text-[#C9A96E] flex-shrink-0" />
      <span className="font-sans text-[12px] text-[#F5F0E8]/80 whitespace-nowrap">
        <span className="font-semibold text-[#C9A96E]">{value}</span>{" "}
        {label}
      </span>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -48]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 72% 65% at 50% 48%, #1c1509 0%, #0A0A0A 68%)",
        }}
      />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F5F0E8 1px, transparent 1px), linear-gradient(to bottom, #F5F0E8 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 pt-32 pb-20 flex flex-col items-center text-center"
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-11 flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C9A96E]/22 bg-[#C9A96E]/[0.06]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
          <span className="font-sans text-[11px] text-[#C9A96E] tracking-[0.14em] uppercase font-medium">
            Plataforma de conocimiento profesional
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif font-normal leading-[1.08] tracking-[-0.025em] text-[#F5F0E8] mb-8"
          style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
        >
          Tu conocimiento
          <br />
          <em className="text-[#C9A96E] not-italic font-normal italic">
            merece una sala
          </em>
          <br />
          propia.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-sans text-[18px] md:text-[20px] text-[#F5F0E8]/62 max-w-[540px] leading-relaxed mb-12 font-light"
        >
          El lugar donde los profesionales de Chile y el mundo comparten lo
          que saben —&nbsp;y cobran por ello.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-3.5 mb-14"
        >
          <a
            href="#explorar"
            className="group inline-flex items-center gap-2 font-sans text-[14px] px-6 py-3.5 rounded border border-[#F5F0E8]/22 text-[#F5F0E8]/85 hover:border-[#F5F0E8]/45 hover:bg-white/[0.025] transition-all duration-200"
          >
            Explorar salas
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-sans text-[14px] px-7 py-3.5 rounded bg-[#C9A96E] text-[#0A0A0A] font-semibold hover:bg-[#E0C896] transition-all duration-200 shadow-[0_6px_28px_rgba(201,169,110,0.22)]"
          >
            Abre tu sala
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <StatBadge icon={Users} value="2.400+" label="suscriptores" delay={0.72} />
          <StatBadge icon={TrendingUp} value="$180K" label="generados" delay={0.85} />
          <StatBadge icon={BookOpen} value="34" label="creadores" delay={0.98} />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#F5F0E8]/22">
          Desplaza
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-9 bg-gradient-to-b from-[#C9A96E]/35 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Creator card ─────────────────────────────────────────────────────────────

const creators = [
  {
    initial: "R",
    name: "Rodrigo Fuentes",
    role: "Economista",
    bio: "Análisis semanal de lo que realmente mueve el mercado chileno.",
    price: "$9.990 CLP/mes",
    subscribers: "847 suscriptores",
    avatarBg: "linear-gradient(135deg, #2a1c08, #1a1208)",
  },
  {
    initial: "I",
    name: "Isabel Contreras",
    role: "Abogada tributaria",
    bio: "Todo lo que el SII no te explica, pero deberías saber.",
    price: "$12.990 CLP/mes",
    subscribers: "523 suscriptores",
    avatarBg: "linear-gradient(135deg, #0e1828, #090e18)",
  },
  {
    initial: "M",
    name: "Marco Salinas",
    role: "Arquitecto",
    bio: "Arquitectura latinoamericana que no sale en los libros.",
    price: "$7.990 CLP/mes",
    subscribers: "312 suscriptores",
    avatarBg: "linear-gradient(135deg, #132010, #0c150a)",
  },
];

function CreatorCard({
  creator,
  index,
}: {
  creator: (typeof creators)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className="group flex flex-col sm:flex-row gap-6 p-7 lg:p-8 rounded-lg border border-white/[0.055] bg-[#0d0d0d] hover:border-[#C9A96E]/18 hover:bg-[#0f0e0c] transition-all duration-300 cursor-default"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center border border-[#C9A96E]/18"
          style={{ background: creator.avatarBg }}
        >
          <span className="font-serif text-xl text-[#C9A96E] font-normal">
            {creator.initial}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div>
            <h3 className="font-serif text-[19px] text-[#F5F0E8] mb-1 group-hover:text-[#EDE5D4] transition-colors duration-200 font-normal">
              {creator.name}
            </h3>
            <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#C9A96E] font-medium">
              {creator.role}
            </span>
          </div>
          <div className="sm:text-right flex-shrink-0">
            <div className="font-sans text-[13px] font-semibold text-[#F5F0E8]">
              {creator.price}
            </div>
            <div className="font-sans text-[11px] text-[#F5F0E8]/35 mt-0.5">
              {creator.subscribers}
            </div>
          </div>
        </div>

        <p className="font-sans text-[13px] text-[#F5F0E8]/50 leading-relaxed mb-5">
          {creator.bio}
        </p>

        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-sans text-[12px] text-[#C9A96E] hover:text-[#E0C896] transition-colors duration-200 group/link"
        >
          Ver sala
          <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  );
}

function FeaturedCreators() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <section id="explorar" className="py-28 lg:py-36">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="mb-14">
          <motion.p
            custom={0}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#C9A96E] mb-5 font-medium"
          >
            Salas destacadas
          </motion.p>
          <motion.h2
            custom={1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="font-serif text-[2.6rem] md:text-[3.25rem] text-[#F5F0E8] leading-[1.15] font-normal"
          >
            Voces que vale
            <br />
            <em className="italic text-[#C9A96E]">la pena escuchar.</em>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3.5">
          {creators.map((creator, i) => (
            <CreatorCard key={creator.name} creator={creator} index={i} />
          ))}
        </div>

        {/* Ver todas */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-2 font-sans text-[13px] text-[#F5F0E8]/40 hover:text-[#C9A96E] transition-colors duration-200"
          >
            Ver todas las salas
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Abre tu sala",
    description:
      "Configuras tu perfil y precio en 15 minutos. Sin código. Sin diseñador. Sin fricción.",
  },
  {
    number: "02",
    title: "Publica lo que sabes",
    description:
      "Artículos, análisis, videos. Sin algoritmo que te dicte qué publicar ni cuándo.",
  },
  {
    number: "03",
    title: "Cobra mes a mes",
    description:
      "Tus suscriptores pagan. Tú recibes. Directo a tu cuenta. Siempre.",
  },
];

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <section className="py-28 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-20">
          <motion.p
            custom={0}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#C9A96E] mb-5 font-medium"
          >
            Así funciona
          </motion.p>
          <motion.h2
            custom={1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="font-serif text-[2.6rem] md:text-[3.25rem] text-[#F5F0E8] leading-[1.15] font-normal"
          >
            Simple por diseño.
            <br />
            <em className="italic text-[#F5F0E8]/40">Poderoso por dentro.</em>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-14 md:gap-10">
          {steps.map((step, i) => {
            const stepRef = useRef(null);
            const stepInView = useInView(stepRef, { once: true, margin: "-50px" });

            return (
              <motion.div
                key={step.number}
                ref={stepRef}
                custom={i}
                initial="hidden"
                animate={stepInView ? "visible" : "hidden"}
                variants={fadeUp}
                className="relative"
              >
                {/* Connector line desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+0.75rem)] w-[calc(100%-1.5rem)] h-px bg-gradient-to-r from-[#C9A96E]/15 to-transparent" />
                )}

                <div
                  className="font-serif text-[72px] leading-none font-normal mb-6 select-none"
                  style={{ color: "rgba(201,169,110,0.12)" }}
                >
                  {step.number}
                </div>
                <h3 className="font-serif text-[21px] text-[#F5F0E8] mb-3 font-normal">
                  {step.title}
                </h3>
                <p className="font-sans text-[13px] text-[#F5F0E8]/45 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 flex justify-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2.5 font-sans text-[14px] px-8 py-4 rounded bg-[#C9A96E] text-[#0A0A0A] font-semibold hover:bg-[#E0C896] transition-all duration-200 shadow-[0_6px_28px_rgba(201,169,110,0.22)]"
          >
            Abre tu sala gratis
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Manifesto ────────────────────────────────────────────────────────────────

function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });

  return (
    <section
      ref={ref}
      className="relative py-36 lg:py-52 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 85% 75% at 50% 50%, #191208 0%, #0A0A0A 72%)",
      }}
    >
      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/18 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/18 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        {/* Ornamento superior */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 h-px bg-[#C9A96E] mx-auto mb-10"
        />

        <motion.p
          custom={0}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#C9A96E]/60 mb-12 font-medium"
        >
          Manifiesto
        </motion.p>

        <motion.h2
          custom={1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="font-serif text-[2.4rem] md:text-[3.2rem] lg:text-[4rem] text-[#F5F0E8] leading-[1.2] font-normal mb-8"
        >
          El conocimiento profesional
          <br />
          <em className="italic text-[#C9A96E]">tiene valor.</em>
        </motion.h2>

        <motion.div
          custom={2}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="space-y-1.5"
        >
          <p className="font-serif text-[1.3rem] md:text-[1.5rem] text-[#F5F0E8]/42 italic font-normal">
            Durante años lo regalaste.
          </p>
          <p className="font-serif text-[1.3rem] md:text-[1.5rem] text-[#F5F0E8] italic font-normal">
            Sala existe para que eso cambie.
          </p>
        </motion.div>

        {/* Ornamento inferior */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 h-px bg-[#C9A96E]/35 mx-auto mt-12"
        />
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-9">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href="#"
          className="font-serif text-[22px] italic text-[#C9A96E]/75 hover:text-[#C9A96E] transition-colors duration-200 leading-none"
        >
          Sala
        </a>
        <p className="font-sans text-[12px] text-[#F5F0E8]/28 text-center sm:text-right">
          Sala © 2025 &middot; Chile &middot;{" "}
          <a
            href="mailto:hello@sala.lat"
            className="hover:text-[#C9A96E] transition-colors duration-200"
          >
            hello@sala.lat
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeaturedCreators />
        <HowItWorks />
        <Manifesto />
      </main>
      <Footer />
    </>
  );
}
