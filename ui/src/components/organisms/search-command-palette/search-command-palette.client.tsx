'use client'

import type { ReactNode } from 'react'
import type { SearchWordView } from '../../../views/search.view'
import { CommandPalette, CommandPaletteGroup, CommandPaletteItem } from '../command-palette'
import { WordCommandItem } from './word-command-item.client'

export type CommandAction = {
  /** Stable identity + cmdk match value. */
  id: string
  label: string
  description?: ReactNode
  icon?: ReactNode
  /** Extra match terms — so typing "create word" surfaces "Add a new word". */
  keywords?: string[]
  /** Stay visible even when the query filters it out (an always-offered CTA). */
  forceMount?: boolean
  onSelect: () => void
}

export type SearchCommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Controlled — the caller owns it, ready to forward to a backend word search. */
  query: string
  onQueryChange: (query: string) => void
  actions: readonly CommandAction[]
  words: readonly SearchWordView[]
  onSelectWord: (href: string) => void
}

/**
 * The app's ⌘K palette: a concrete {@link CommandPalette} that runs library words
 * and app commands side by side (the `Actions` + `Words` groups). It maps each
 * datum to a row itself; `query` stays lifted so the caller can drive a backend
 * search off it. cmdk fuzzy-filters both groups by the query.
 */
export function SearchCommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  actions,
  words,
  onSelectWord,
}: SearchCommandPaletteProps) {
  const run = (action: () => void) => {
    onOpenChange(false)
    onQueryChange('')
    action()
  }

  return (
    <CommandPalette
      open={open}
      onOpenChange={onOpenChange}
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search words or jump to…"
      title="Search or jump"
      description="Jump to a word in your library or run a command."
      empty="No matches."
    >
      {actions.length > 0 && (
        <CommandPaletteGroup heading="Actions">
          {actions.map((action) => (
            <CommandPaletteItem
              key={action.id}
              value={action.id}
              keywords={action.keywords}
              forceMount={action.forceMount}
              icon={action.icon}
              description={action.description}
              onSelect={() => run(action.onSelect)}
            >
              {action.label}
            </CommandPaletteItem>
          ))}
        </CommandPaletteGroup>
      )}
      {words.length > 0 && (
        <CommandPaletteGroup heading="Words">
          {words.map((word) => (
            <WordCommandItem
              key={word.href}
              word={word}
              onSelect={() => run(() => onSelectWord(word.href))}
            />
          ))}
        </CommandPaletteGroup>
      )}
    </CommandPalette>
  )
}
