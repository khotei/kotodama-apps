import type { WordEntryContent } from '../../../views/word.view'
import { WordSection } from './word-section'

export type SourcesSectionProps = { sources: WordEntryContent['sources'] }

/** Sources — the numbered citation list grounding the entry. */
export function SourcesSection({ sources }: SourcesSectionProps) {
  return (
    <WordSection id="sec-sources" label="Sources" meta="grounded · cited">
      <p className="mt-4 mb-[18px] max-w-[64ch] font-serif font-light text-[16px] text-muted-foreground leading-[1.6]">
        Every fact here is grounded in a source below. Kotodama writes the tone and the examples —
        never the facts.
      </p>
      <ol className="list-none p-0">
        {sources.map((source) => (
          <li
            key={`${source.index}`}
            className="grid grid-cols-[36px_1fr_auto] items-baseline gap-[14px] border-border border-b border-dotted py-3"
          >
            <span className="font-mono text-[12px] text-seal">
              [{String(source.index).padStart(2, '0')}]
            </span>
            <span className="font-serif text-[16px] leading-[1.4]">{source.title}</span>
            <span className="whitespace-nowrap font-mono text-[10.5px] text-subtle-foreground tracking-[0.04em]">
              {source.type}
            </span>
          </li>
        ))}
      </ol>
    </WordSection>
  )
}
