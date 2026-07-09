import { SearchIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type SearchBoxProps = ComponentProps<'input'> & {
  /** Trailing controls — a submit Button, a clear icon Button. */
  actions?: ReactNode
}

/**
 * The search-box composition: a bordered `--card` container carrying a search
 * icon, a borderless input and trailing actions; the focus ring sits on the
 * container (`focus-within`), not the input.
 */
export function SearchBox({ actions, className, ...props }: SearchBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border border-input bg-card py-2 pr-2 pl-3.5 shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        className,
      )}
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        {...props}
      />
      {actions}
    </div>
  )
}
