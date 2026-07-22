import base from '@kotodama/presets/vitest.base'
import { mergeConfig } from 'vitest/config'

// Each leaf lives in its own folder (`api-client/`, `config/`), so tests sit at
// `<leaf>/test/**` — one level below the base's `test/**`.
export default mergeConfig(base, {
  test: { include: ['*/test/**/*.test.ts', '*/test/**/*.test.tsx'] },
})
