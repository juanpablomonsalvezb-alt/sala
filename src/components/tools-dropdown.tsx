'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type NavItem = {
  label: string
  href: string
  desc: string
  tag?: string
  external?: boolean
}

const TOOLS: NavItem[] = [
  {
    label: '¿Cuánto te quitan?',
    href: '/cuanto-te-quitan',
    desc: 'Calculadora de comisiones de plataformas',
    tag: 'VIRAL',
  },
  {
    label: 'Mundial 2026',
    href: '/mundial',
    desc: 'Todo sobre el Mundial FIFA 2026',
    tag: 'MUNDIAL',
  },
  {
    label: 'Predictor',
    href: 'https://fifa2026.nebbuler.com',
    desc: 'Predice el bracket completo del Mundial',
    tag: 'MUNDIAL',
    external: true,
  },
  {
    label: 'Calendario de partidos',
    href: 'https://fifa2026.nebbuler.com/calendario',
    desc: 'Todos los partidos en tu Google/Apple Calendar',
    tag: 'MUNDIAL',
    external: true,
  },
  {
    label: 'Salarios LATAM',
    href: '/salario',
    desc: 'Rangos salariales por profesión y país',
    tag: 'DATOS',
  },
];

const CREATOR_LINKS: NavItem[] = [
  {
    label: 'Cómo funciona',
    href: '/para-creadores',
    desc: 'Publica, gestiona tu audiencia y cobra directo',
  },
  {
    label: 'Abre tu espacio',
    href: '/abrir',
    desc: 'Configura tu sala en 15 minutos',
  },
  {
    label: 'Precios',
    href: '/precios',
    desc: '0% de comisión sobre tus ingresos',
  },
];

export function ToolsDropdown() {
  return <NavDropdown label="Herramientas" title="Herramientas gratuitas" items={TOOLS} />;
}

export function CreatorsDropdown() {
  return <NavDropdown label="Para creadores" title="Para profesionales" items={CREATOR_LINKS} />;
}

function NavDropdown({ label, title, items }: { label: string; title: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="h-full flex items-center gap-1 px-5 text-[12px] font-medium tracking-[0.04em] text-[#555] hover:text-[#111] hover:bg-[#F8F7F5] border-r border-[#F0F0F0] transition-colors"
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 bg-white border border-[#E0E0E0] shadow-lg min-w-[320px] z-[60]">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#999] px-4 pt-3 pb-2">
            {title}
          </p>
          {items.map((item) => {
            const Component = item.external ? 'a' : Link;
            const extraProps = item.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Component
                key={item.label}
                href={item.href}
                {...(extraProps as Record<string, string>)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors border-t border-[#F5F5F5] group"
                onClick={() => setOpen(false)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#222] group-hover:text-[#B31C1C] transition-colors">
                      {item.label}
                    </span>
                    {item.external && (
                      <span className="text-[9px] text-[#999]">↗</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#888] mt-0.5">{item.desc}</p>
                </div>
                {item.tag && (
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#B31C1C]/60 bg-[#B31C1C]/5 px-1.5 py-0.5 shrink-0 mt-0.5">
                    {item.tag}
                  </span>
                )}
              </Component>
            );
          })}
        </div>
      )}
    </div>
  );
}
