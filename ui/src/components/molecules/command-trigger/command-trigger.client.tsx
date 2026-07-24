'use client'

import { SearchIcon } from 'lucide-react'
import { Button } from '../../ui/button'
import { Kbd } from '../../ui/kbd'

export type CommandTriggerProps = {
  /** Opens the command palette; the shell that owns the palette state injects it. */
  onOpen?: () => void
}

export function CommandTrigger({ onOpen }: CommandTriggerProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="min-w-[210px] justify-start gap-2.5 pr-2 pl-3.5 text-[13px] text-subtle-foreground hover:border-muted-foreground"
      onClick={onOpen}
    >
      <SearchIcon />
      <span className="flex-1 text-left">Search or jump…</span>
      <Kbd>⌘K</Kbd>
    </Button>
  )
}
