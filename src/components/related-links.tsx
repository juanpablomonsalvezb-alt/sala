import Link from 'next/link'
import { PAISES, PROFESIONES } from '@/data/salarios'
import { PAISES_COMP, PROFESIONES_COMP_SLUGS, FACTOR_PROFESION } from '@/data/programmatic/comparativas-pais'
import { COMPETITORS } from '@/data/competitors'

interface RelatedLinksProps {
  currentPath: string
  profession?: string
  country?: string
}

interface LinkItem {
  href: string
  label: string
  category: string
}

function getSalaryLinks(profession: string, country: string): LinkItem[] {
  const links: LinkItem[] = []

  // Same profession, other countries
  const otherCountries = PAISES
    .filter(p => p.slug !== country)
    .slice(0, 3)
  for (const p of otherCountries) {
    const prof = PROFESIONES.find(pr => pr.slug === profession)
    if (prof) {
      links.push({
        href: `/salario/${profession}/${p.slug}`,
        label: `Salario de ${prof.nombre} en ${p.nombre}`,
        category: 'Misma profesion, otro pais',
      })
    }
  }

  // Same country, other professions
  const otherProfessions = PROFESIONES
    .filter(p => p.slug !== profession)
    .slice(0, 3)
  for (const p of otherProfessions) {
    const pais = PAISES.find(pa => pa.slug === country)
    if (pais) {
      links.push({
        href: `/salario/${p.slug}/${country}`,
        label: `Salario de ${p.nombre} en ${pais.nombre}`,
        category: 'Mismo pais, otra profesion',
      })
    }
  }

  // Related comparison if available
  const paisComp = PAISES_COMP.find(p => p.slug === country)
  const otherCompCountry = PAISES_COMP.find(p => p.slug !== country)
  if (paisComp && otherCompCountry && PROFESIONES_COMP_SLUGS.includes(profession)) {
    links.push({
      href: `/comparar/${profession}/${country}-vs-${otherCompCountry.slug}`,
      label: `Comparar ${FACTOR_PROFESION[profession]?.nombreMayus ?? profession}: ${paisComp.nombre} vs ${otherCompCountry.nombre}`,
      category: 'Comparativa',
    })
  }

  // Related honorarios link
  const prof = PROFESIONES.find(pr => pr.slug === profession)
  if (prof) {
    links.push({
      href: `/honorarios/${profession}/santiago`,
      label: `Honorarios de ${prof.nombre} en Santiago`,
      category: 'Honorarios',
    })
  }

  // CTA links
  links.push({
    href: '/vs/substack',
    label: 'Nebbuler vs Substack: comparativa para LATAM',
    category: 'Comparar plataformas',
  })
  links.push({
    href: '/cuanto-te-quitan',
    label: 'Calculadora: cuanto te quitan las plataformas',
    category: 'Herramienta',
  })

  return links.slice(0, 10)
}

function getComparisonLinks(profession: string, countryA: string, countryB: string): LinkItem[] {
  const links: LinkItem[] = []
  const prof = FACTOR_PROFESION[profession]

  // Salary detail pages for both countries
  if (prof) {
    const paisA = PAISES_COMP.find(p => p.slug === countryA)
    const paisB = PAISES_COMP.find(p => p.slug === countryB)
    if (paisA) {
      links.push({
        href: `/salario/${profession}/${countryA}`,
        label: `Salario de ${prof.nombre} en ${paisA.nombre}`,
        category: 'Salario detallado',
      })
    }
    if (paisB) {
      links.push({
        href: `/salario/${profession}/${countryB}`,
        label: `Salario de ${prof.nombre} en ${paisB.nombre}`,
        category: 'Salario detallado',
      })
    }
  }

  // Other profession comparisons for same pair
  const otherProfs = PROFESIONES_COMP_SLUGS
    .filter(s => s !== profession)
    .slice(0, 3)
  for (const slug of otherProfs) {
    const p = FACTOR_PROFESION[slug]
    if (p) {
      links.push({
        href: `/comparar/${slug}/${countryA}-vs-${countryB}`,
        label: `${p.nombreMayus}: ${PAISES_COMP.find(c => c.slug === countryA)?.nombre ?? countryA} vs ${PAISES_COMP.find(c => c.slug === countryB)?.nombre ?? countryB}`,
        category: 'Otra profesion',
      })
    }
  }

  // Same profession, different country pair
  const availableCountries = PAISES_COMP
    .filter(p => p.slug !== countryA && p.slug !== countryB)
    .slice(0, 2)
  if (prof && availableCountries.length >= 1) {
    links.push({
      href: `/comparar/${profession}/${countryA}-vs-${availableCountries[0].slug}`,
      label: `${prof.nombreMayus}: ${PAISES_COMP.find(c => c.slug === countryA)?.nombre ?? countryA} vs ${availableCountries[0].nombre}`,
      category: 'Otro par de paises',
    })
  }

  // CTA links
  links.push({
    href: '/cuanto-te-quitan',
    label: 'Calculadora: cuanto te quitan las plataformas',
    category: 'Herramienta',
  })
  links.push({
    href: '/vs/substack',
    label: 'Nebbuler vs Substack: la mejor opcion para LATAM',
    category: 'Comparar plataformas',
  })

  return links.slice(0, 10)
}

