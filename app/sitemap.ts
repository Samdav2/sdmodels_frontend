import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sdmodels.com'
  const currentDate = new Date()

  // Static pages
  const staticPages = [
    '',
    '/marketplace',
    '/browse',
    '/about',
    '/bounties',
    '/leaderboard',
    '/community',
    '/blog',
    '/learn',
    '/mastery',
    '/process',
    '/testimonials',
    '/roadmap',
    '/pricing',
    '/help',
    '/support',
    '/upload',
    '/terms',
    '/privacy',
    '/cookies',
    '/dmca',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return staticPages
}
