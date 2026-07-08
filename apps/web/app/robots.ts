import type { MetadataRoute } from 'next'
import { env } from '@/src/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${env().KOTODAMA_SITE_URL}/sitemap.xml`,
  }
}
