import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Badge, type BadgeProps } from '../ui/badge'

/** The 4-way register scale — shared lightness/chroma, hue varies (`--tier-*`). */
export type WordTier = 'everyday' | 'cultural' | 'formal' | 'rare'

const tierChipVariants = cva('rounded-full border bg-transparent font-sans', {
  variants: {
    tier: {
      everyday: 'border-tier-everyday/40 text-tier-everyday',
      cultural: 'border-tier-cultural/40 text-tier-cultural',
      formal: 'border-tier-formal/40 text-tier-formal',
      rare: 'border-tier-rare/40 text-tier-rare',
    },
  },
})

const TIER_LABEL: Record<WordTier, string> = {
  everyday: 'Everyday',
  cultural: 'Cultural',
  formal: 'Formal',
  rare: 'Rare',
}

export type TierChipProps = Omit<BadgeProps, 'variant'> & {
  tier: WordTier
}

export function TierChip({ tier, className, children, ...props }: TierChipProps) {
  return (
    <Badge variant="outline" className={cn(tierChipVariants({ tier }), className)} {...props}>
      <span className="size-1.5 rounded-full bg-current" />
      {children ?? TIER_LABEL[tier]}
    </Badge>
  )
}
