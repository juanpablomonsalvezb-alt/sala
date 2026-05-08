"use client";

import { useState } from "react";
import Link from "next/link";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-0 text-center px-6">
        <Link
          href="/"
          className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none inline-block"
          style={{ letterSpacing: "-0.01em" }}
        >
          SALA
        </Link>
        <hr className="nyt-rule mt-5" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px]">
          {/* Titles */}
          <div className="mb-8 text-center">
            <h1
              className="font-serif text-[#121212] mb-2 leading-tight"
              style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Bienvenido de vuelta
            </h1>
            <p className="font-sans text-[14px] text-[#666666]">
              Accede a las salas que sigues
            </p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border border-[#DEDEDE] px-4 py-3 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
              />
            </div>

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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#DEDEDE] px-4 py-3 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#121212] text-white font-sans text-[13px] font-medium py-3.5 hover:bg-[#333] transition-colors duration-150 mt-1"
            >
              Entrar →
            </button>

            <div className="text-center">
              <Link
                href="/recuperar"
                className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150 underline underline-offset-2"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>

          {/* Separator */}
          <div className="my-7 flex items-center gap-4">
            <hr className="flex-1 border-t border-[#DEDEDE]" />
            <span className="font-sans text-[11px] font-medium text-[#666666] uppercase tracking-widest">
              O
            </span>
            <hr className="flex-1 border-t border-[#DEDEDE]" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full border border-[#DEDEDE] bg-white text-[#121212] font-sans text-[13px] font-medium py-3.5 hover:border-[#121212] hover:bg-[#F7F7F7] transition-colors duration-150 flex items-center justify-center gap-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Register link */}
          <p className="font-sans text-[12px] text-[#666666] text-center mt-7">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="text-[#121212] font-medium hover:underline underline-offset-2"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-[#DEDEDE]">
        <p className="font-sans text-[11px] text-[#666666]">
          Sala · hello@sala.lat
        </p>
      </footer>
    </div>
  );
}
