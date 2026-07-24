import { describe, expect, it } from 'vitest'
import { radius, semantic, space } from '../src/index'

// The token VALUES are trusted data (a Style-Dictionary build would be noise to
// snapshot); this only guards the semantic CONTRACT — the intent names every
// consumer and a future native `ui` bind against.
describe('semantic token contract', () => {
  it('exposes the bg / fg / border / accent intents', () => {
    expect(semantic.bg.canvas).toMatch(/^#/)
    expect(semantic.fg.default).toMatch(/^#/)
    expect(semantic.border.subtle).toMatch(/^#/)
    expect(semantic.accent.default).toMatch(/^#/)
  })

  it('exposes the space + radius scales', () => {
    expect(space.md).toBe('1rem')
    expect(radius.lg).toBe('0.75rem')
  })
})
