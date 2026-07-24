import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { WordEntryContent } from '../../../views/word.view'
import { ImageSlot } from '../../atoms/image-slot'
import { Overline } from '../../atoms/overline'
import { Button } from '../../ui/button'
import { WordSection } from './word-section'

function Shot({
  prompt,
  kind,
  caption,
  figureClass,
  imageClass = 'flex-1 min-h-[260px]',
}: {
  prompt: string
  kind: string
  caption?: string
  figureClass?: string
  imageClass?: string
}) {
  return (
    <figure className={cn('m-0 flex flex-col', figureClass)}>
      <ImageSlot label={prompt} className={imageClass} />
      <figcaption className="mt-[11px] font-sans text-[13px] text-muted-foreground leading-[1.5]">
        <span className="mb-[5px] block font-mono text-[10px] text-seal uppercase tracking-[0.1em]">
          {kind}
        </span>
        {caption}
      </figcaption>
    </figure>
  )
}

export type PicturesSectionProps = { visuals: WordEntryContent['visuals'] }

/** In pictures — hero + infographic pair and the meme strip. */
export function PicturesSection({ visuals }: PicturesSectionProps) {
  return (
    <WordSection id="sec-pictures" label="In pictures" meta="drop your own">
      <div className="mt-5 grid grid-cols-1 gap-[22px] md:grid-cols-[1.5fr_1fr]">
        <Shot
          prompt={visuals.hero.prompt}
          kind="Hero"
          caption={visuals.hero.caption ?? visuals.hero.concept}
          imageClass="flex-1 min-h-[320px]"
        />
        <Shot
          prompt={visuals.infographic.prompt}
          kind="Infographic"
          caption={visuals.infographic.caption ?? visuals.infographic.concept}
          imageClass="flex-1 min-h-[280px]"
        />
      </div>
      {visuals.memes.length > 0 && (
        <div className="mt-[30px]">
          <div className="flex items-center justify-between">
            <Overline>Memes · {visuals.memes.length}</Overline>
            <span className="flex gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous memes"
                className="size-[34px] rounded-sm"
                disabled
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next memes"
                className="size-[34px] rounded-sm"
                disabled
              >
                <ArrowRightIcon />
              </Button>
            </span>
          </div>
          <div className="mt-[14px] flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-2.5">
            {visuals.memes.map((meme) => (
              <Shot
                key={meme.imageKey}
                prompt={meme.prompt}
                kind="Meme"
                caption={meme.caption ?? meme.concept}
                figureClass="flex-[0_0_296px] snap-start"
                imageClass="aspect-[4/3] w-full"
              />
            ))}
          </div>
        </div>
      )}
    </WordSection>
  )
}
