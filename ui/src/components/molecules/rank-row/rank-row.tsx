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

export type RankRowProps = Omit<ComponentProps<'a'>, 'children'> & {
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
        'group relative grid grid-cols-[30px_1fr_auto] items-center gap-[18px] rounded-sm px-2 py-[15px] transition-colors hover:bg-card',
        className,
      )}
    >
      <span className="flex items-center font-mono text-[13px] text-faint-foreground tracking-[0.06em]">
        {index ?? marker}
      </span>
      <span className="min-w-0">
        <a
          className={cn(
            'font-serif text-[22px] font-medium leading-[1.1] tracking-[-0.01em] transition-colors after:absolute after:inset-0',
            WORD_TONE[wordTone],
          )}
          {...props}
        >
          {word}
        </a>
        {gloss != null && (
          <span className="mt-[3px] block font-serif text-[15px] text-muted-foreground italic leading-snug">
            {gloss}
          </span>
        )}
        {note != null && (
          <span className="mt-[5px] block whitespace-nowrap font-mono text-[11px] text-faint-foreground uppercase tracking-[0.13em]">
            {note}
          </span>
        )}
      </span>
      {meta != null && <span className="relative flex shrink-0 items-center gap-4">{meta}</span>}
    </div>
  )
}
