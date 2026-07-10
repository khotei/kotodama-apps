'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
  StatusBadge,
} from '@kotodama/ui'
import { BookOpenIcon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'
import type { SearchWordView } from '../search/search.view'

export type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  words: readonly SearchWordView[]
  onSelect: (href: string) => void
  onGenerate: (query: string) => void
}

/**
 * The ⌘K palette: fuzzy-jump across the library (cmdk's built-in filter) with
 * a trailing generate row for a word that isn't there yet. Client→client
 * composed — the app owns the open state, the shortcut, and navigation.
 */
export function CommandPalette({
  open,
  onOpenChange,
  words,
  onSelect,
  onGenerate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()

  const close = () => {
    onOpenChange(false)
    setQuery('')
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setQuery('')
      }}
      title="Search or jump"
      description="Fuzzy-match a word in your library, or generate a new entry."
    >
      <CommandInput placeholder="Search or jump…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No word matches.</CommandEmpty>
        <CommandGroup heading="Your library">
          {words.map((row) => (
            <CommandItem
              key={row.word}
              value={row.word}
              onSelect={() => {
                close()
                onSelect(row.href)
              }}
            >
              <BookOpenIcon />
              <span className="font-serif text-[15px]">{row.word}</span>
              {row.status === 'ready' ? (
                row.gloss != null && (
                  <span className="ml-auto max-w-[50%] truncate text-[12.5px] text-muted-foreground">
                    {row.gloss}
                  </span>
                )
              ) : (
                <span className="ml-auto">
                  <StatusBadge status={row.status} />
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        {trimmed !== '' && (
          <CommandGroup heading="New entry" forceMount>
            <CommandItem
              value={`generate-${trimmed}`}
              forceMount
              onSelect={() => {
                close()
                onGenerate(trimmed)
              }}
            >
              <SparklesIcon />
              Generate an entry for “{trimmed}”
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
      <div className="flex items-center gap-3.5 border-border border-t px-3.5 py-2 text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Kbd>↑↓</Kbd> navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> open
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>esc</Kbd> close
        </span>
      </div>
    </CommandDialog>
  )
}
