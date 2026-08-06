'use client'

import { BookOpenIcon } from 'lucide-react'
import Link from 'next/link'
import type { SearchWordView } from '../../../views/search.view'
import { WordStatusBadge } from '../../core/word-status'
import { CommandPaletteItem } from '../../organisms/command-palette'

export type WordCommandItemProps = {
  word: SearchWordView
  onSelect: () => void
}

/**
 * A {@link CommandPaletteItem} specialised for a library word: the word over its
 * gloss, with the part-of-speech trailing when ready or a {@link WordStatusBadge}
 * while it's still building. `href` is the identity; the word stays the match term.
 * The word is a real link — modified clicks open a tab natively; plain clicks and
 * Enter both land in `onSelect`, the row's single navigation path.
 */
export function WordCommandItem({ word, onSelect }: WordCommandItemProps) {
  const ready = word.status === 'succeeded'
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
          <WordStatusBadge status={word.status} />
        )
      }
    >
      <Link
        href={word.href}
        onClick={(event) => {
          // A modified click must not ALSO select in cmdk (stopPropagation); an
          // unmodified one defers to cmdk's select so click + Enter share one path.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            event.stopPropagation()
          else event.preventDefault()
        }}
      >
        {word.word}
      </Link>
    </CommandPaletteItem>
  )
}
