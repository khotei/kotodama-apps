import type { AccentedWord } from './library.view'

/** Renders the stressed syllable as an italic `--primary` em — the brand accent. */
export function AccentedWordMark({ word }: { word: AccentedWord }) {
  return (
    <>
      {word.pre}
      {word.stress != null && <em className="text-primary">{word.stress}</em>}
      {word.post}
    </>
  )
}
