import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-0 text-center px-6">
        <Link
          href="/"
          className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none inline-block"
          style={{ letterSpacing: "-0.01em" }}
        >
          NEBBULER
        </Link>
        <hr className="nyt-rule mt-5" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p
          className="font-serif text-[#DEDEDE] leading-none mb-8 select-none"
          style={{ fontSize: "clamp(5rem, 20vw, 8rem)", fontWeight: 700, letterSpacing: "-0.04em" }}
          aria-hidden="true"
        >
          404
        </p>

        <hr className="nyt-rule w-full max-w-[320px] mb-8" />

        <h1
          className="font-serif text-[#121212] mb-5 leading-tight"
          style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Esta sala no existe
        </h1>

        <p className="font-sans text-[15px] text-[#666666] leading-relaxed max-w-[400px] mb-10">
          Tal vez el creador cambió su dirección, o la sala ya no está disponible.
        </p>

        <nav
          className="flex items-center gap-2 font-sans text-[13px] text-[#121212]"
          aria-label="Navegación de recuperación"
        >
          <Link
            href="/"
            className="hover:underline underline-offset-2 transition-colors duration-150"
          >
            ← Volver al inicio
          </Link>
          <span className="text-[#DEDEDE]">·</span>
          <Link
            href="/directorio"
            className="hover:underline underline-offset-2 transition-colors duration-150"
          >
            Explorar otras salas →
          </Link>
        </nav>
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
