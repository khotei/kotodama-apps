'use client'

import { PlusIcon } from 'lucide-react'
import { Button } from '../../ui/button'

export type CommandFabProps = {
  /** Opens the command palette; the shell that owns the palette state injects it. */
  onOpen?: () => void
}

/**
 * The mobile-only floating twin of {@link CommandTrigger}: a seal FAB pinned above
 * the tab bar that opens the command palette. Self-hides at `md` and up (the
 * desktop uses the header trigger instead).
 */
export function CommandFab({ onOpen }: CommandFabProps) {
  return (
    <Button
      variant="accent"
      size="icon-lg"
      aria-label="Add or jump"
      onClick={onOpen}
      className="fixed right-[18px] bottom-[76px] z-50 size-[54px] shadow-hero md:hidden"
    >
      <PlusIcon className="size-6" />
    </Button>
  )
}
