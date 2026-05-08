"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Publication {
  id: string;
  title: string;
  date: string;
  readers: number;
  status: "Publicado" | "Borrador";
}

interface Activity {
  id: string;
  text: string;
  time: string;
  type: "subscribe" | "cancel" | "read";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const publications: Publication[] = [
  {
    id: "1",
    title: "Por qué el tipo de cambio te está mintiendo",
    date: "12 may 2025",
    readers: 621,
    status: "Publicado",
  },
  {
    id: "2",
    title: "El efecto silencioso de la tasa de política monetaria en tu cartera",
    date: "5 may 2025",
    readers: 589,
    status: "Publicado",
  },
  {
    id: "3",
    title: "Tres señales que el mercado inmobiliario no quiere que veas",
    date: "—",
    readers: 0,
    status: "Borrador",
  },
];

const activities: Activity[] = [
  { id: "1", text: "Carmen V. se suscribió", time: "hace 2h", type: "subscribe" },
  { id: "2", text: "Felipe M. canceló su suscripción", time: "hace 1d", type: "cancel" },
  { id: "3", text: "Marcela T. leyó «El tipo de cambio»", time: "hace 1d", type: "read" },
  { id: "4", text: "Jorge P. se suscribió", time: "hace 2d", type: "subscribe" },
  { id: "5", text: "Andrea L. leyó «La tasa de política monetaria»", time: "hace 2d", type: "read" },
  { id: "6", text: "Roberto S. se suscribió", time: "hace 3d", type: "subscribe" },
];

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { icon: "◆", label: "Inicio", href: "/dashboard", active: true },
  { icon: "✦", label: "Publicaciones", href: "/dashboard/publicaciones", active: false },
  { icon: "◉", label: "Suscriptores", href: "/dashboard/suscriptores", active: false },
  { icon: "$", label: "Ingresos", href: "/dashboard/ingresos", active: false },
  { icon: "⚙", label: "Configuración", href: "/dashboard/configuracion", active: false },
];

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  value,
  label,
  sub,
  prefix,
}: {
  value: string;
  label: string;
  sub: string;
  prefix?: string;
}) {
  return (
    <div className="bg-white border border-[#DEDEDE] p-6 flex flex-col gap-1">
      <span
        className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-sans font-medium"
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-1">
        {prefix && (
          <span
            className="text-lg font-serif text-[#121212]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {prefix}
          </span>
        )}
        <span
          className="text-[2.25rem] leading-none font-bold text-[#121212] tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {value}
        </span>
      </div>
      <span
        className="text-[13px] text-[#666666] font-sans mt-1"
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {sub}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Inicio");

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F7F7F7]"
      style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
    >
      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-[#DEDEDE] flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#DEDEDE]">
          <span
            className="text-[15px] font-bold tracking-[0.18em] text-[#121212] uppercase"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            SALA
          </span>
        </div>

        {/* Creator info */}
        <div className="px-5 py-5 border-b border-[#DEDEDE]">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#121212] flex items-center justify-center mb-3">
            <span
              className="text-white text-[13px] font-medium"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              RF
            </span>
          </div>
          <p
            className="text-[13px] font-semibold text-[#121212] leading-snug"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Rodrigo Fuentes
          </p>
          <a
            href="/rodrigo-fuentes"
            className="text-[12px] text-[#C41C1C] hover:underline mt-0.5 inline-block"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Ver mi sala →
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3">
          {navItems.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-[#F7F7F7] text-[#121212]"
                    : "text-[#666666] hover:text-[#121212] hover:bg-[#F7F7F7]"
                }`}
              >
                <span className="text-[11px] w-3.5 flex-shrink-0 text-center leading-none">
                  {item.icon}
                </span>
                <span
                  className={`text-[13px] ${isActive ? "font-semibold text-[#121212]" : "font-normal"}`}
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="ml-auto w-1 h-4 bg-[#C41C1C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Plan status */}
        <div className="px-5 py-4 border-t border-[#DEDEDE]">
          <p
            className="text-[11px] text-[#666666] font-medium"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Plan Libre · 10% comisión
          </p>
          <button
            className="mt-1.5 text-[12px] text-[#C41C1C] font-medium hover:underline"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Actualizar plan
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between">
          <div>
            <h1
              className="text-[22px] font-bold text-[#121212] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Panel del creador
            </h1>
            <p
              className="text-[13px] text-[#666666] mt-0.5"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              Jueves, 8 de mayo de 2025
            </p>
          </div>
          <Link
            href="/dashboard/nueva-publicacion"
            className="inline-flex items-center gap-2 bg-[#121212] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Nueva publicación →
          </Link>
        </div>

        <div className="px-8 py-7 space-y-8">
          {/* ── Metrics row ── */}
          <section>
            <div className="grid grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
              <MetricCard
                label="Suscriptores activos"
                value="847"
                sub="↑ 23 este mes"
              />
              <MetricCard
                label="Ganados este mes"
                value="898.353"
                prefix="$"
                sub="CLP · mayo 2025"
              />
              <MetricCard
                label="Publicaciones totales"
                value="12"
                sub="2 borradores"
              />
              <MetricCard
                label="Tasa de retención"
                value="94%"
                sub="Últimos 30 días"
              />
            </div>
          </section>

          {/* ── Two-column lower section ── */}
          <div className="grid grid-cols-3 gap-6">
            {/* Publicaciones recientes */}
            <section className="col-span-2 bg-white border border-[#DEDEDE]">
              <div className="px-6 py-4 border-b border-[#DEDEDE] flex items-center justify-between">
                <h2
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  Publicaciones recientes
                </h2>
                <button
                  className="text-[12px] text-[#C41C1C] hover:underline font-medium"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  Ver todas →
                </button>
              </div>

              {/* Table header */}
              <div
                className="grid px-6 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]"
                style={{ gridTemplateColumns: "1fr 90px 90px 80px" }}
              >
                {["Título", "Fecha", "Lectores", "Estado"].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] uppercase tracking-[0.1em] text-[#666666] font-medium"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {publications.map((pub, i) => (
                <div
                  key={pub.id}
                  className={`grid px-6 py-4 items-center ${
                    i !== publications.length - 1 ? "border-b border-[#DEDEDE]" : ""
                  } hover:bg-[#F7F7F7] transition-colors`}
                  style={{ gridTemplateColumns: "1fr 90px 90px 80px" }}
                >
                  <span
                    className="text-[14px] text-[#121212] font-medium leading-snug pr-4 line-clamp-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {pub.title}
                  </span>
                  <span
                    className="text-[13px] text-[#666666]"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {pub.date}
                  </span>
                  <span
                    className="text-[13px] text-[#121212] font-medium"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {pub.status === "Publicado" ? pub.readers.toLocaleString("es-CL") : "—"}
                  </span>
                  <span
                    className={`inline-flex text-[11px] font-medium px-2 py-0.5 w-fit tracking-wide uppercase ${
                      pub.status === "Publicado"
                        ? "bg-[#121212] text-white"
                        : "bg-[#DEDEDE] text-[#666666]"
                    }`}
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {pub.status}
                  </span>
                </div>
              ))}
            </section>

            {/* Actividad reciente */}
            <section className="col-span-1 bg-white border border-[#DEDEDE]">
              <div className="px-5 py-4 border-b border-[#DEDEDE]">
                <h2
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  Actividad reciente
                </h2>
              </div>
              <ul className="divide-y divide-[#DEDEDE]">
                {activities.map((act) => (
                  <li key={act.id} className="px-5 py-3.5 flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        act.type === "subscribe"
                          ? "bg-[#121212]"
                          : act.type === "cancel"
                          ? "bg-[#C41C1C]"
                          : "bg-[#DEDEDE]"
                      }`}
                    />
                    <div>
                      <p
                        className="text-[13px] text-[#121212] leading-snug"
                        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                      >
                        {act.text}
                      </p>
                      <p
                        className="text-[11px] text-[#666666] mt-0.5"
                        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                      >
                        {act.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── CTA ── */}
          <section className="bg-white border border-[#DEDEDE] px-8 py-7 flex items-center justify-between">
            <div>
              <h3
                className="text-[18px] font-bold text-[#121212]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Tus suscriptores esperan tu próximo análisis
              </h3>
              <p
                className="text-[13px] text-[#666666] mt-1"
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                Llevas 6 días sin publicar. El jueves es tu día habitual.
              </p>
            </div>
            <Link
              href="/dashboard/nueva-publicacion"
              className="inline-flex items-center gap-2 bg-[#C41C1C] text-white text-[13px] font-semibold px-5 py-3 hover:bg-[#a01515] transition-colors flex-shrink-0"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              Nueva publicación →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
