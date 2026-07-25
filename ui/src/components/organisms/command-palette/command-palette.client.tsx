'use client'

import type { ReactNode } from 'react'
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '../../ui/command'
import { Kbd } from '../../ui/kbd'

export type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Controlled search text — the caller owns it, so it can drive its own result groups. */
  query: string
  onQueryChange: (query: string) => void
  placeholder?: string
  /** sr-only dialog title/description (a11y). */
  title?: string
  description?: string
  /** Shown when no row is visible. */
  empty?: ReactNode
  /**
   * `false` when the caller filters the result set itself off `query` — cmdk then
   * renders exactly the rows passed. Leave unset to use cmdk's built-in fuzzy filter.
   */
  shouldFilter?: boolean
  /** The result rows — compose {@link CommandPaletteGroup} / {@link CommandPaletteItem}. */
  children: ReactNode
}

/**
 * Agnostic ⌘K dialog shell: the frame (dialog + controlled input + list + key
 * hints), with the result rows slotted as children. It owns no data — the caller
 * holds `query` and the result set, so every behaviour (a trailing "generate" row,
 * a domain filter) composes above this frame. Closing clears the query.
 */
export function CommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  placeholder = 'Search…',
  title = 'Command palette',
  description = 'Search or run a command.',
  empty = 'No results.',
  shouldFilter,
  children,
}: CommandPaletteProps) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) onQueryChange('')
      }}
      title={title}
      description={description}
      shouldFilter={shouldFilter}
    >
      <CommandInput placeholder={placeholder} value={query} onValueChange={onQueryChange} />
      <CommandList>
        <CommandEmpty>{empty}</CommandEmpty>
        {children}
      </CommandList>
      <div className="flex items-center gap-md border-border-subtle border-t px-md py-sm font-mono text-2xs text-subtle-foreground tracking-wider">
        <span className="flex items-center gap-xs">
          <Kbd>↑↓</Kbd> navigate
        </span>
        <span className="flex items-center gap-xs">
          <Kbd>↵</Kbd> open
        </span>
        <span className="flex items-center gap-xs">
          <Kbd>esc</Kbd> close
        </span>
      </div>
    </CommandDialog>
  )
}
