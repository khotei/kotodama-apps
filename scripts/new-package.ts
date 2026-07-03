#!/usr/bin/env bun
// Scaffold a new @kotodama/<name> workspace in the correct layer.
//
// The frontend analogue of the backend's /new-package command, materialised as
// an executable Bun script because the fresh repo has no .claude/* yet (that is
// copied in T12). The .claude command added later can shell out to this.
//
// Usage:
//   bun --bun scripts/new-package.ts <layer>/<name> [--dom] [--description "…"]
//
// Examples:
//   bun --bun scripts/new-package.ts packages/fe-core
//   bun --bun scripts/new-package.ts packages/fe-ui --dom
//   bun --bun scripts/new-package.ts apps/web --dom
//
// --dom opts the workspace OUT of the DOM-free base and into a web tsconfig
// (`lib: ["dom", ...]` + `jsx` + `@types/react`). OMIT it for the
// platform-agnostic spine (fe-api-client / fe-core / fe-store / fe-tokens) so a
// stray `document`/`window`/react-dom import is a `tsc` error (S2/V2).
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const SCOPE = '@kotodama'
const ROOT = join(dirname(Bun.fileURLToPath(import.meta.url)), '..')

const args = Bun.argv.slice(2)
const dom = args.includes('--dom')
const descFlag = args.indexOf('--description')
const description = descFlag !== -1 ? args[descFlag + 1] : undefined
const target = args.find((a) => !a.startsWith('--') && a !== description)

if (!target) {
  console.error(
    'Usage: bun --bun scripts/new-package.ts <layer>/<name> [--dom] [--description "…"]',
  )
  process.exit(1)
}

const segments = target.split('/').filter(Boolean)
const layer = segments[0]
if (layer !== 'apps' && layer !== 'packages') {
  console.error(`Invalid layer "${layer}". Workspaces live under apps/* or packages/*.`)
  process.exit(1)
}

// Nested folders flatten to a dashed package name (mirrors backend naming.md):
// packages/fe-core -> @kotodama/fe-core ; apps/web -> @kotodama/web.
const flatName = segments.slice(1).join('-')
if (!flatName) {
  console.error('Missing <name> after the layer.')
  process.exit(1)
}
const pkgName = `${SCOPE}/${flatName}`
const dir = join(ROOT, target)
if (existsSync(dir)) {
  console.error(`Refusing to overwrite existing workspace: ${target}`)
  process.exit(1)
}

// Depth to the repo root, e.g. packages/fe-core -> "../.." .
const toRoot = segments.map(() => '..').join('/')

const packageJson = {
  name: pkgName,
  version: '0.0.0',
  private: true,
  type: 'module',
  main: './src/index.ts',
  types: './src/index.ts',
  exports: { '.': './src/index.ts' },
  scripts: {
    // The `bun --bun` prefix is REQUIRED: the tsc/vitest bins ship a
    // `#!/usr/bin/env node` shebang and die on a node-less machine. Both root
    // aggregators (`bun run tsc` / `bun run test`) enumerate workspaces via
    // `--filter '*'`, so a missing script silently drops the package.
    typecheck: 'bun --bun tsc --noEmit',
    test: 'bun --bun vitest run',
  },
}

// DOM-free by default (S2/V2). --dom opts into the web platform.
const tsconfig = dom
  ? {
      $schema: 'https://json.schemastore.org/tsconfig',
      extends: `${toRoot}/tsconfig.base.json`,
      compilerOptions: {
        outDir: 'dist',
        lib: ['dom', 'dom.iterable', 'esnext'],
        jsx: 'react-jsx',
        types: ['bun-types', '@types/react'],
      },
      // The shared ambient d.ts makes @testing-library/jest-dom matchers visible
      // to tsc (they are registered at runtime by vitest.setup.ts).
      include: ['src/**/*', 'test/**/*', '*.config.ts', `${toRoot}/testing-matchers.d.ts`],
    }
  : {
      $schema: 'https://json.schemastore.org/tsconfig',
      extends: `${toRoot}/tsconfig.base.json`,
      compilerOptions: { outDir: 'dist' },
      include: ['src/**/*', 'test/**/*', '*.config.ts'],
    }

const smokeTest = `import { expect, it } from 'vitest'

it('${pkgName} smoke test', () => {
  expect(true).toBe(true)
})
`

const claudeMd = `# ${target} — \`${pkgName}\`

${description ?? 'TODO: one paragraph — role, who may import it, and its import boundaries.'}

- **May import:** TODO
- **Imported by:** TODO
`

await mkdir(join(dir, 'src'), { recursive: true })
await mkdir(join(dir, 'test'), { recursive: true })
await writeFile(join(dir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
await writeFile(join(dir, 'tsconfig.json'), `${JSON.stringify(tsconfig, null, 2)}\n`)
await writeFile(join(dir, 'vitest.config.ts'), `export { default } from '${toRoot}/vitest.base'\n`)
await writeFile(join(dir, 'src', 'index.ts'), 'export {}\n')
await writeFile(join(dir, 'test', 'smoke.test.ts'), smokeTest)
await writeFile(join(dir, 'CLAUDE.md'), claudeMd)

console.log(`Scaffolded ${pkgName} at ${target}${dom ? ' (DOM-enabled)' : ' (DOM-free spine)'}.`)
console.log('Next: add deps via catalog:<group> / workspace:*, then run `bun install`.')
