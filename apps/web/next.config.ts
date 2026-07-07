import { resolve } from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler (stable in Next 16): auto-memoizes components, so manual
  // useMemo/useCallback/React.memo are the exception, not the rule. Next applies
  // the Babel compiler only to JSX/Hook files via an SWC pre-pass, so Turbopack
  // builds stay fast.
  reactCompiler: true,
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
