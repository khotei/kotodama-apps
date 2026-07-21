import { ArrowRightIcon, BookmarkIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { StatusBadge, type WordStatus } from '../status-badge'

export type ResultRowProps = Omit<ComponentProps<'a'>, 'children'> & {
  word: ReactNode
  status?: WordStatus
  saved?: boolean
  ipa?: ReactNode
  pos?: ReactNode
  gloss?: ReactNode
  /** Mono line shown in place of ipa/gloss on a non-ready row — `Spanish · arriving`. */
  statusNote?: ReactNode
}

/**
 * A search-results list row; status is first-class — a non-ready row drops
 * ipa/gloss for the statusNote and trades the trailing arrow for its badge.
 */
export function ResultRow({
  word,
  status = 'ready',
  saved = false,
  ipa,
  pos,
  gloss,
  statusNote,
  className,
  ...props
}: ResultRowProps) {
  const ready = status === 'ready'
  return (
    <a
      className={cn(
        'group relative grid grid-cols-[1fr_auto] items-center gap-6 border-border-subtle border-b px-2 py-6 transition-colors hover:bg-card before:absolute before:top-0 before:bottom-[-1px] before:-left-2 before:w-[2px] before:bg-transparent before:transition-colors before:content-[""] hover:before:bg-seal',
        className,
      )}
      {...props}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-[14px] gap-y-1">
          <span
            className={cn(
              'font-serif text-[30px] font-medium leading-[1.05] tracking-[-0.02em]',
              !ready && 'text-muted-foreground',
            )}
          >
            {word}
          </span>
          {ready && ipa != null && (
            <span className="hidden font-mono text-[13px] text-subtle-foreground md:inline">
              {ipa}
            </span>
          )}
          {pos != null && (
            <span className="font-mono text-[11px] text-subtle-foreground">{pos}</span>
          )}
        </span>
        {ready && gloss != null && (
          <span className="mt-2 block font-serif text-[17px] text-muted-foreground italic">
            {gloss}
          </span>
        )}
        {!ready && statusNote != null && (
          <span className="mt-2 block font-mono text-[12px] text-faint-foreground uppercase tracking-[0.13em]">
            {statusNote}
          </span>
        )}
      </span>
      <span className="flex items-center gap-4">
        {!ready && <StatusBadge status={status} />}
        {saved && <BookmarkIcon className="size-4 fill-seal text-seal" />}
        <ArrowRightIcon className="size-4 text-faint-foreground transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}
