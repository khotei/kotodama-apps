import { makeSucceededWordState, makeUnreadyWordState } from '@kotodama/core/factories'
import { describe, expect, it } from 'vitest'
import { narrowWordState } from '../src/word-state'

describe('narrowWordState', () => {
  it('routes a succeeded state to the ready branch, carrying the word', () => {
    const state = makeSucceededWordState()

    const result = narrowWordState(state)

    expect(result.kind).toBe('ready')
    // Discriminated access — only reachable in the ready branch.
    if (result.kind !== 'ready') throw new Error('expected ready')
    expect(result.word).toEqual(state.word)
  })

  it.each([
    'pending',
    'running',
    'failed',
  ] as const)('routes a %s state to the unready branch, carrying stages', (status) => {
    const state = makeUnreadyWordState(status)

    const result = narrowWordState(state)

    expect(result.kind).toBe('unready')
    if (result.kind !== 'unready') throw new Error('expected unready')
    expect(result.status).toBe(status)
    expect(result.stages).toEqual(state.stages)
  })
})
