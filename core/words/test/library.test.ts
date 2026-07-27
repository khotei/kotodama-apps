import { makeUnreadySearchItem, makeWord, makeWordCounts } from '@kotodama/core/factories'
import type { WordSearchResultEntity } from '@kotodama/core/repositories'
import { describe, expect, it } from 'vitest'
import { narrowLibrary, narrowSearchItem } from '../src/index'

const envelope = (items: WordSearchResultEntity['items']): WordSearchResultEntity => ({
  items,
  pagination: { page: 1, limit: 4, total: items.length, pageCount: 1 },
})

describe('narrowSearchItem', () => {
  it('narrows a succeeded item into the ready arm carrying the full word', () => {
    const word = makeWord({ word: 'lumen' })

    const item = narrowSearchItem(word)

    expect(item).toEqual({ kind: 'ready', word })
  })

  it('narrows an unready item into status + identity + stages', () => {
    const raw = makeUnreadySearchItem('running', { word: 'bruma', language: 'es' })

    const item = narrowSearchItem(raw)

    expect(item).toMatchObject({
      kind: 'unready',
      status: 'running',
      word: 'bruma',
      language: 'es',
      createdAt: raw.createdAt,
    })
    if (item.kind === 'unready') {
      expect(item.stages).toBe(raw.stages)
    }
  })
})

describe('narrowLibrary', () => {
  it('assembles counts + the three narrowed rails in one call', () => {
    const counts = makeWordCounts({ total: 42 })
    const ready = makeWord()
    const unready = makeUnreadySearchItem('pending')

    const library = narrowLibrary({
      counts,
      recent: envelope([ready, unready]),
      mostLooked: envelope([ready]),
      wotd: envelope([ready]),
    })

    expect(library.counts).toBe(counts)
    expect(library.recent.map((item) => item.kind)).toEqual(['ready', 'unready'])
    expect(library.mostLooked).toHaveLength(1)
    expect(library.wotd).toEqual([ready])
  })

  it('drops a non-ready item from the wotd rail — only inline word content renders there', () => {
    const library = narrowLibrary({
      counts: makeWordCounts(),
      recent: envelope([]),
      mostLooked: envelope([]),
      wotd: envelope([makeUnreadySearchItem('failed')]),
    })

    expect(library.wotd).toEqual([])
  })
})
