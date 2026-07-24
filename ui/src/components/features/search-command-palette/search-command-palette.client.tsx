'use client'

import type { ReactNode } from 'react'
import type { SearchWordView } from '../../../views/search.view'
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
} from '../../organisms/command-palette'
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
}

/**
 * One palette row, tagged by `entity` — an app command or a library word. The same
 * shape the palette takes in `items` and hands back in `onSelect`, so the caller
 * builds a mixed list and reads the pick off one discriminant.
 */
export type PaletteItem =
  | { entity: 'action'; action: CommandAction }
  | { entity: 'word'; word: SearchWordView }

type ActionItem = Extract<PaletteItem, { entity: 'action' }>
type WordItem = Extract<PaletteItem, { entity: 'word' }>

export type SearchCommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Controlled — the caller owns it, ready to forward to a backend word search. */
  query: string
  onQueryChange: (query: string) => void
  /** The mixed row list; the palette splits it into the `Actions` + `Words` groups. */
  items: readonly PaletteItem[]
  /**
   * A row was chosen. The palette reports WHICH item was picked and does nothing else —
   * the caller decides whether to close, clear the query, navigate, or run a command.
   */
  onSelect: (item: PaletteItem) => void
}

/**
 * The app's ⌘K palette: a concrete {@link CommandPalette} that lists library words
 * and app commands side by side. It splits `items` by `entity` into the `Actions` +
 * `Words` groups and reports the pick via `onSelect`; it owns no behaviour — `query`
 * stays lifted and the selection is the caller's to act on. cmdk fuzzy-filters both.
 */
export function SearchCommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  items,
  onSelect,
}: SearchCommandPaletteProps) {
  const actions = items.filter((item): item is ActionItem => item.entity === 'action')
  const words = items.filter((item): item is WordItem => item.entity === 'word')

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
          {actions.map((item) => (
            <CommandPaletteItem
              key={item.action.id}
              value={item.action.id}
              keywords={item.action.keywords}
              forceMount={item.action.forceMount}
              icon={item.action.icon}
              description={item.action.description}
              onSelect={() => onSelect(item)}
            >
              {item.action.label}
            </CommandPaletteItem>
          ))}
        </CommandPaletteGroup>
      )}
      {words.length > 0 && (
        <CommandPaletteGroup heading="Words">
          {words.map((item) => (
            <WordCommandItem
              key={item.word.href}
              word={item.word}
              onSelect={() => onSelect(item)}
            />
          ))}
        </CommandPaletteGroup>
      )}
    </CommandPalette>
  )
}
