import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'
import { Chip } from '../../atoms/chip'

/** The 4-way register scale — shared lightness/chroma, hue varies (`--tier-*`). */
export type WordTier = 'everyday' | 'cultural' | 'formal' | 'rare'

const tierChipVariants = cva('', {
  variants: {
    tier: {
      everyday: 'text-tier-everyday',
      cultural: 'text-tier-cultural',
      formal: 'text-tier-formal',
      rare: 'text-tier-rare',
    },
  },
})

const TIER_LABEL: Record<WordTier, string> = {
  everyday: 'Everyday',
  cultural: 'Cultural',
  formal: 'Formal',
  rare: 'Rare',
}

export type TierChipProps = ComponentProps<'span'> & {
  tier: WordTier
}

/** The register pill: {@link Chip} toned to a `tier`, with a dot + tier label. */
export function TierChip({ tier, className, children, ...props }: TierChipProps) {
  return (
    <Chip
      className={cn(tierChipVariants({ tier }), className)}
      leading={<span className="size-1.5 rounded-full bg-current" />}
      {...props}
    >
      {children ?? TIER_LABEL[tier]}
    </Chip>
  )
}

const TIER_DOT: Record<WordTier, string> = {
  everyday: 'bg-tier-everyday',
  cultural: 'bg-tier-cultural',
  formal: 'bg-tier-formal',
  rare: 'bg-tier-rare',
}

export type TierDotProps = ComponentProps<'span'> & { tier: WordTier }

/** The square tier swatch — TierChip's colour vocabulary as a standalone glyph. */
export function TierDot({ tier, className, ...props }: TierDotProps) {
  return (
    <span
      className={cn('inline-block size-[9px] rounded-xs', TIER_DOT[tier], className)}
      {...props}
    />
  )
}
