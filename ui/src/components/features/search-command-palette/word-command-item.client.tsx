'use client'

import { BookOpenIcon } from 'lucide-react'
import type { SearchWordView } from '../../../views/search.view'
import { StatusBadge } from '../../core/status-badge'
import { CommandPaletteItem } from '../../organisms/command-palette'

export type WordCommandItemProps = {
  word: SearchWordView
  onSelect: () => void
}

/**
 * A {@link CommandPaletteItem} specialised for a library word: the word over its
 * gloss, with the part-of-speech trailing when ready or a {@link StatusBadge}
 * while it's still building. `href` is the identity; the word stays the match term.
 */
export function WordCommandItem({ word, onSelect }: WordCommandItemProps) {
  const ready = word.status === 'ready'
  return (
    <CommandPaletteItem
      value={word.href}
      keywords={[word.word]}
      onSelect={onSelect}
      icon={<BookOpenIcon />}
      description={ready ? word.gloss : word.statusNote}
      trailing={
        ready ? (
          word.posLabel != null && (
            <span className="text-sm text-subtle-foreground">{word.posLabel}</span>
          )
        ) : (
          <StatusBadge status={word.status} />
        )
      }
    >
      {word.word}
    </CommandPaletteItem>
  )
}
