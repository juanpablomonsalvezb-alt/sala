"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Configuración por país: símbolo, moneda, precios sugeridos, tarifa mensual Nebbuler.
// La tarifa equivale a US$19/mes — ajustada por país según pricing.ts (2026-05-21).
const PAISES = {
  CL: { bandera: "🇨🇱", nombre: "Chile",     simbolo: "$",  moneda: "CLP", precios: [4990,  7990,  9990,  14990, 19990], tarifa: 17990  },
  AR: { bandera: "🇦🇷", nombre: "Argentina", simbolo: "$",  moneda: "ARS", precios: [3000,  5000,  7000,  10000, 15000], tarifa: 23990  },
  MX: { bandera: "🇲🇽", nombre: "México",    simbolo: "$",  moneda: "MXN", precios: [60,    99,    149,   199,   299],   tarifa: 349    },
  CO: { bandera: "🇨🇴", nombre: "Colombia",  simbolo: "$",  moneda: "COP", precios: [12000, 20000, 30000, 45000, 59000], tarifa: 79000  },
  PE: { bandera: "🇵🇪", nombre: "Perú",      simbolo: "S/", moneda: "PEN", precios: [12,    20,    30,    45,    59],    tarifa: 69     },
  UY: { bandera: "🇺🇾", nombre: "Uruguay",   simbolo: "$",  moneda: "UYU", precios: [150,   250,   390,   590,   750],  tarifa: 790    },
  BR: { bandera: "🇧🇷", nombre: "Brasil",    simbolo: "R$", moneda: "BRL", precios: [15,    25,    39,    59,    79],   tarifa: 109    },
} as const;

type PaisKey = keyof typeof PAISES;

function fmt(n: number, pais: PaisKey): string {
  const { moneda } = PAISES[pais];
  // Monedas de alta denominación sin decimales, resto con separador de miles
  return n.toLocaleString("es-CL");
}

export function PricingCalculator() {
  const [pais, setPais] = useState<PaisKey>("CL");
  const [subs, setSubs] = useState<number>(200);
  const [precio, setPrecio] = useState<number>(14990);

  const p = PAISES[pais];
  const ingresoBruto = subs * precio;
  const ingresoNeto = Math.max(0, ingresoBruto - p.tarifa);
  const ingresoConComision = Math.round(ingresoBruto * 0.9);
  const diferencia = ingresoNeto - ingresoConComision;
  const sliderPct = ((subs - 50) / (2000 - 50)) * 100;
  const maxBar = Math.max(ingresoNeto, ingresoConComision, 1);

  // Al cambiar país: resetear precio al índice 2 (precio medio)
  function handlePais(key: PaisKey) {
    setPais(key);
    setPrecio(PAISES[key].precios[2]);
  }

  return (
    <div className="bg-white border border-[#EEEEEE] p-8 md:p-10">
      {/* Header + selector de país */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#999]">
          Calcula tu ingreso
        </p>
        <div className="flex gap-1 flex-wrap justify-end">
          {(Object.keys(PAISES) as PaisKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handlePais(key)}
              title={PAISES[key].nombre}
              className={`text-[15px] px-1.5 py-0.5 transition-all border ${
                pais === key
                  ? "border-[#C41C1C] bg-[#FFF5F5]"
                  : "border-transparent hover:border-[#DEDEDE]"
              }`}
            >
              {PAISES[key].bandera}
            </button>
          ))}
        </div>
      </div>

      {/* Output principal */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${ingresoNeto}-${pais}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="font-serif text-[44px] md:text-[60px] font-bold text-[#C41C1C] leading-none"
          >
            {p.simbolo}{fmt(ingresoNeto, pais)}
          </motion.p>
        </AnimatePresence>
        <p className="font-sans text-[12px] text-[#999] mt-1">
          neto mensual · {subs} suscriptores · {p.moneda}
        </p>
      </div>

      {/* Selector de precio */}
      <div className="mb-6">
        <p className="font-sans text-[11px] text-[#666] mb-3">
          Precio por suscriptor / mes
        </p>
        <div className="flex gap-2 flex-wrap">
          {p.precios.map((pr) => (
            <button
              key={pr}
              onClick={() => setPrecio(pr)}
              className={`px-3 py-2 font-sans text-[12px] font-bold border transition-colors ${
                precio === pr
                  ? "bg-[#C41C1C] text-white border-[#C41C1C]"
                  : "bg-white text-[#444] border-[#DEDEDE] hover:border-[#C41C1C]"
              }`}
            >
              {p.simbolo}{fmt(pr, pais)}
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
      <div className="border-t border-[#F0F0F0] pt-5">
        <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999] mb-4">
          Nebbuler vs plataforma con comisión (10%)
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-sans text-[12px] text-[#121212] font-bold">Nebbuler</span>
              <span className="font-sans text-[12px] text-[#C41C1C] font-bold">
                {p.simbolo}{fmt(ingresoNeto, pais)}
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
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-sans text-[12px] text-[#999]">Con comisión</span>
              <span className="font-sans text-[12px] text-[#999]">
                {p.simbolo}{fmt(ingresoConComision, pais)}
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
            +{p.simbolo}{fmt(diferencia, pais)} más con Nebbuler
          </p>
        )}
      </div>

      {/* Tarifa y anual */}
      <div className="mt-4 space-y-1">
        <p className="font-sans text-[11px] text-[#BBBBBB]">
          Tarifa Nebbuler: {p.simbolo}{fmt(p.tarifa, pais)} {p.moneda}/mes fija
        </p>
        <p className="font-sans text-[12px] text-[#999]">
          Ingreso anual estimado:{" "}
          <span className="font-bold text-[#121212]">
            {p.simbolo}{fmt(ingresoNeto * 12, pais)}
          </span>
        </p>
      </div>

      <Link
        href="/abrir"
        className="block w-full mt-6 bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase py-4 text-center hover:bg-[#C41C1C] transition-colors"
      >
        Abrir mi sala →
      </Link>
    </div>
  );
}
