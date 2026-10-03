// Чистые SEO-данные: используются и при пререндере (Node), и на клиенте.
import { site, faq, tripCards, contacts, routes } from '../data/site'

export function basePath() {
  const b = (import.meta.env && import.meta.env.BASE_URL) || '/'
  return b.endsWith('/') ? b : b + '/'
}

// База для canonical: у зеркала (GitHub Pages) она отличается от пути сборки —
// VITE_CANONICAL_BASE='/' указывает на основной сайт.
function canonicalBase() {
  const c = import.meta.env && import.meta.env.VITE_CANONICAL_BASE
  if (c === undefined) return basePath()
  return c.endsWith('/') ? c : c + '/'
}

export function canonicalUrl(route, origin = site.origin) {
  const b = canonicalBase()
  let p = route.path === '/' ? '' : route.path.replace(/^\//, '')
  if (import.meta.env && import.meta.env.VITE_INDEX_HTML && p.endsWith('/')) p += 'index.html'
  return origin.replace(/\/$/, '') + '/' + (b === '/' ? '' : b.replace(/^\//, '')) + p
}

export function ogImageUrl(origin = site.origin) {
  return site.origin.replace(/\/$/, '') + canonicalBase() + site.ogImage
}

export function jsonLdFor(id, origin = site.origin) {
  const blocks = []
  const home = routes.find(r => r.id === 'home')
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: site.name,
    description: site.defaultDescription,
    url: canonicalUrl(home, origin),
    image: ogImageUrl(origin),
    telephone: site.phone,
    email: site.email,
    priceRange: '₽₽',
    areaServed: ['RU', 'BY', 'KZ'],
    sameAs: [contacts.vk, contacts.telegram],
    identifier: site.registry.label
  })
  if (id === 'home' || id === 'contacts') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    })
  }
  if (id === 'trips') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Направления и форматы путешествий',
      itemListElement: tripCards.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: c.title,
          description: c.text,
          category: c.category,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            description: `${c.budget} — ${c.budgetNote || 'условия уточняются'}`,
            availability: 'https://schema.org/InStock',
            url: canonicalUrl(routes.find(r => r.id === 'trips'), origin)
          }
        }
      }))
    })
  }
  return blocks
}

export function headFor(route, origin = site.origin) {
  const title = route.title || site.defaultTitle
  const description = route.description || site.defaultDescription
  const url = canonicalUrl(route, origin)
  const image = ogImageUrl(origin)
  return {
    title,
    description,
    url,
    image,
    robots: route.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    metas: [
      ['name', 'description', description],
      ['name', 'robots', route.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'],
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', site.name],
      ['property', 'og:locale', 'ru_RU'],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['name', 'twitter:image', image]
    ],
    jsonLd: jsonLdFor(route.id, origin)
  }
}
