import { resolve } from 'node:path'
import { clientEnv, loadRootEnv } from '@kotodama/platform/config'
import type { NextConfig } from 'next'

// Load the repo-root .env (fallback under process.env) before anything reads
// config — server components + metadata touch it. No `/api/*` rewrite: the browser
// never fetches the backend (reads are RSC loaders, polling is a Server Action), so
// there is no same-origin proxy to configure.
loadRootEnv()

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
  // The single server -> client bridge: whatever @kotodama/platform/config's clientSchema
  // declares is inlined into the browser bundle at build. Empty today — nothing
  // crosses to the browser. Keep clientSchema plain-string (a transform/coerce would
  // inline the wrong shape); when a real NEXT_PUBLIC_* var lands, clientEnv() must
  // read it via a literal `process.env.X` (Next inlines only literal member access).
  env: clientEnv(),
  // @kotodama/ui exposes one flat barrel (src/index.ts) — Next rewrites a barrel
  // import into per-symbol deep imports so a page pulls only the components it uses,
  // not the whole design system. Our own workspace pkg isn't auto-optimized (only a
  // curated upstream list is), so it must be named explicitly.
  experimental: { optimizePackageImports: ['@kotodama/ui'] },
}

export default nextConfig
