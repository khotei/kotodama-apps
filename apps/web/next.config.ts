import { resolve } from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Absolute monorepo root so Turbopack's workspace inference is deterministic.
  turbopack: { root: resolve(import.meta.dirname, '../..') },
  transpilePackages: [
    '@kotodama/api-client',
    '@kotodama/repositories',
    '@kotodama/store',
    '@kotodama/use-cases',
    '@kotodama/ui',
  ],
  // Same-origin `/api/*` → backend. NOTE: KOTODAMA_API_URL is inlined at BUILD
  // time, so build per environment.
  async rewrites() {
    const backend = process.env.KOTODAMA_API_URL ?? 'http://localhost:3000'
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }]
  },
}

export default nextConfig
