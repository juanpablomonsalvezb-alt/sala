"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// ─── Scroll hook ──────────────────────────────────────────────────────────────

function useScrolled(threshold = 20) {
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
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]"
          : "bg-white border-b border-[#E5E7EB]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo + badge */}
        <div className="flex items-center gap-2.5">
          <a
            href="#"
            className="font-bold text-[18px] text-[#0A0A0A] tracking-tight leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            Sala
          </a>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE]">
            Beta
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {["Explorar", "Para creadores", "Precios"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] font-medium text-[#6B7280] hover:text-[#0A0A0A] transition-colors duration-150"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1 text-[13px] font-medium px-3.5 py-2 rounded-md border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-150"
          >
            Entrar →
          </a>
          <a
            href="#"
            className="inline-flex items-center text-[13px] font-semibold px-3.5 py-2 rounded-md bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all duration-150"
          >
            Publicar en Sala
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-32 pb-24 flex flex-col items-center text-center px-6">
      <div className="max-w-3xl mx-auto">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white"
        >
          <span className="text-[#6B7280] text-[12px] font-medium">
            ✦ Plataforma de conocimiento profesional
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[#0A0A0A] font-extrabold leading-[1.1] mb-5"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            letterSpacing: "-0.02em",
          }}
        >
          El lugar donde tu conocimiento
          <br />
          encuentra su valor.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[#6B7280] text-[17px] font-normal leading-relaxed max-w-[520px] mx-auto mb-10"
        >
          Profesionales de Chile y el mundo publican lo que saben.
          Sus mejores lectores pagan por ello.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5"
        >
          <a
            href="#explorar"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium px-5 py-2.5 rounded-md border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-150"
          >
            Explorar salas
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold px-5 py-2.5 rounded-md bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all duration-150"
          >
            Abre la tuya →
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[#6B7280] text-[12px] mb-12"
        >
          Gratis para empezar · Sin tarjeta de crédito
        </motion.p>

        {/* Stats */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {[
            { label: "34 creadores activos" },
            { label: "2.400+ suscriptores" },
            { label: "$180K generados" },
          ].map((stat, i) => (
            <span key={i} className="flex items-center gap-2 text-[13px] text-[#6B7280]">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />}
              {stat.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Creator card ─────────────────────────────────────────────────────────────

const creators = [
  {
    initial: "R",
    name: "Rodrigo Fuentes",
    role: "Economista",
    bio: "Análisis semanal del mercado chileno para entender qué está pasando realmente.",
    price: "$9.990/mes",
    subscribers: "847 suscriptores",
  },
  {
    initial: "I",
    name: "Isabel Contreras",
    role: "Abogada tributaria",
    bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más.",
    price: "$12.990/mes",
    subscribers: "523 suscriptores",
  },
  {
    initial: "M",
    name: "Marco Salinas",
    role: "Arquitecto",
    bio: "Arquitectura latinoamericana que no sale en los libros de texto.",
    price: "$7.990/mes",
    subscribers: "312 suscriptores",
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
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className="group bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition-all duration-200 cursor-default"
    >
      {/* Header */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
          <span className="text-[#0066FF] font-bold text-[15px]">
            {creator.initial}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#0A0A0A] text-[14px] leading-snug" style={{ letterSpacing: "-0.01em" }}>
            {creator.name}
          </div>
          <div className="text-[12px] text-[#6B7280] mt-0.5">{creator.role}</div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
        {creator.bio}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#0066FF]">
            {creator.price}
          </span>
          <span className="text-[12px] text-[#6B7280]">{creator.subscribers}</span>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#6B7280] hover:text-[#0A0A0A] transition-colors duration-150 group/link"
        >
          Ver sala
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
}

function FeaturedCreators() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="explorar" className="py-24 px-6 bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-10">
          <motion.h2
            custom={0}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-[#0A0A0A] font-semibold text-[22px] mb-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            Salas destacadas
          </motion.h2>
          <motion.p
            custom={1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-[#6B7280] text-[13px]"
          >
            Profesionales que ya cobran por su conocimiento
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {creators.map((creator, i) => (
            <CreatorCard key={creator.name} creator={creator} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  {
    icon: ArrowUpRight,
    title: "Abre tu sala",
    description:
      "Configura tu perfil y precio en 15 minutos. Sin código, sin diseñador.",
  },
  {
    icon: TrendingUp,
    title: "Publica lo que sabes",
    description:
      "Artículos, análisis, reflexiones. Sin algoritmo que dicte qué ni cuándo.",
  },
  {
    icon: DollarSign,
    title: "Cobra mes a mes",
    description: "Tus suscriptores pagan. Tú recibes directo a tu cuenta.",
  },
];

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6 bg-white border-y border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 max-w-lg">
          <motion.h2
            custom={0}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-[#0A0A0A] font-bold text-[22px] mb-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            Cómo funciona
          </motion.h2>
          <motion.p
            custom={1}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-[#6B7280] text-[13px]"
          >
            Tres pasos para monetizar lo que ya sabes.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const stepRef = useRef(null);
            const stepInView = useInView(stepRef, { once: true, margin: "-40px" });

            return (
              <motion.div
                key={step.title}
                ref={stepRef}
                custom={i}
                initial="hidden"
                animate={stepInView ? "visible" : "hidden"}
                variants={fadeUp}
              >
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-[#0066FF]" />
                </div>
                <h3
                  className="text-[#0A0A0A] font-semibold text-[15px] mb-2"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-[13px] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Manifesto ────────────────────────────────────────────────────────────────

function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-28 px-6 bg-white border-t border-b border-[#E5E7EB] text-center"
    >
      <div className="max-w-2xl mx-auto">
        <motion.p
          custom={0}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-[#0A0A0A] font-medium text-[18px] leading-relaxed mb-8"
        >
          Durante años regalaste tu conocimiento.
          <br />
          <span className="text-[#6B7280]">Sala existe para que eso cambie.</span>
        </motion.p>
        <motion.div
          custom={1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors duration-150"
          >
            Abre tu sala hoy →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-8 px-6 bg-[#F8F8F8] border-t border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span
          className="font-bold text-[16px] text-[#0A0A0A]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Sala
        </span>
        <p className="text-[12px] text-[#6B7280]">
          Sala · Chile · 2025 ·{" "}
          <a
            href="mailto:hello@sala.lat"
            className="hover:text-[#0A0A0A] transition-colors duration-150"
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
