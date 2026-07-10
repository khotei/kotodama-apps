import type { AccentedWord } from './library.view'

/** Renders the stressed syllable as an upright cinnabar em — the phonetic stress mark. */
export function AccentedWordMark({ word }: { word: AccentedWord }) {
  return (
    <>
      {word.pre}
      {word.stress != null && <em className="text-seal not-italic">{word.stress}</em>}
      {word.post}
    </>
  )
}
