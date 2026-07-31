import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

/** How the word reads by lifecycle: ink (ready), dimmed (waiting), shimmering (arriving). */
export type WordRowTone = 'default' | 'muted' | 'shimmer'

const WORD_TONE: Record<WordRowTone, string> = {
  default: 'text-foreground group-hover:text-seal',
  muted: 'text-muted-foreground group-hover:text-foreground',
  shimmer:
    'bg-[linear-gradient(100deg,var(--muted-foreground)_34%,var(--seal)_50%,var(--muted-foreground)_66%)] bg-[length:220%_100%] bg-clip-text text-transparent animate-[kdm-rk-shimmer_2.6s_linear_infinite]',
}

export type WordRowProps = ComponentProps<'div'>

/**
 * A word list row, assembled from its parts — `WordRow.Lead` (ordinal or status
 * dot), `WordRow.Main` (the linked `Word` + an optional `Gloss` or `Note`
 * sub-line) and `WordRow.Meta`. Compose only the pieces a row needs.
 *
 * The root is `relative` and `Word` stretches its anchor over it
 * (`after:inset-0`) instead of wrapping the row — so an interactive `Meta`
 * control (Retry) stays clickable above the overlay. Parts carry explicit
 * `col-start-*`, so omitting `Lead` or `Meta` never shifts the other cells.
 */
function WordRowRoot({ className, ...props }: WordRowProps) {
  return (
    <div
      className={cn(
        'group relative grid grid-cols-[30px_1fr_auto] items-center gap-md rounded-sm px-xs py-md transition-colors hover:bg-card',
        className,
      )}
      {...props}
    />
  )
}

function Lead({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'col-start-1 flex items-center font-mono text-sm text-faint-foreground tracking-wider',
        className,
      )}
      {...props}
    />
  )
}

function Main({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('col-start-2 min-w-0', className)} {...props} />
}

export type WordRowWordProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  tone?: WordRowTone
  children: ReactNode
}

function Word({ tone = 'default', className, ...props }: WordRowWordProps) {
  return (
    <Link
      className={cn(
        'font-serif text-xl font-medium leading-[1.1] tracking-tight transition-colors after:absolute after:inset-0',
        WORD_TONE[tone],
        className,
      )}
      {...props}
    />
  )
}

function Gloss({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'mt-0.5 block font-serif text-base text-muted-foreground italic leading-snug',
        className,
      )}
      {...props}
    />
  )
}

function Note({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'mt-2xs block whitespace-nowrap font-mono text-xs text-faint-foreground uppercase tracking-widest',
        className,
      )}
      {...props}
    />
  )
}

function Meta({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('col-start-3 relative flex shrink-0 items-center gap-md', className)}
      {...props}
    />
  )
}

WordRowRoot.displayName = 'WordRow'
Lead.displayName = 'WordRow.Lead'
Main.displayName = 'WordRow.Main'
Word.displayName = 'WordRow.Word'
Gloss.displayName = 'WordRow.Gloss'
Note.displayName = 'WordRow.Note'
Meta.displayName = 'WordRow.Meta'

export const WordRow = Object.assign(WordRowRoot, { Lead, Main, Word, Gloss, Note, Meta })