function getVsLinks(currentSlug: string): LinkItem[] {
  const links: LinkItem[] = []

  // Other competitor pages
  const otherCompetitors = COMPETITORS
    .filter(c => c.slug !== currentSlug)
    .slice(0, 4)
  for (const c of otherCompetitors) {
    links.push({
      href: `/vs/${c.slug}`,
      label: `Nebbuler vs ${c.name}: comparativa completa`,
      category: 'Comparativa',
    })
  }

  // Salary pages as cross-link
  const topProfessions = PROFESIONES.slice(0, 2)
  const topCountries = PAISES.slice(0, 2)
  for (const prof of topProfessions) {
    for (const pais of topCountries) {
      links.push({
        href: `/salario/${prof.slug}/${pais.slug}`,
        label: `Salario de ${prof.nombre} en ${pais.nombre}`,
        category: 'Salarios LATAM',
      })
    }
  }

  // CTA
  links.push({
    href: '/cuanto-te-quitan',
    label: 'Calculadora: cuanto te quitan las plataformas',
    category: 'Herramienta',
  })
  links.push({
    href: '/datos',
    label: 'Datos salariales abiertos de America Latina',
    category: 'Datos',
  })

  return links.slice(0, 10)
}

function getGenericLinks(): LinkItem[] {
  return [
    { href: '/salario/economista/chile', label: 'Salario de economista en Chile', category: 'Salarios' },
    { href: '/salario/abogado/mexico', label: 'Salario de abogado en Mexico', category: 'Salarios' },
    { href: '/salario/medico/colombia', label: 'Salario de medico en Colombia', category: 'Salarios' },
    { href: '/comparar/economista/chile-vs-argentina', label: 'Economista: Chile vs Argentina', category: 'Comparar' },
    { href: '/vs/substack', label: 'Nebbuler vs Substack', category: 'Plataformas' },
    { href: '/vs/patreon', label: 'Nebbuler vs Patreon', category: 'Plataformas' },
    { href: '/cuanto-te-quitan', label: 'Calculadora de comisiones', category: 'Herramienta' },
    { href: '/datos', label: 'Datos salariales abiertos LATAM', category: 'Datos' },
  ]
}

export function RelatedLinks({ currentPath, profession, country }: RelatedLinksProps) {
  let links: LinkItem[] = []

  // Determine context from currentPath
  const salarioMatch = currentPath.match(/^\/salario\/([^/]+)\/([^/]+)$/)
  const compararMatch = currentPath.match(/^\/comparar\/([^/]+)\/([^/]+)-vs-([^/]+)$/)
  const vsMatch = currentPath.match(/^\/vs\/([^/]+)$/)

  if (salarioMatch) {
    const prof = profession ?? salarioMatch[1]
    const pais = country ?? salarioMatch[2]
    links = getSalaryLinks(prof, pais)
  } else if (compararMatch) {
    links = getComparisonLinks(compararMatch[1], compararMatch[2], compararMatch[3])
  } else if (vsMatch) {
    links = getVsLinks(vsMatch[1])
  } else {
    links = getGenericLinks()
  }

  // Filter out self-links
  links = links.filter(l => l.href !== currentPath)

  if (links.length === 0) return null

  return (
    <section className="border-t border-[#DEDEDE] pt-10 mt-12">
      <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-5">
        Tambien te puede interesar
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start gap-3 border border-[#EDEDED] px-4 py-3 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors"
          >
            <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-[#C41C1C] opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="font-sans text-[13px] text-[#333] group-hover:text-[#C41C1C] leading-snug transition-colors">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
