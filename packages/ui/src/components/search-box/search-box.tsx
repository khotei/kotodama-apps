import { SearchIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type SearchBoxProps = ComponentProps<'input'> & {
  /** Trailing controls — a submit Button, a clear icon Button. */
  actions?: ReactNode
  /** Hide the native search ✕ — pass only when the box renders its own clear. */
  hideNativeClear?: boolean
}

/**
 * The search-box composition: a pill `--elevated` container carrying a search
 * icon, a borderless serif input and trailing actions; the focus treatment sits
 * on the container (`focus-within`), not the input.
 */
export function SearchBox({
  actions,
  className,
  hideNativeClear = false,
  ...props
}: SearchBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-[14px] rounded-full border border-border-strong bg-popover py-[10px] pr-[10px] pl-[22px] shadow-soft transition-[border-color] focus-within:border-foreground',
        className,
      )}
    >
      <SearchIcon className="size-[18px] shrink-0 text-subtle-foreground" />
      <input
        type="search"
        className={cn(
          'min-w-0 flex-1 border-none bg-transparent font-serif text-[21px] text-foreground outline-none placeholder:text-subtle-foreground placeholder:italic [&::-webkit-search-decoration]:hidden',
          hideNativeClear && '[&::-webkit-search-cancel-button]:hidden',
        )}
        {...props}
      />
      {actions}
    </div>
  )
}
