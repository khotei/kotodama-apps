import { makeWord } from '@kotodama/core/factories'
import { describe, expect, it } from 'vitest'
import { wotdViewsFrom } from '../../../../../app/(public)/components/word-of-the-day/word-of-the-day.mapper'

describe('wotdViewsFrom (AC-4)', () => {
  it('maps each ready word off inline content — no fabricated stress, real hrefs', () => {
    const words = Array.from({ length: 4 }, (_, i) => makeWord({ word: `palabra${i}` }))

    const views = wotdViewsFrom(words, { language: 'es' })

    expect(views).toHaveLength(4)
    const [first] = views
    expect(first?.word).toEqual({ pre: 'palabra0' })
    expect(first?.entryHref).toBe('/words/es/palabra0')
    expect(first?.speechLang).toBe('es')
    expect(first?.gloss).toBe(words[0]?.coreDefinition)
    expect(first?.saved).toBe(false)
  })

  it('keeps only numeric frequency points and derives ≤4 unique axis ticks', () => {
    const word = makeWord({
      word: 'diafano',
      frequency: {
        band: 'rare',
        series: [
          { year: 1800, value: 1 },
          { year: 1850, value: 'NaN' },
          { year: 1900, value: 3 },
          { year: 1950, value: 4 },
          { year: 2000, value: 5 },
        ],
      },
    })

    const [view] = wotdViewsFrom([word], { language: 'es' })

    expect(view?.frequencySeries).toEqual([1, 3, 4, 5])
    expect(view?.axisLabels).toEqual(['1800', '1850', '1900', '2000'])
  })
})
