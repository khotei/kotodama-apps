import base from '@kotodama/presets/vitest.base'
import { mergeConfig } from 'vitest/config'

// The api-client / metadata factories read the validated serverEnv() (no silent
// defaults), so tests must supply the vars the app would get from .env.
export default mergeConfig(base, {
  test: {
    // The library-only shell carries no unit tests of its own — its presentation
    // is covered by ui's Storybook — so an empty run is success, not failure.
    passWithNoTests: true,
    env: {
      KOTODAMA_API_URL: 'http://localhost:3000',
      KOTODAMA_SITE_URL: 'http://localhost:4000',
    },
  },
})
