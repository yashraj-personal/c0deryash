import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://c0deryash.vercel.app'
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/support`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
