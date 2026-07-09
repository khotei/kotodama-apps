import { ArrowRightIcon, BookmarkIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { StatusBadge, type WordStatus } from '../status-badge'
import { Badge } from '../ui/badge'

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
        'group flex items-center gap-3.5 border-border border-b px-2.5 py-[17px] transition-colors hover:bg-accent',
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-xl leading-tight">{word}</span>
          {ready && ipa != null && (
            <span className="hidden font-mono text-[12.5px] text-muted-foreground md:inline">
              {ipa}
            </span>
          )}
          {pos != null && (
            <Badge variant="outline" className="font-mono text-[10.5px]">
              {pos}
            </Badge>
          )}
        </span>
        {ready && gloss != null && (
          <span className="mt-1 block font-serif text-[14.5px] text-muted-foreground italic">
            {gloss}
          </span>
        )}
        {!ready && statusNote != null && (
          <span className="mt-1 block font-mono text-[11.5px] text-muted-foreground">
            {statusNote}
          </span>
        )}
      </span>
      {!ready && <StatusBadge status={status} />}
      {saved && <BookmarkIcon className="size-4 fill-primary text-primary" />}
      <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}
