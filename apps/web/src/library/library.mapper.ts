import type { Language, Library, ReadyListWord, WordListItem } from '@kotodama/core/words'
import { formatDayMonth, formatRelative } from '@kotodama/platform/dates'
import { languageName } from '@kotodama/platform/languages'
import type { LibraryView, RankedWordView, WotdView } from '@kotodama/ui'
import { DEFAULT_LANGUAGE } from '../language/language'
import { capitalize } from '../utils/text'
import { wordHref } from '../words/hrefs'
import { unreadyStatusNote } from '../words/status-note'

// The render-tier mapper — the ONLY place the wire vocabulary meets the ui
// vocabulary. Pure: time is injected, locale work comes from the platform Intl
// leaves, so the unit tests (this file's locus) pin every derivation.

function rankedFromItem(item: WordListItem, language: Language, now: Date): RankedWordView {
  if (item.kind === 'ready') {
    return {
      href: wordHref(language, item.word.word),
      word: { pre: item.word.word },
      gloss: item.word.coreDefinition,
      pos: item.word.lexical.partOfSpeech,
      when: formatRelative(item.word.createdAt, now, DEFAULT_LANGUAGE),
      status: 'succeeded',
      saved: false,
    }
  }
  return {
    href: wordHref(item.language, item.word),
    word: { pre: item.word },
    when: formatRelative(item.createdAt, now, DEFAULT_LANGUAGE),
    status: item.status,
    saved: false,
    statusNote: unreadyStatusNote(item),
  }
}

function wotdFromWord(word: ReadyListWord, language: Language): WotdView {
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

/** The unused-word invite rail: unique ready words across the rails, capped at 6. */
function tryWordsFrom(model: Library, language: Language) {
  const names = [
    ...model.wotd.map((w) => w.word),
    ...model.mostLooked.flatMap((i) => (i.kind === 'ready' ? [i.word.word] : [])),
    ...model.recent.flatMap((i) => (i.kind === 'ready' ? [i.word.word] : [])),
  ]
  return [...new Set(names)].slice(0, 6).map((word) => ({ word, href: wordHref(language, word) }))
}

/**
 * Map the domain {@link Library} into ui's `LibraryView` — wire vocabulary in,
 * presentation vocabulary out. Pure: `now` is injected (relative "when" labels),
 * `language` names the catalogue being browsed. The auth-gated "saved" surface
 * is omitted throughout (`saved: false`, no saved-count tile) until auth lands.
 */
export function libraryViewFromModel(
  model: Library,
  { language, now }: { language: Language; now: Date },
): LibraryView {
  const studyLanguage = capitalize(languageName(language))
  return {
    languageName: studyLanguage,
    stats: [
      { value: String(model.counts.succeeded), label: 'words in the library' },
      { value: String(model.counts.pending + model.counts.running), label: 'being written now' },
      { value: studyLanguage, label: 'your study language' },
    ],
    tryWords: tryWordsFrom(model, language),
    wordsOfTheDay: model.wotd.slice(0, 4).map((w) => wotdFromWord(w, language)),
    mostLookedUp: model.mostLooked.map((i) => rankedFromItem(i, language, now)),
    recentlyAdded: model.recent.map((i) => rankedFromItem(i, language, now)),
  }
}
