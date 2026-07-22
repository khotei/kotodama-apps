import type { WordStateEntity } from '@kotodama/core/repositories'
import { describe, expect, it } from 'vitest'
import { narrowWordState } from '../../src/words/word-state.model'

// narrowWordState only reads `status`, `word`, `stages`, so the fixtures carry
// just those — cast to the wire type (the generated type guards the shape at
// compile time; these prove the runtime branch selection).
const succeeded = {
  status: 'succeeded',
  word: { word: 'lumen', language: 'en', status: 'succeeded' },
} as unknown as WordStateEntity

const building = (status: 'pending' | 'running' | 'failed') =>
  ({ status, stages: { definition: status } }) as unknown as WordStateEntity

describe('narrowWordState', () => {
  it('routes a succeeded state to the ready branch, carrying the word', () => {
    const result = narrowWordState(succeeded)

    expect(result.kind).toBe('ready')
    // Discriminated access — only reachable in the ready branch.
    if (result.kind !== 'ready') throw new Error('expected ready')
    expect(result.word.word).toBe('lumen')
  })

  it.each([
    'pending',
    'running',
    'failed',
  ] as const)('routes a %s state to the unready branch, carrying stages', (status) => {
    const result = narrowWordState(building(status))

    expect(result.kind).toBe('unready')
    if (result.kind !== 'unready') throw new Error('expected unready')
    expect(result.status).toBe(status)
    expect(result.stages).toBeDefined()
  })
})
