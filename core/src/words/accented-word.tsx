/** A word with an optionally stressed syllable — `mari·po·sa` → pre/stress/post. */
export type AccentedWord = {
  pre: string
  stress?: string
  post?: string
}

export function accentedWordText({ pre, stress = '', post = '' }: AccentedWord) {
  return `${pre}${stress}${post}`
}

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
