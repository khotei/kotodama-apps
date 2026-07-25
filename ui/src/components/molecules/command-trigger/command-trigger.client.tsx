'use client'

import { SearchIcon } from 'lucide-react'
import useKey from 'react-use/esm/useKey'
import { Button } from '../../ui/button'
import { Kbd } from '../../ui/kbd'

export type CommandTriggerProps = {
  /** The button text, e.g. "Search or jump…". */
  label: string
  /** The letter pressed with ⌘/Ctrl — `'k'` renders the ⌘K badge and listens for it. */
  shortcut: string
  /** Fires on click OR the ⌘/Ctrl+`shortcut` combo this trigger owns. */
  onTrigger?: () => void
}

// The button advertises the shortcut (the Kbd badge), so it owns the key listener
// too — one source of truth, no shell wiring.
export function CommandTrigger({ label, shortcut, onTrigger }: CommandTriggerProps) {
  useKey(
    (event) =>
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut.toLowerCase(),
    (event) => {
      event.preventDefault()
      onTrigger?.()
    },
  )

  return (
    <Button
      variant="outline"
      size="sm"
      className="min-w-[210px] justify-start gap-3 pr-2 pl-4 text-sm text-subtle-foreground hover:border-muted-foreground"
      onClick={onTrigger}
    >
      <SearchIcon />
      <span className="flex-1 text-left">{label}</span>
      <Kbd>⌘{shortcut.toUpperCase()}</Kbd>
    </Button>
  )
}
