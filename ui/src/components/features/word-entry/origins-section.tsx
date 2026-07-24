import type { WordEntryContent } from '../../../views/word.view'
import { Overline } from '../../atoms/overline'
import { EtymologyTimeline } from '../../core/etymology-timeline'
import { WordSection } from './word-section'

export type OriginsSectionProps = {
  etymology: WordEntryContent['etymology']
  culturalGuide: WordEntryContent['culturalGuide']
}

/** Origins & currents — etymology descent + the cultural timeline, notes, forecast. */
export function OriginsSection({ etymology, culturalGuide }: OriginsSectionProps) {
  const etymologySteps = [
    { when: 'origin', form: etymology.origin.from, note: etymology.origin.gloss },
    ...etymology.descent.map((step) => ({
      when: step.when,
      form: step.form,
      note: `${step.languageName} · ${step.gloss}`,
    })),
  ]

  return (
    <WordSection
      id="sec-origins"
      label="Origins & currents"
      meta="where it comes from · where it’s going"
    >
      <div className="mt-5">
        <Overline>Etymology</Overline>
        <p className="mt-4 max-w-[640px] font-serif text-lg leading-[1.72]">{etymology.summary}</p>
        <EtymologyTimeline steps={etymologySteps} className="mt-6" />
      </div>
      {culturalGuide.timeline.length > 0 && (
        <div className="mt-10 border-border-subtle border-t pt-8">
          <Overline>Cultural currents</Overline>
          <EtymologyTimeline
            steps={culturalGuide.timeline.map((step) => ({ when: step.date, note: step.text }))}
            className="mt-5"
          />
          {culturalGuide.notes.length > 0 && (
            <ul className="mt-6 flex list-none flex-col gap-[11px] p-0">
              {culturalGuide.notes.map((note) => (
                <li
                  key={note}
                  className="relative pl-[22px] font-serif text-[16.5px] text-muted-foreground leading-[1.55] before:absolute before:top-[-2px] before:left-[6px] before:text-seal before:content-['·']"
                >
                  {note}
                </li>
              ))}
            </ul>
          )}
          {culturalGuide.forecast2030 != null && (
            <div className="mt-6 rounded-r-lg border border-seal-line border-l-[3px] border-l-seal bg-seal/[0.06] px-5 py-[18px]">
              <Overline>Forecast · where it’s heading</Overline>
              <p className="mt-3 font-serif text-[16.5px] leading-[1.6]">
                {culturalGuide.forecast2030}
              </p>
            </div>
          )}
        </div>
      )}
    </WordSection>
  )
}
