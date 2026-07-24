import { describe, expect, it } from 'vitest'
import { system } from '../src/index'

// fe-theme is a Chakra config object with no logic, so this is a smoke test: the
// system builds and carries the semantic tokens fe-tokens fed it. Real visual
// coverage is the Storybook story (fe-ui).
describe('theme system', () => {
  it('builds a Chakra system exposing the semantic color tokens', () => {
    expect(system).toBeDefined()
    const token = system.token('colors.accent.default')
    expect(token).toBeTruthy()
  })
})
