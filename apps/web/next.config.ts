import { resolve } from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler (stable in Next 16): auto-memoizes components, so manual
  // useMemo/useCallback/React.memo are the exception, not the rule. Next applies
  // the Babel compiler only to JSX/Hook files via an SWC pre-pass, so Turbopack
  // builds stay fast.
  reactCompiler: true,
  // No `transpilePackages`: Turbopack auto-transpiles workspace packages in the
  // monorepo (the `@kotodama/*` spine) under the App Router — listing them is
  // redundant and drifts when a package is added. It's only needed for a
  // node_modules dep that ships raw TS/JSX.
  typedRoutes: true,
  // Absolute monorepo root so Turbopack's workspace inference is deterministic.
  turbopack: { root: resolve(import.meta.dirname, '../..') },
  // Same-origin `/api/*` → backend. NOTE: KOTODAMA_API_URL is inlined at BUILD
  // time, so build per environment.
  async rewrites() {
    const backend = process.env.KOTODAMA_API_URL ?? 'http://localhost:3000'
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }]
  },
}

export default nextConfig
