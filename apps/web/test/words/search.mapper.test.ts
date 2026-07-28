import { makeUnreadySearchItem, makeWord } from '@kotodama/core/factories'
import { narrowSearchItem } from '@kotodama/core/words'
import { describe, expect, it } from 'vitest'
import { mapSearchWord } from '../../src/words/search.mapper'

describe('mapSearchWord', () => {
  it('maps a ready item: real href, gloss from content, createdAt as addedRank', () => {
    const ready = narrowSearchItem(makeWord({ word: 'lumen' }))

    const view = mapSearchWord(ready, 'es')

    expect(view).toMatchObject({
      href: '/words/es/lumen',
      word: 'lumen',
      status: 'succeeded',
      saved: false,
    })
    expect(view.gloss).toBeDefined()
    expect(view.addedRank).toBeGreaterThan(0)
  })

  it('passes an unready wire status through untranslated, with the mono note', () => {
    const item = narrowSearchItem(
      makeUnreadySearchItem('running', { word: 'bruma', language: 'es' }),
    )

    const view = mapSearchWord(item, 'es')

    expect(view).toMatchObject({
      href: '/words/es/bruma',
      word: 'bruma',
      status: 'running',
      statusNote: 'Spanish · arriving',
    })
    expect(view.gloss).toBeUndefined()
  })
})
