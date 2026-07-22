import { DepthTabs, DepthTabsContent, DepthTabsList, DepthTabsTrigger } from '@kotodama/ui'
import type { WordEntryContent } from '../../../views/word.view'
import { WordSection } from './word-section'

const DEPTHS = [
  { id: 'quick', numeral: 'i', name: 'Quick', sublabel: 'one glance' },
  { id: 'everyday', numeral: 'ii', name: 'Everyday', sublabel: 'how it’s used' },
  { id: 'deep', numeral: 'iii', name: 'Deep', sublabel: 'the nuance' },
  { id: 'cultural', numeral: 'iv', name: 'Cultural', sublabel: 'its weight' },
] as const

export type MeaningSectionProps = { tiers: WordEntryContent['tiers'] }

/** Meaning · four depths — the quick→cultural tier tabs. */
export function MeaningSection({ tiers }: MeaningSectionProps) {
  return (
    <WordSection id="sec-meaning" label="Meaning · four depths" meta="quick → cultural">
      <DepthTabs defaultValue="quick" className="mt-5">
        <DepthTabsList>
          {DEPTHS.map(({ id, numeral, name, sublabel }) => (
            <DepthTabsTrigger
              key={id}
              value={id}
              numeral={numeral}
              name={name}
              sublabel={sublabel}
            />
          ))}
        </DepthTabsList>
        {DEPTHS.map(({ id }) => {
          const tier = tiers[id]
          return (
            <DepthTabsContent key={id} value={id} className="pt-6">
              <h3 className="font-serif font-medium text-[28px] leading-snug tracking-[-0.02em]">
                {tier.title}
              </h3>
              <p className="mt-3 font-serif text-lg leading-[1.72]">{tier.body}</p>
              <ul className="mt-[22px] flex list-none flex-col gap-3 border-border-subtle border-t p-0 pt-[18px]">
                {tier.examples.map((example) => (
                  <li key={example.text} className="flex items-baseline gap-3">
                    <span className="font-serif text-lg italic leading-[1.45] before:mr-1.5 before:text-seal before:not-italic before:content-['—']">
                      {example.text}
                    </span>
                    <span className="ml-auto shrink-0 rounded-full border border-border px-[7px] py-0.5 font-mono text-[9.5px] text-subtle-foreground uppercase tracking-[0.1em]">
                      {example.register}
                    </span>
                  </li>
                ))}
              </ul>
            </DepthTabsContent>
          )
        })}
      </DepthTabs>
    </WordSection>
  )
}
