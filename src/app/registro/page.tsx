"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;
type Path = "reader" | "creator" | null;

export default function RegistroPage() {
  const router = useRouter();
  const [path, setPath] = useState<Path>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setAuthError(null);

    const supabase = createClient();
    const redirectTo =
      path === "creator"
        ? `${window.location.origin}/auth/callback?next=/abrir`
        : `${window.location.origin}/auth/callback?next=/explorar`;

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          role: path === "creator" ? "creator" : "reader",
        },
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    // Supabase puede requerir confirmación de email o iniciar sesión directo
    // Si no hay confirmación requerida, redirigir de inmediato
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push(path === "creator" ? "/abrir" : "/explorar");
    } else {
      // Confirmación por email pendiente
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Franja roja superior */}
      <div className="h-[3px] bg-[#C41C1C] w-full" />

      {/* Header */}
      <header className="pt-10 pb-0 text-center px-6">
        <Link
          href="/"
          className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none inline-block"
          style={{ letterSpacing: "-0.01em" }}
        >
          NEBBULER
        </Link>
        <hr className="mt-5 border-t border-[#121212]" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 py-14">
        <div className="w-full max-w-[480px]">
          {/* Título */}
          <div className="mb-10 text-center">
            <h1
              className="font-serif text-[#121212] leading-tight"
              style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Únete a Nebbuler
            </h1>
          </div>

          {/* Selector de tipo */}
          {path === null && (
            <div className="flex flex-col gap-4">
              {/* Lector */}
              <button
                type="button"
                onClick={() => setPath("reader")}
                className="group w-full border border-[#DEDEDE] hover:border-[#121212] bg-white text-left px-7 py-7 transition-colors duration-150 focus:outline-none focus:border-[#121212]"
              >
                <span className="font-sans text-[11px] font-medium text-[#666666] uppercase tracking-widest mb-2 inline-block">
                  LECTOR
                </span>
                <p
                  className="font-serif text-[20px] text-[#121212] mb-3 leading-tight"
                  style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  Soy lector
                </p>
                <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-5">
                  Accede al conocimiento de los mejores profesionales
                </p>
                <span className="font-sans text-[12px] font-medium text-[#121212] group-hover:underline underline-offset-2">
                  Registrarme como lector →
                </span>
              </button>

              {/* Creador */}
              <button
                type="button"
                onClick={() => setPath("creator")}
                className="group w-full border border-[#DEDEDE] hover:border-[#121212] bg-white text-left px-7 py-7 transition-colors duration-150 focus:outline-none focus:border-[#121212]"
              >
                <span className="font-sans text-[11px] font-medium text-[#666666] uppercase tracking-widest mb-2 inline-block">
                  CREADOR
                </span>
                <p
                  className="font-serif text-[20px] text-[#121212] mb-3 leading-tight"
                  style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  Soy creador
                </p>
                <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-5">
                  Abre tu espacio en Nebbuler y cobra por lo que sabes
                </p>
                <span className="font-sans text-[12px] font-medium text-[#C41C1C] group-hover:underline underline-offset-2">
                  Empezar en Nebbuler →
                </span>
              </button>
            </div>
          )}

          {/* Formulario compartido para lector y creador */}
          {path !== null && !success && (
            <div>
              {/* Encabezado con badge activo */}
              <div className="flex items-center gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setPath(null);
                    setAuthError(null);
                  }}
                  className="font-sans text-[12px] text-[#666666] hover:text-[#121212] inline-flex items-center gap-1 transition-colors duration-150"
                >
                  ← Volver
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPath("reader")}
                    className={`font-sans text-[11px] font-medium uppercase tracking-widest px-3 py-1 border transition-colors duration-150 ${
                      path === "reader"
                        ? "border-[#121212] text-[#121212] bg-white"
                        : "border-[#DEDEDE] text-[#AAAAAA] hover:border-[#121212] hover:text-[#121212]"
                    }`}
                  >
                    Lector
                  </button>
                  <button
                    type="button"
                    onClick={() => setPath("creator")}
                    className={`font-sans text-[11px] font-medium uppercase tracking-widest px-3 py-1 border transition-colors duration-150 ${
                      path === "creator"
                        ? "border-[#C41C1C] text-[#C41C1C] bg-white"
                        : "border-[#DEDEDE] text-[#AAAAAA] hover:border-[#C41C1C] hover:text-[#C41C1C]"
                    }`}
                  >
                    Creador
                  </button>
                </div>
              </div>

              {/* Error */}
              {authError && (
                <div className="mb-5 border-l-2 border-[#C41C1C] pl-3 py-1">
                  <p className="font-sans text-[13px] text-[#C41C1C]">{authError}</p>
                </div>
              )}

              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Nombre */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="font-sans text-[12px] font-medium text-[#121212] uppercase tracking-wide"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    {...register("name")}
                    className="w-full border-b border-[#DEDEDE] px-0 py-2.5 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
                  />
                  {errors.name && (
                    <p className="font-sans text-[12px] text-[#C41C1C]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="font-sans text-[12px] font-medium text-[#121212] uppercase tracking-wide"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    {...register("email")}
                    className="w-full border-b border-[#DEDEDE] px-0 py-2.5 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
                  />
                  {errors.email && (
                    <p className="font-sans text-[12px] text-[#C41C1C]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="font-sans text-[12px] font-medium text-[#121212] uppercase tracking-wide"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    {...register("password")}
                    className="w-full border-b border-[#DEDEDE] px-0 py-2.5 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
                  />
                  {errors.password && (
                    <p className="font-sans text-[12px] text-[#C41C1C]">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#121212] text-white font-sans text-[13px] font-medium py-3.5 hover:bg-[#333] transition-colors duration-150 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Creando cuenta…"
                    : path === "creator"
                    ? "Crear mi cuenta →"
                    : "Crear cuenta →"}
                </button>
              </form>
            </div>
          )}

          {/* Estado de éxito — email de confirmación enviado */}
          {success && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border border-[#121212] flex items-center justify-center mx-auto mb-5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                className="font-serif text-[#121212] mb-3 leading-tight"
                style={{ fontSize: "1.4rem", fontWeight: 700 }}
              >
                Revisa tu email
              </h2>
              <p className="font-sans text-[14px] text-[#666666] leading-relaxed">
                Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta.
              </p>
            </div>
          )}

          {/* Link login */}
          {!success && (
            <p className="font-sans text-[12px] text-[#666666] text-center mt-8">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/entrar"
                className="text-[#121212] font-medium hover:underline underline-offset-2"
              >
                Entra
              </Link>
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-[#DEDEDE]">
        <p className="font-sans text-[11px] text-[#666666]">
          Nebbuler · hello@nebbuler.com
        </p>
      </footer>
    </div>
  );
}
