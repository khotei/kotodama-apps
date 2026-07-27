import { makeUnreadySearchItem, makeWord, makeWordCounts } from '@kotodama/core/factories'
import { narrowLibrary } from '@kotodama/core/words'
import { describe, expect, it } from 'vitest'
import { libraryViewFromModel } from '../../src/library/library.mapper'

// The wire envelope type, derived off narrowLibrary — apps/web test code may not
// import core/repositories (src/server only), and it needs no more than this.
type SearchEnvelope = Parameters<typeof narrowLibrary>[0]['recent']

const envelope = (items: SearchEnvelope['items']): SearchEnvelope => ({
  items,
  pagination: { page: 1, limit: 6, total: items.length, pageCount: 1 },
})

const NOW = new Date('2026-07-27T12:00:00Z')
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000).toISOString()

const model = (over: Partial<Parameters<typeof narrowLibrary>[0]> = {}) =>
  narrowLibrary({
    counts: makeWordCounts({ total: 15, pending: 2, running: 1, succeeded: 12, failed: 0 }),
    recent: envelope([]),
    mostLooked: envelope([]),
    wotd: envelope([]),
    ...over,
  })

describe('libraryViewFromModel · stats (AC-2, AC-12)', () => {
  it('derives three tiles from live counts + language — no auth-gated "saved" tile', () => {
    const view = libraryViewFromModel(model(), { language: 'es', now: NOW })

    expect(view.stats).toHaveLength(3)
    expect(view.stats[0]).toEqual({ value: '12', label: 'words in the library' })
    expect(view.stats[1]).toEqual({ value: '3', label: 'being written now' })
    expect(view.stats[2]).toEqual({ value: 'Español', label: 'your study language' })
    for (const stat of view.stats) {
      expect(stat.label).not.toMatch(/saved/i)
    }
  })
})

describe('libraryViewFromModel · word of the day (AC-4)', () => {
  it('maps the first 4 ready words off inline content — no fabricated stress, real hrefs', () => {
    const words = Array.from({ length: 5 }, (_, i) => makeWord({ word: `palabra${i}` }))

    const view = libraryViewFromModel(model({ wotd: envelope(words) }), {
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

    const view = libraryViewFromModel(model({ mostLooked: envelope([ready]) }), {
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

    const view = libraryViewFromModel(model({ recent: envelope([item]) }), {
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
  it('samples unique ready words across wotd + mostLookedUp, capped at 6', () => {
    const shared = makeWord({ word: 'compartida' })
    const wotd = [shared, makeWord({ word: 'una' })]
    const looked = [shared, ...Array.from({ length: 6 }, (_, i) => makeWord({ word: `otra${i}` }))]

    const view = libraryViewFromModel(
      model({ wotd: envelope(wotd), mostLooked: envelope(looked) }),
      { language: 'es', now: NOW },
    )

    const names = view.tryWords.map((t) => t.word)
    expect(names).toHaveLength(6)
    expect(new Set(names).size).toBe(6)
    expect(names).toContain('compartida')
    expect(view.tryWords[0]?.href).toBe('/words/es/compartida')
  })
})
