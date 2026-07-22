import { serverEnv } from '@kotodama/platform/config'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${serverEnv().KOTODAMA_SITE_URL}/sitemap.xml`,
  }
}
