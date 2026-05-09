import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/nebbuler-logo.svg"
              alt="Nebbuler"
              width={64}
              height={52}
              priority
            />
            <span className="font-serif text-[36px] font-bold leading-none tracking-[-0.03em] text-[#121212]">
              NEBBULER
            </span>
          </Link>
          <div className="h-px w-full bg-[#DEDEDE]" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: "Explorar", href: "/explorar" },
              { label: "Para creadores", href: "/para-creadores" },
              { label: "Precios", href: "/precios" },
              { label: "Entrar", href: "/entrar" },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE] px-1">·</span>}
                <Link
                  href={item.href}
                  className="hover:text-[#121212] transition-colors duration-150 uppercase tracking-[0.08em] text-[11px] font-medium"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
