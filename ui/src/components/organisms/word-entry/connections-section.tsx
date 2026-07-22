import { Overline } from '@kotodama/ui'
import { languageName } from '../../../lib/language-name'
import type { WordEntryContent } from '../../../views/word.view'
import { WordSection } from './word-section'

function TermList({
  heading,
  items,
}: {
  heading: string
  items: readonly { term: string; note?: string }[]
}) {
  return (
    <div>
      <Overline>{heading}</Overline>
      <div className="mt-3">
        {items.map((item) => (
          <span
            key={item.term}
            className="flex items-baseline gap-4 border-border-subtle border-b py-[14px]"
          >
            <span className="min-w-[170px] font-serif text-[21px] tracking-[-0.01em]">
              {item.term}
            </span>
            {item.note != null && (
              <span className="min-w-0 flex-1 truncate font-serif text-[16px] text-muted-foreground italic">
                {item.note}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export type ConnectionsSectionProps = {
  relations: WordEntryContent['relations']
  translations: WordEntryContent['translations']
}

/** Connections — synonyms, the word family, and translations across languages. */
export function ConnectionsSection({ relations, translations }: ConnectionsSectionProps) {
  return (
    <WordSection id="sec-connections" label="Connections" meta="related words · across languages">
      <div className="mt-5 grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2">
        <TermList heading="Near in meaning" items={relations.synonyms} />
        <TermList heading="Word family" items={relations.family.map((term) => ({ term }))} />
      </div>
      {translations.length > 0 && (
        <div className="mt-10">
          <Overline>Across languages</Overline>
          <div className="mt-3 grid md:grid-cols-2 md:gap-x-10">
            {translations.map((translation) => (
              <span
                key={translation.language}
                className="flex items-baseline gap-[18px] border-border-subtle border-b py-[13px]"
              >
                <span className="w-[130px] shrink-0 font-sans font-semibold text-[12.5px] text-subtle-foreground tracking-[0.04em]">
                  {languageName(translation.language)}
                </span>
                <span className="font-serif text-[19px]">{translation.term}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </WordSection>
  )
}
