"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

type FormValues = z.infer<typeof schema>;

export default function RecuperarContrasenaPage() {
  const [sent, setSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/nueva-contrasena`,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px]">
          {!sent ? (
            <>
              {/* Títulos */}
              <div className="mb-8 text-center">
                <h1
                  className="font-serif text-[#121212] mb-2 leading-tight"
                  style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  Recuperar contraseña
                </h1>
                <p className="font-sans text-[14px] text-[#666666] leading-relaxed">
                  Ingresa tu email y te enviamos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {/* Error */}
              {authError && (
                <div className="mb-5 border-l-2 border-[#C41C1C] pl-3 py-1">
                  <p className="font-sans text-[13px] text-[#C41C1C]">{authError}</p>
                </div>
              )}

              {/* Formulario */}
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#121212] text-white font-sans text-[13px] font-medium py-3.5 hover:bg-[#333] transition-colors duration-150 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando…" : "Enviar enlace →"}
                </button>
              </form>

              <p className="font-sans text-[12px] text-[#666666] text-center mt-7">
                <Link
                  href="/entrar"
                  className="text-[#121212] font-medium hover:underline underline-offset-2"
                >
                  ← Volver a entrar
                </Link>
              </p>
            </>
          ) : (
            /* Estado confirmación enviada */
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
                Enlace enviado
              </h2>
              <p className="font-sans text-[14px] text-[#666666] leading-relaxed mb-8">
                Revisa tu bandeja de entrada. El enlace expira en 1 hora.
              </p>
              <Link
                href="/entrar"
                className="font-sans text-[12px] text-[#121212] font-medium hover:underline underline-offset-2"
              >
                ← Volver a entrar
              </Link>
            </div>
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
