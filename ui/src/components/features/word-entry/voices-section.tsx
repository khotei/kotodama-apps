import { cva } from 'class-variance-authority'
import type { WordEntryContent } from '../../../views/word.view'
import { ImageSlot } from '../../atoms/image-slot'
import { WordSection } from './word-section'

const provenancePill = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-[3px] font-mono text-[9.5px] uppercase leading-none tracking-[0.12em]',
  {
    variants: {
      kind: {
        ai: 'bg-tier-cultural/10 text-tier-cultural',
        quote: 'bg-success-subtle text-success',
      },
    },
  },
)

function ProvenancePill({ kind }: { kind: 'ai' | 'quote' }) {
  return (
    <span className={provenancePill({ kind })}>
      <span className="size-[5px] rounded-full bg-current" />{' '}
      {kind === 'ai' ? 'AI · in style' : 'quote'}
    </span>
  )
}

export type VoicesSectionProps = { voices: WordEntryContent['authorExamples'] }

/** In the words of writers — author quote cards; renders nothing when empty. */
export function VoicesSection({ voices }: VoicesSectionProps) {
  if (voices.length === 0) return null
  return (
    <WordSection id="sec-voices" label="In the words of writers" meta={`${voices.length} passages`}>
      <div className="mt-5 grid grid-cols-1 gap-[18px] md:grid-cols-2">
        {voices.map((voice) => (
          <div
            key={`${voice.author}-${voice.quote.slice(0, 16)}`}
            className="relative flex flex-col rounded-sm border border-border bg-card px-6 pt-[22px] pb-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-border-subtle border-b pb-4">
              <ImageSlot shape="circle" className="size-11" />
              <span className="mr-auto min-w-0 flex-1 basis-[90px]">
                <span className="block truncate font-sans font-semibold text-[13px]">
                  {voice.author}
                </span>
                <span className="block truncate font-mono text-[10px] text-subtle-foreground tracking-[0.04em]">
                  {voice.isGenerated ? 'AI · written in the style of' : voice.work}
                </span>
              </span>
              <ProvenancePill kind={voice.isGenerated ? 'ai' : 'quote'} />
            </div>
            <blockquote className="mt-4 border-none p-0 font-serif text-[20px] italic leading-[1.5]">
              {voice.quote}
            </blockquote>
          </div>
        ))}
      </div>
    </WordSection>
  )
}
