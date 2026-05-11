"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const TARIFA_NEBBULER = 29990;

const PRECIOS_RAPIDOS: number[] = [4990, 7990, 14990, 24990];

function formatCLP(n: number): string {
  return n.toLocaleString("es-CL");
}

export function PricingCalculator() {
  const [subs, setSubs] = useState<number>(200);
  const [precio, setPrecio] = useState<number>(14990);

  const ingresoBruto = subs * precio;
  const ingresoNeto = Math.max(0, ingresoBruto - TARIFA_NEBBULER);
  const ingresoConComision = Math.round(ingresoBruto * 0.9);
  const diferencia = ingresoNeto - ingresoConComision;

  const sliderPct = ((subs - 50) / (2000 - 50)) * 100;
  const maxBar = Math.max(ingresoNeto, ingresoConComision, 1);

  return (
    <div className="bg-white border border-[#EEEEEE] p-8 md:p-10">
      {/* Header */}
      <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#999] mb-2">
        Calcula tu ingreso
      </p>

      {/* Output principal */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={ingresoNeto}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="font-serif text-[48px] md:text-[64px] font-bold text-[#C41C1C] leading-none"
          >
            ${formatCLP(ingresoNeto)}
          </motion.p>
        </AnimatePresence>
        <p className="font-sans text-[13px] text-[#999] mt-1">
          neto mensual · {subs} suscriptores
        </p>
      </div>

      {/* Selector de precio */}
      <div className="mb-6">
        <p className="font-sans text-[11px] text-[#666] mb-3">Precio por suscriptor</p>
        <div className="flex gap-2 flex-wrap">
          {PRECIOS_RAPIDOS.map((p) => (
            <button
              key={p}
              onClick={() => setPrecio(p)}
              className={`px-4 py-2 font-sans text-[13px] font-bold border transition-colors ${
                precio === p
                  ? "bg-[#C41C1C] text-white border-[#C41C1C]"
                  : "bg-white text-[#444] border-[#DEDEDE] hover:border-[#C41C1C]"
              }`}
            >
              ${formatCLP(p)}/mes
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <p className="font-sans text-[11px] text-[#666]">Suscriptores</p>
          <p className="font-sans text-[13px] font-bold text-[#121212]">{subs}</p>
        </div>
        <input
          type="range"
          min={50}
          max={2000}
          step={10}
          value={subs}
          onChange={(e) => setSubs(Number(e.target.value))}
          className="w-full h-1 appearance-none cursor-pointer pricing-slider"
          style={{
            background: `linear-gradient(to right, #C41C1C ${sliderPct}%, #E5E5E5 ${sliderPct}%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="font-sans text-[10px] text-[#BBBBBB]">50</span>
          <span className="font-sans text-[10px] text-[#BBBBBB]">2.000</span>
        </div>
      </div>

      {/* Comparativa */}
      <div className="border-t border-[#F0F0F0] pt-6">
        <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999] mb-4">
          Nebbuler vs plataforma con comisión
        </p>
        <div className="space-y-3">
          {/* Nebbuler */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-sans text-[12px] text-[#121212] font-bold">Nebbuler</span>
              <span className="font-sans text-[12px] text-[#C41C1C] font-bold">
                ${formatCLP(ingresoNeto)}
              </span>
            </div>
            <div className="h-2 bg-[#F0F0F0] overflow-hidden">
              <motion.div
                className="h-full bg-[#C41C1C]"
                animate={{ width: `${Math.min(100, (ingresoNeto / maxBar) * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          {/* Con comisión */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-sans text-[12px] text-[#999]">Con 10% comisión</span>
              <span className="font-sans text-[12px] text-[#999]">
                ${formatCLP(ingresoConComision)}
              </span>
            </div>
            <div className="h-2 bg-[#F0F0F0] overflow-hidden">
              <motion.div
                className="h-full bg-[#DEDEDE]"
                animate={{ width: `${Math.min(100, (ingresoConComision / maxBar) * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
        {diferencia > 0 && (
          <p className="font-sans text-[11px] text-[#C41C1C] font-bold mt-3">
            +${formatCLP(diferencia)} más con Nebbuler
          </p>
        )}
      </div>

      {/* Anual */}
      <p className="font-sans text-[12px] text-[#999] mt-4">
        Ingreso anual estimado:{" "}
        <span className="font-bold text-[#121212]">${formatCLP(ingresoNeto * 12)}</span>
      </p>

      <Link
        href="/abrir"
        className="block w-full mt-6 bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase py-4 text-center hover:bg-[#C41C1C] transition-colors"
      >
        Abrir mi sala →
      </Link>
    </div>
  );
}
