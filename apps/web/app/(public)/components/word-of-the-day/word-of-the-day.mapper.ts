import type { Language, ReadyListWord } from '@kotodama/core/words'
import { formatDayMonth } from '@kotodama/platform/dates'
import { languageName } from '@kotodama/platform/languages'
import type { WotdView } from '@kotodama/ui'
import { DEFAULT_LANGUAGE } from '../../../../src/language/language'
import { capitalize } from '../../../../src/utils/text'
import { wordHref } from '../../../../src/words/words-hrefs'

// The word-of-the-day render seam: a ready wire word → ui's WotdView. The one
// non-trivial derivation in the library (frequency series + sparkline axis
// ticks), so it keeps its unit test — the other sections map inline.

function mapWordOfDay(word: ReadyListWord, language: Language): WotdView {
  const year = word.etymology.firstAttested.year
  const series = word.frequency?.series.filter((p) => typeof p.value === 'number') ?? []
  const years = word.frequency?.series.map((p) => p.year).filter((y) => typeof y === 'number') ?? []
  const note = word.frequency?.trendNote ?? word.frequency?.changeNote
  const translations = word.translations.flatMap((t) => [
    { text: ` · ${capitalize(languageName(t.language, DEFAULT_LANGUAGE))} (` },
    { text: t.term, accent: true },
    { text: ')' },
  ])
  return {
    dateTag: formatDayMonth(word.createdAt, DEFAULT_LANGUAGE),
    // No syllable-stress source on the wire — the whole word goes in `pre`,
    // never a fabricated stress split.
    word: { pre: word.word },
    pos: word.lexical.partOfSpeech,
    ipa: word.pronunciation.ipa,
    plural: word.lexical.plural?.primary ?? '—',
    gloss: word.coreDefinition,
    definition: word.tiers.everyday.body,
    entryHref: wordHref(language, word.word),
    saved: false,
    // The bare catalogue code IS a valid BCP-47 tag — the browser picks its
    // best voice. A regional pin (es-ES vs es-MX) would be an invented
    // editorial standard the product doesn't have yet.
    speechLang: language,
    glance: {
      etymology: word.etymology.summary,
      firstAttested:
        typeof year === 'number'
          ? `${year} · ${word.etymology.firstAttested.language}`
          : word.etymology.firstAttested.language || 'uncertain',
      // Every ready word ships all four content depths by contract, so the
      // chip row states exactly that (no per-word depth signal to derive yet).
      tiers: ['rare', 'everyday', 'formal', 'cultural'],
      tiersLabel: 'All four',
      languages: translations.length
        ? [{ text: capitalize(languageName(language, DEFAULT_LANGUAGE)) }, ...translations]
        : capitalize(languageName(language, DEFAULT_LANGUAGE)),
      frequency: word.frequency
        ? [
            { text: capitalize(word.frequency.band) + (note ? ' · ' : '') },
            ...(note ? [{ text: note, accent: true }] : []),
          ]
        : '—',
    },
    frequencySeries: series.map((p) => p.value as number),
    axisLabels:
      years.length >= 2
        ? [0, 1, 2, 3]
            .map((i) => years[Math.floor((i * (years.length - 1)) / 3)])
            .filter((y, i, all) => all.indexOf(y) === i)
            .map(String)
        : [],
  }
}

export function wotdViewsFrom(
  words: readonly ReadyListWord[],
  { language }: { language: Language },
): readonly WotdView[] {
  return words.map((w) => mapWordOfDay(w, language))
}
