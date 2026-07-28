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
  /** Static copy, or derived from the trimmed query — `Add “lumen”`. */
  label: string | ((typed: string) => string)
  description?: ReactNode
  icon?: ReactNode
  /** Extra match terms — so typing "create word" surfaces "Add a new word". */
  keywords?: string[]
  /** Stay visible even when the query filters it out (an always-offered CTA). */
  forceMount?: boolean
  /** The action's own behaviour — run on pick with the trimmed query, after the pick is reported. */
  onSelect?: (typed: string) => void
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
   * A row was chosen — reported BEFORE the action's own `onSelect` runs, so the
   * caller closes/clears first. A word row is report-only: navigation stays the
   * caller's decision.
   */
  onSelect: (item: PaletteItem) => void
}

/**
 * The app's ⌘K palette: a concrete {@link CommandPalette} that lists library words
 * and app commands side by side. It splits `items` by `entity` into the `Actions` +
 * `Words` groups — a `forceMount` action is pinned below them instead — resolves
 * function labels against the trimmed query, and on pick reports via `onSelect`
 * then runs the action's own `onSelect`; `query` stays lifted. cmdk fuzzy-filters
 * the groups.
 */
export function SearchCommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  items,
  onSelect,
}: SearchCommandPaletteProps) {
  const actions = items.filter(
    (item): item is ActionItem => item.entity === 'action' && !item.action.forceMount,
  )
  // The always-offered CTAs render OUTSIDE the filtered groups: cmdk hides a
  // group whose children all filtered out EVEN with a forceMounted child (the
  // row stays keyboard-selectable while invisible), so the pinned group
  // force-mounts itself — and, scoring zero, sorts last: a matched word owns Enter.
  const pinned = items.filter(
    (item): item is ActionItem => item.entity === 'action' && item.action.forceMount === true,
  )
  const words = items.filter((item): item is WordItem => item.entity === 'word')
  const typed = query.trim()

  const actionRow = (item: ActionItem) => (
    <CommandPaletteItem
      key={item.action.id}
      value={item.action.id}
      keywords={item.action.keywords}
      forceMount={item.action.forceMount}
      icon={item.action.icon}
      description={item.action.description}
      onSelect={() => {
        onSelect(item)
        item.action.onSelect?.(typed)
      }}
    >
      {typeof item.action.label === 'function' ? item.action.label(typed) : item.action.label}
    </CommandPaletteItem>
  )

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
        <CommandPaletteGroup heading="Actions">{actions.map(actionRow)}</CommandPaletteGroup>
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
      {pinned.length > 0 && (
        <CommandPaletteGroup forceMount>{pinned.map(actionRow)}</CommandPaletteGroup>
      )}
    </CommandPalette>
  )
}
