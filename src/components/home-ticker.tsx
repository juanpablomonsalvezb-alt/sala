"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const tickerItems = [
  "Rodrigo F. generó $510.000 en su primer trimestre",
  "Isabel C. alcanzó 500 suscriptores pagando",
  "Marco S. publicó su análisis semanal con 312 lectores",
  "Lucía M. lanzó su sala de finanzas hace 30 días",
  "34 creadores activos · 2.418 suscriptores · $180K generados",
];

export function HomeTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % tickerItems.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111] text-white h-8 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-6">
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Nebbuler</span>
          <span className="text-white/20">·</span>
          <span className="text-[9px] uppercase tracking-[0.12em] text-white/40 capitalize">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end sm:justify-center">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B31C1C] shrink-0">EN VIVO</span>
          <div
            className="text-[10px] text-white/70 truncate transition-all duration-400"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-4px)",
            }}
          >
            {tickerItems[idx]}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link
            href="/registro"
            className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors"
          >
            Únete →
          </Link>
        </div>
      </div>
    </div>
  );
}
