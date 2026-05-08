"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight, User, BookOpen, Tag } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface FormData {
  // Step 1
  nombre: string;
  especialidad: string;
  bio: string;
  linkedin: string;
  // Step 2
  nombreSala: string;
  pitch: string;
  frecuencia: string;
  // Step 3
  precio: number;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const ESPECIALIDADES = [
  "Economista",
  "Abogado",
  "Médico",
  "Psicólogo",
  "Ingeniero",
  "Periodista",
  "Financiero",
  "Otro",
];

const FRECUENCIAS = [
  { value: "diario", label: "Diario" },
  { value: "2-3-semana", label: "2-3 veces/semana" },
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
];

const PRECIOS = [4990, 7990, 9990, 14990, 19990];

function formatCLP(n: number) {
  return n.toLocaleString("es-CL");
}

const STEPS = [
  { id: 1, label: "Tu perfil", icon: User },
  { id: 2, label: "Tu sala", icon: BookOpen },
  { id: 3, label: "Tu precio", icon: Tag },
];

/* ─── Stepper Header ────────────────────────────────────────────────────── */

function StepperHeader({ current }: { current: number }) {
  return (
    <div className="mb-12 flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                  done
                    ? "border-[#C9A96E] bg-[#C9A96E]"
                    : active
                    ? "border-[#C9A96E] bg-[#C9A96E]/10"
                    : "border-[#1E1E1E] bg-transparent"
                }`}
              >
                {done ? (
                  <Check size={16} className="text-[#0A0A0A]" />
                ) : (
                  <Icon
                    size={16}
                    className={active ? "text-[#C9A96E]" : "text-[#8A8070]"}
                  />
                )}
              </div>
              <span
                className={`font-sans text-xs font-medium whitespace-nowrap ${
                  active
                    ? "text-[#C9A96E]"
                    : done
                    ? "text-[#F5F0E8]/60"
                    : "text-[#8A8070]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className={`mb-5 mx-3 h-px w-16 transition-all duration-500 sm:w-24 ${
                  done ? "bg-[#C9A96E]" : "bg-[#1E1E1E]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Input primitives ──────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-[#8A8070]">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border bg-[#111111] px-4 py-3.5 font-sans text-sm text-[#F5F0E8] outline-none placeholder:text-[#8A8070]/50 transition-all duration-150 focus:border-[#C9A96E]/60 focus:ring-1 focus:ring-[#C9A96E]/20 ${
        error ? "border-red-500/50" : "border-[#1E1E1E]"
      }`}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  maxLength,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className={`w-full resize-none rounded-xl border bg-[#111111] px-4 py-3.5 font-sans text-sm text-[#F5F0E8] outline-none placeholder:text-[#8A8070]/50 transition-all duration-150 focus:border-[#C9A96E]/60 focus:ring-1 focus:ring-[#C9A96E]/20 ${
          error ? "border-red-500/50" : "border-[#1E1E1E]"
        }`}
      />
      {maxLength && (
        <div className="mt-1 text-right font-sans text-xs text-[#8A8070]/50">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#1E1E1E] bg-[#111111] px-4 py-3.5 font-sans text-sm text-[#F5F0E8] outline-none transition-all duration-150 focus:border-[#C9A96E]/60 focus:ring-1 focus:ring-[#C9A96E]/20 appearance-none cursor-pointer"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#111111]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ─── Step 1 ─────────────────────────────────────────────────────────────── */

function Step1({
  data,
  setData,
  errors,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
  errors: Partial<Record<keyof FormData, boolean>>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>Nombre completo *</Label>
        <Input
          value={data.nombre}
          onChange={(v) => setData({ nombre: v })}
          placeholder="Ej. Ana García"
          error={errors.nombre}
        />
        {errors.nombre && (
          <p className="mt-1 font-sans text-xs text-red-400">Campo obligatorio</p>
        )}
      </div>

      <div>
        <Label>Tu especialidad *</Label>
        <Select
          value={data.especialidad}
          onChange={(v) => setData({ especialidad: v })}
          options={ESPECIALIDADES.map((e) => ({ value: e.toLowerCase(), label: e }))}
          placeholder="Selecciona tu especialidad"
        />
        {errors.especialidad && (
          <p className="mt-1 font-sans text-xs text-red-400">Selecciona una especialidad</p>
        )}
      </div>

      <div>
        <Label>Bio corta *</Label>
        <Textarea
          value={data.bio}
          onChange={(v) => setData({ bio: v })}
          placeholder="Cuéntale a tus futuros suscriptores quién eres en una frase..."
          maxLength={150}
          error={errors.bio}
        />
        {errors.bio && (
          <p className="mt-1 font-sans text-xs text-red-400">Escribe una bio corta</p>
        )}
      </div>

      <div>
        <Label>LinkedIn (opcional)</Label>
        <Input
          value={data.linkedin}
          onChange={(v) => setData({ linkedin: v })}
          placeholder="https://linkedin.com/in/tu-perfil"
          type="url"
        />
      </div>
    </div>
  );
}

/* ─── Step 2 ─────────────────────────────────────────────────────────────── */

function Step2({
  data,
  setData,
  errors,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
  errors: Partial<Record<keyof FormData, boolean>>;
}) {
  const slug = data.nombreSala
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>Nombre de tu sala *</Label>
        <Input
          value={data.nombreSala}
          onChange={(v) => setData({ nombreSala: v })}
          placeholder="Ej. Economía sin filtro"
          error={errors.nombreSala}
        />
        {slug && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] px-3 py-2">
            <span className="font-sans text-xs text-[#8A8070]">Tu URL:</span>
            <span className="font-sans text-xs font-medium text-[#C9A96E]">
              sala.lat/{slug}
            </span>
          </div>
        )}
        {errors.nombreSala && (
          <p className="mt-1 font-sans text-xs text-red-400">Dale un nombre a tu sala</p>
        )}
      </div>

      <div>
        <Label>¿Qué vas a publicar? *</Label>
        <Textarea
          value={data.pitch}
          onChange={(v) => setData({ pitch: v })}
          placeholder="Describe qué van a recibir tus suscriptores. Sé específico: 'Análisis semanal de la economía chilena desde adentro, sin eufemismos.'"
          error={errors.pitch}
        />
        {errors.pitch && (
          <p className="mt-1 font-sans text-xs text-red-400">Describe qué publicarás</p>
        )}
      </div>

      <div>
        <Label>Frecuencia de publicación *</Label>
        <Select
          value={data.frecuencia}
          onChange={(v) => setData({ frecuencia: v })}
          options={FRECUENCIAS}
          placeholder="¿Con qué frecuencia publicarás?"
        />
        {errors.frecuencia && (
          <p className="mt-1 font-sans text-xs text-red-400">Elige una frecuencia</p>
        )}
      </div>
    </div>
  );
}

/* ─── Step 3 ─────────────────────────────────────────────────────────────── */

function Step3({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const earningsWith100 = data.precio * 100;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-4 font-sans text-sm text-[#8A8070]">
          Elige el precio mensual que cobrarás a tus suscriptores. Siempre puedes cambiarlo después.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRECIOS.map((p) => (
            <button
              key={p}
              onClick={() => setData({ precio: p })}
              className={`flex flex-col items-center justify-center rounded-xl border px-4 py-5 transition-all duration-200 ${
                data.precio === p
                  ? "border-[#C9A96E] bg-[#C9A96E]/10"
                  : "border-[#1E1E1E] bg-[#111111] hover:border-[#C9A96E]/30"
              }`}
            >
              <span
                className={`font-serif text-xl font-bold ${
                  data.precio === p ? "text-[#C9A96E]" : "text-[#F5F0E8]"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                ${formatCLP(p)}
              </span>
              <span className="mt-0.5 font-sans text-xs text-[#8A8070]">CLP/mes</span>
            </button>
          ))}
        </div>
      </div>

      {/* Earnings preview */}
      {data.precio > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl bg-[#111111] p-5 border border-[#1E1E1E]"
        >
          <p className="mb-3 font-sans text-xs uppercase tracking-wider text-[#8A8070]">
            Tu ingreso proyectado
          </p>
          <div className="flex flex-col gap-2">
            {[50, 100, 200, 500].map((subs) => (
              <div key={subs} className="flex items-center justify-between">
                <span className="font-sans text-sm text-[#8A8070]">
                  Con {subs} suscriptores
                </span>
                <span className="font-sans text-sm font-semibold text-[#F5F0E8]">
                  ${formatCLP(data.precio * subs)} CLP/mes
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-[#1E1E1E] pt-3">
            <p className="font-sans text-xs text-[#8A8070]/60">
              * Estimado con Plan Pro (0% comisión). Con Plan Libre descontamos 10%.
            </p>
          </div>
        </motion.div>
      )}

      <div className="rounded-xl border border-[#C9A96E]/20 bg-[#C9A96E]/5 p-4">
        <p className="font-sans text-sm text-[#C9A96E]/90">
          Con 100 suscriptores a ${formatCLP(data.precio)}/mes →{" "}
          <strong>${formatCLP(earningsWith100)} CLP</strong> para ti.
        </p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

const INITIAL: FormData = {
  nombre: "",
  especialidad: "",
  bio: "",
  linkedin: "",
  nombreSala: "",
  pitch: "",
  frecuencia: "",
  precio: 9990,
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function AbrirPage() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  function patch(data: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...data }));
    // Clear errors on change
    const keys = Object.keys(data) as (keyof FormData)[];
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  }

  function validateStep1(): boolean {
    const e: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.nombre.trim()) e.nombre = true;
    if (!form.especialidad) e.especialidad = true;
    if (!form.bio.trim()) e.bio = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.nombreSala.trim()) e.nombreSala = true;
    if (!form.pitch.trim()) e.pitch = true;
    if (!form.frecuencia) e.frecuencia = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) {
      setDir(1);
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step > 1) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  }

  function handleSubmit() {
    // In production: POST to API
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30">
            <Check size={28} className="text-[#C9A96E]" />
          </div>
          <h1
            className="mb-3 font-serif text-3xl font-bold text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            ¡Tu sala está lista!
          </h1>
          <p className="mb-2 font-sans text-base text-[#8A8070]">
            Hemos creado{" "}
            <span className="font-medium text-[#C9A96E]">
              sala.lat/
              {form.nombreSala.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
            </span>
          </p>
          <p className="font-sans text-sm text-[#8A8070]/70">
            Te enviaremos un correo con los siguientes pasos para activar tu sala.
          </p>
          <a
            href="/precios"
            className="mt-8 inline-block rounded-xl border border-[#1E1E1E] px-6 py-3 font-sans text-sm text-[#F5F0E8]/70 transition-all hover:border-[#C9A96E]/40 hover:text-[#F5F0E8]"
          >
            Ver planes →
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-20">
      <div className="mx-auto max-w-xl">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <a
            href="/"
            className="font-serif text-xl font-semibold text-[#F5F0E8] hover:text-[#C9A96E] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Sala
          </a>
          <p className="mt-1 font-sans text-xs text-[#8A8070]">
            Abre tu sala en 3 pasos
          </p>
        </motion.div>

        {/* Stepper */}
        <StepperHeader current={step} />

        {/* Step content */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#0D0D0D] p-8">
          {/* Step title */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`title-${step}`}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                className="mb-6 font-serif text-2xl font-semibold text-[#F5F0E8]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {step === 1 && "Cuéntanos sobre ti"}
                {step === 2 && "Configura tu sala"}
                {step === 3 && "Define tu precio"}
              </h2>

              {step === 1 && (
                <Step1 data={form} setData={patch} errors={errors} />
              )}
              {step === 2 && (
                <Step2 data={form} setData={patch} errors={errors} />
              )}
              {step === 3 && (
                <Step3 data={form} setData={patch} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goBack}
            className={`rounded-xl border border-[#1E1E1E] px-5 py-3 font-sans text-sm text-[#8A8070] transition-all hover:border-[#C9A96E]/30 hover:text-[#F5F0E8] ${
              step === 1 ? "invisible" : ""
            }`}
          >
            ← Atrás
          </button>

          {step < 3 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 rounded-xl bg-[#C9A96E] px-6 py-3 font-sans text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-[#D4B47A]"
            >
              Continuar
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-[#C9A96E] px-8 py-3.5 font-sans text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-[#D4B47A] hover:shadow-[0_0_40px_rgba(201,169,110,0.25)]"
            >
              Abrir mi sala
              <ArrowRight size={15} />
            </button>
          )}
        </div>

        {/* Step indicator text */}
        <p className="mt-4 text-center font-sans text-xs text-[#8A8070]/50">
          Paso {step} de {STEPS.length}
        </p>
      </div>
    </main>
  );
}
