"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Path = "reader" | "creator" | null;

export default function RegistroPage() {
  const [path, setPath] = useState<Path>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

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
      <main className="flex-1 flex flex-col items-center justify-start px-6 py-14">
        <div className="w-full max-w-[480px]">
          {/* Title */}
          <div className="mb-10 text-center">
            <h1
              className="font-serif text-[#121212] leading-tight"
              style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Únete a Sala
            </h1>
          </div>

          {/* Path selector */}
          {path === null && (
            <div className="flex flex-col gap-4">
              {/* Lector */}
              <button
                type="button"
                onClick={() => setPath("reader")}
                className="group w-full border border-[#DEDEDE] hover:border-[#121212] bg-white text-left px-7 py-7 transition-colors duration-150 focus:outline-none focus:border-[#121212]"
              >
                <span className="section-label mb-2 inline-block">LECTOR</span>
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
                onClick={() => router.push("/abrir")}
                className="group w-full border border-[#DEDEDE] hover:border-[#121212] bg-white text-left px-7 py-7 transition-colors duration-150 focus:outline-none focus:border-[#121212]"
              >
                <span className="section-label mb-2 inline-block">CREADOR</span>
                <p
                  className="font-serif text-[20px] text-[#121212] mb-3 leading-tight"
                  style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  Soy creador
                </p>
                <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-5">
                  Abre tu sala y cobra por lo que sabes
                </p>
                <span className="font-sans text-[12px] font-medium text-[#C41C1C] group-hover:underline underline-offset-2">
                  Abrir mi sala →
                </span>
              </button>
            </div>
          )}

          {/* Reader form */}
          {path === "reader" && (
            <div>
              <button
                type="button"
                onClick={() => setPath(null)}
                className="font-sans text-[12px] text-[#666666] hover:text-[#121212] mb-8 inline-flex items-center gap-1 transition-colors duration-150"
              >
                ← Volver
              </button>

              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full border border-[#DEDEDE] px-4 py-3 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
                  />
                </div>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full border border-[#DEDEDE] px-4 py-3 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white transition-colors duration-150 focus:outline-none focus:border-[#121212]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#121212] text-white font-sans text-[13px] font-medium py-3.5 hover:bg-[#333] transition-colors duration-150 mt-1"
                >
                  Crear cuenta →
                </button>
              </form>
            </div>
          )}

          {/* Login link */}
          <p className="font-sans text-[12px] text-[#666666] text-center mt-8">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/entrar"
              className="text-[#121212] font-medium hover:underline underline-offset-2"
            >
              Entra
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
