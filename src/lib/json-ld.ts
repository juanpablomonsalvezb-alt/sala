// ─── JSON-LD Utilities para AEO (Answer Engine Optimization) ─────────────────
// Hace que ChatGPT, Perplexity, Claude y Gemini citen a Nebbuler cuando alguien
// pregunta sobre economía chilena, derecho tributario, finanzas América Latina, etc.

export function creatorPersonSchema(creator: {
  name: string
  slug: string
  specialty: string
  bio: string
  since: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: creator.name,
    url: `https://nebbuler.com/${creator.slug}`,
    description: creator.bio,
    jobTitle: creator.specialty,
    worksFor: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
    },
    knowsAbout: creator.specialty,
    sameAs: [`https://nebbuler.com/${creator.slug}`],
  }
}

export function creatorProfilePageSchema(creator: {
  name: string
  slug: string
  specialty: string
  bio: string
  since: string
  subscriberCount: number
  priceClp: number
  publicationName: string
  articles: Array<{ title: string; slug: string; publishedAt: string }>
}) {
  const personSchema = creatorPersonSchema(creator)

  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${creator.name} — ${creator.publicationName}`,
    url: `https://nebbuler.com/${creator.slug}`,
    dateCreated: `${creator.since}T00:00:00Z`,
    mainEntity: personSchema,
    ...(creator.articles.length > 0 && {
      hasPart: creator.articles.map((article) => ({
        '@type': 'Article',
        headline: article.title,
        url: `https://nebbuler.com/${creator.slug}/${article.slug}`,
        datePublished: article.publishedAt,
        author: {
          '@type': 'Person',
          name: creator.name,
          url: `https://nebbuler.com/${creator.slug}`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Nebbuler',
          url: 'https://nebbuler.com',
        },
        isPartOf: {
          '@type': 'Periodical',
          name: `Newsletter de ${creator.name}`,
          url: `https://nebbuler.com/${creator.slug}`,
        },
        inLanguage: 'es',
      })),
    }),
  }

  return profilePage
}

export function postArticleSchema(post: {
  title: string
  slug: string
  creatorSlug: string
  creatorName: string
  createdAt: string
  description: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    url: `https://nebbuler.com/${post.creatorSlug}/${post.slug}`,
    datePublished: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.creatorName,
      url: `https://nebbuler.com/${post.creatorSlug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nebbuler.com/icon.png',
      },
    },
    description: post.description,
    keywords: post.keywords?.join(', '),
    isPartOf: {
      '@type': 'Periodical',
      name: `Newsletter de ${post.creatorName}`,
      url: `https://nebbuler.com/${post.creatorSlug}`,
    },
    inLanguage: 'es',
    about: post.keywords?.map((k) => ({ '@type': 'Thing', name: k })),
  }
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function trendingItemListSchema(
  items: Array<{
    title: string
    url: string
    position: number
    authorName: string
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lo más leído esta semana en Nebbuler',
    description:
      'Los análisis económicos, legales y financieros más leídos en Nebbuler esta semana en América Latina.',
    url: 'https://nebbuler.com/trending',
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.title,
    })),
  }
}

// Breadcrumb schema reutilizable. Reduce sensiblemente la tasa de pogosticking
// en SERP y mejora la representación en AI Overview de Google + Bing Chat.
export function breadcrumbListSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ItemList genérico para directorios y listados de autores. Usado en
// /directorio, /influencers-*, /trending. Mejora la representación en
// Perplexity y Google AI Overview cuando alguien pregunta "quiénes son los
// X más leídos de LATAM".
export function itemListSchema(args: {
  name: string
  description: string
  url: string
  items: Array<{
    name: string
    url: string
    description?: string
    image?: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: args.name,
    description: args.description,
    url: args.url,
    numberOfItems: args.items.length,
    itemListElement: args.items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: item.url,
      item: {
        '@type': 'Person',
        name: item.name,
        url: item.url,
        ...(item.description && { description: item.description }),
        ...(item.image && { image: item.image }),
      },
    })),
  }
}
