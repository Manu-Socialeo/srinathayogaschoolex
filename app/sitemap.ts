import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://srinathayogaschoolex.vercel.app'

const routes = [
  { url: '', priority: 1.0, changeFreq: 'weekly' },
  { url: '/about', priority: 0.8, changeFreq: 'monthly' },
  { url: '/courses', priority: 0.9, changeFreq: 'weekly' },
  { url: '/teachers', priority: 0.8, changeFreq: 'monthly' },
  { url: '/shop', priority: 0.8, changeFreq: 'weekly' },
  { url: '/contact', priority: 0.7, changeFreq: 'monthly' },
  { url: '/search', priority: 0.6, changeFreq: 'monthly' },
  { url: '/privacy', priority: 0.3, changeFreq: 'yearly' },
  { url: '/terms', priority: 0.3, changeFreq: 'yearly' },
  { url: '/refund', priority: 0.3, changeFreq: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq as 'weekly' | 'monthly' | 'yearly',
    priority: route.priority,
  }))
}
