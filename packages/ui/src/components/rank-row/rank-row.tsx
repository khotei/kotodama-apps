import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type RankRowProps = Omit<ComponentProps<'a'>, 'children'> & {
  index?: ReactNode
  word: ReactNode
  gloss?: ReactNode
  /** Mono line in the gloss position for a non-ready row — `Spanish · arriving`. */
  note?: ReactNode
  /** Right-side meta — a pos Badge + mono timestamp, a StatusBadge, a Retry button… */
  meta?: ReactNode
}

/** A ranked reading-room row: mono index · serif word · italic gloss · meta. */
export function RankRow({ index, word, gloss, note, meta, className, ...props }: RankRowProps) {
  return (
    <a
      className={cn(
        'flex items-center gap-3.5 border-border border-b px-1 py-[13px] transition-colors hover:bg-accent',
        className,
      )}
      {...props}
    >
      {index != null && (
        <span className="w-6 shrink-0 font-mono text-[11px] text-muted-foreground">{index}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="font-serif text-[17.5px] leading-tight">{word}</span>
        {gloss != null && (
          <span className="ml-3 hidden font-serif text-[14px] text-muted-foreground italic md:inline">
            {gloss}
          </span>
        )}
        {note != null && (
          <span className="ml-3 hidden font-mono text-[11.5px] text-muted-foreground md:inline">
            {note}
          </span>
        )}
      </span>
      {meta != null && <span className="flex shrink-0 items-center gap-2.5">{meta}</span>}
    </a>
  )
}
