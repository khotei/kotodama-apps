import { makeUnreadySearchItem, makeWord, makeWordCounts } from '@kotodama/core/factories'
import { describe, expect, it } from 'vitest'
import type { LibraryAggregation } from '../../app/(public)/server/library.loaders'
import { libraryViewFromModel } from '../../src/library/library.mapper'

const NOW = new Date('2026-07-27T12:00:00Z')
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000).toISOString()

const model = (over: Partial<LibraryAggregation> = {}): LibraryAggregation => ({
  counts: makeWordCounts({ total: 15, pending: 2, running: 1, succeeded: 12, failed: 0 }),
  recent: [],
  mostLooked: [],
  wotd: [],
  tryWords: [],
  ...over,
})

describe('libraryViewFromModel · stats (AC-2, AC-12)', () => {
  it('derives three tiles from live counts + language — no auth-gated "saved" tile', () => {
    const view = libraryViewFromModel(model(), { language: 'es', now: NOW })

    expect(view.stats).toHaveLength(3)
    expect(view.stats[0]).toEqual({ value: '12', label: 'words ready to read' })
    expect(view.stats[1]).toEqual({ value: '3', label: 'taking shape now' })
    expect(view.stats[2]).toEqual({ value: 'Español', label: 'your study language' })
    expect(view.languageName).toBe('Español')
    for (const stat of view.stats) {
      expect(stat.label).not.toMatch(/saved/i)
    }
  })
})

describe('libraryViewFromModel · word of the day (AC-4)', () => {
  it('maps each ready word off inline content — no fabricated stress, real hrefs', () => {
    const words = Array.from({ length: 4 }, (_, i) => makeWord({ word: `palabra${i}` }))

    const view = libraryViewFromModel(model({ wotd: words }), {
      language: 'es',
      now: NOW,
    })

    expect(view.wordsOfTheDay).toHaveLength(4)
    const [first] = view.wordsOfTheDay
    expect(first?.word).toEqual({ pre: 'palabra0' })
    expect(first?.entryHref).toBe('/words/es/palabra0')
    expect(first?.speechLang).toBe('es')
    expect(first?.gloss).toBe(words[0]?.coreDefinition)
    expect(first?.saved).toBe(false)
  })
})

describe('libraryViewFromModel · ranked rows (AC-10)', () => {
  it('maps a ready item to a ready row: gloss from content, relative when, no statusNote', () => {
    const ready = makeWord({ word: 'lumen', createdAt: minutesAgo(2) })

    const view = libraryViewFromModel(model({ mostLooked: [ready] }), {
      language: 'es',
      now: NOW,
    })

    expect(view.mostLookedUp).toHaveLength(1)
    expect(view.mostLookedUp[0]).toMatchObject({
      href: '/words/es/lumen',
      word: { pre: 'lumen' },
      gloss: ready.coreDefinition,
      when: '2 minutes ago',
      status: 'succeeded',
      saved: false,
    })
    expect(view.mostLookedUp[0]?.statusNote).toBeUndefined()
  })

  it.each([
    ['running', 'arriving'],
    ['pending', 'queued'],
    ['failed', 'didn’t settle'],
  ] as const)('passes wire %s through untranslated, with a "%s" note', (wire, note) => {
    const item = makeUnreadySearchItem(wire, {
      word: 'bruma',
      language: 'es',
      createdAt: minutesAgo(90),
    })

    const view = libraryViewFromModel(model({ recent: [item] }), {
      language: 'es',
      now: NOW,
    })

    expect(view.recentlyAdded[0]).toMatchObject({
      status: wire,
      statusNote: `Spanish · ${note}`,
      when: '1 hour ago',
    })
    expect(view.recentlyAdded[0]?.gloss).toBeUndefined()
  })
})

describe('libraryViewFromModel · try words', () => {
  it('maps the invite rail straight from the aggregate — word text + real href', () => {
    const words = [makeWord({ word: 'compartida' }), makeWord({ word: 'una' })]

    const view = libraryViewFromModel(model({ tryWords: words }), {
      language: 'es',
      now: NOW,
    })

    expect(view.tryWords.map((t) => t.word)).toEqual(['compartida', 'una'])
    expect(view.tryWords[0]?.href).toBe('/words/es/compartida')
  })
})
