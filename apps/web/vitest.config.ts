import base from '@kotodama/tooling/vitest.base'
import { mergeConfig } from 'vitest/config'

// The api-client / metadata factories read the validated env() (no silent
// defaults), so tests must supply the vars the app would get from .env.
export default mergeConfig(base, {
  test: {
    env: {
      KOTODAMA_API_URL: 'http://localhost:3000',
      KOTODAMA_SITE_URL: 'http://localhost:4000',
    },
  },
})
