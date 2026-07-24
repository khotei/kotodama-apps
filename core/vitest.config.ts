import base from '@kotodama/tooling/vitest.base'
import { mergeConfig } from 'vitest/config'

// The aggregate holds each layer in its own folder (`repositories/`, `store/`),
// so tests sit at `<layer>/test/**` — one level deeper than the base's `test/**`.
export default mergeConfig(base, {
  test: { include: ['*/test/**/*.test.ts', '*/test/**/*.test.tsx'] },
})
