import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

/** How the word reads by lifecycle: ink (ready), dimmed (waiting), shimmering (arriving). */
export type RankWordTone = 'default' | 'muted' | 'shimmer'

const WORD_TONE: Record<RankWordTone, string> = {
  default: 'text-foreground group-hover:text-seal',
  muted: 'text-muted-foreground group-hover:text-foreground',
  shimmer:
    'bg-[linear-gradient(100deg,var(--muted-foreground)_34%,var(--seal)_50%,var(--muted-foreground)_66%)] bg-[length:220%_100%] bg-clip-text text-transparent animate-[kdm-rk-shimmer_2.6s_linear_infinite]',
}

export type RankRowProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  /** Mono ordinal for a ranked list (`01`). Mutually exclusive with `marker`. */
  index?: ReactNode
  /** Status dot for the recent list — occupies the same leading column as `index`. */
  marker?: ReactNode
  word: ReactNode
  wordTone?: RankWordTone
  gloss?: ReactNode
  /** Mono line in the gloss position for a non-ready row — `Spanish · arriving`. */
  note?: ReactNode
  /** Right-side meta — a pos Badge + mono timestamp, a StatusBadge, a Retry button… */
  meta?: ReactNode
}

/**
 * A ranked reading-room row: leading marker · serif word · italic gloss · meta.
 *
 * The row is a `div` with a stretched-link anchor (`after:inset-0`), NOT an
 * `<a>` wrapping everything — `meta` may hold an interactive Retry button, and
 * nesting a button inside an anchor is invalid HTML that hijacks its clicks.
 * `meta` stacks above the overlay via `relative`, so its controls stay live.
 */
export function RankRow({
  index,
  marker,
  word,
  wordTone = 'default',
  gloss,
  note,
  meta,
  className,
  ...props
}: RankRowProps) {
  return (
    <div
      className={cn(
        'group relative grid grid-cols-[30px_1fr_auto] items-center gap-md rounded-sm px-xs py-md transition-colors hover:bg-card',
        className,
      )}
    >
      <span className="flex items-center font-mono text-sm text-faint-foreground tracking-wider">
        {index ?? marker}
      </span>
      <span className="min-w-0">
        <Link
          className={cn(
            'font-serif text-xl font-medium leading-[1.1] tracking-tight transition-colors after:absolute after:inset-0',
            WORD_TONE[wordTone],
          )}
          {...props}
        >
          {word}
        </Link>
        {gloss != null && (
          <span className="mt-0.5 block font-serif text-base text-muted-foreground italic leading-snug">
            {gloss}
          </span>
        )}
        {note != null && (
          <span className="mt-2xs block whitespace-nowrap font-mono text-xs text-faint-foreground uppercase tracking-widest">
            {note}
          </span>
        )}
      </span>
      {meta != null && <span className="relative flex shrink-0 items-center gap-md">{meta}</span>}
    </div>
  )
}
