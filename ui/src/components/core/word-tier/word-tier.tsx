import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

/** The 4-way register scale — shared lightness/chroma, hue varies (`--tier-*`). */
export type WordTier = 'everyday' | 'cultural' | 'formal' | 'rare'

const TIER_DOT: Record<WordTier, string> = {
  everyday: 'bg-tier-everyday',
  cultural: 'bg-tier-cultural',
  formal: 'bg-tier-formal',
  rare: 'bg-tier-rare',
}

export type WordTierDotProps = ComponentProps<'span'> & { tier: WordTier }

/** The square tier swatch — the register vocabulary as a standalone glyph. */
export function WordTierDot({ tier, className, ...props }: WordTierDotProps) {
  return (
    <span className={cn('inline-block size-2 rounded-xs', TIER_DOT[tier], className)} {...props} />
  )
}
