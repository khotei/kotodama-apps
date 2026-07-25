'use client'

import type { ComponentProps, ReactNode } from 'react'
import { CommandGroup, CommandItem } from '../../ui/command'

export type CommandPaletteGroupProps = ComponentProps<typeof CommandGroup>

/** A titled section of palette rows — pass-through to the cmdk group (`heading`, `forceMount`). */
export function CommandPaletteGroup(props: CommandPaletteGroupProps) {
  return <CommandGroup {...props} />
}

export type CommandPaletteItemProps = {
  /** Stable identity + cmdk match value (unique per row). */
  value: string
  /** Extra terms cmdk fuzzy-matches beyond `value`. */
  keywords?: string[]
  /** Keep mounted while filtered out — for an always-visible row (e.g. a CTA). */
  forceMount?: boolean
  onSelect: () => void
  icon?: ReactNode
  /** Muted subtitle under the title. */
  description?: ReactNode
  /** Right-aligned slot — a badge, a POS label, a shortcut. */
  trailing?: ReactNode
  /** The title. */
  children: ReactNode
}

/**
 * The default palette row: a leading icon, a title over an optional muted
 * `description`, and a right-aligned `trailing` slot — the row owns the look,
 * the caller fills each slot.
 */
export function CommandPaletteItem({
  value,
  keywords,
  forceMount,
  onSelect,
  icon,
  description,
  trailing,
  children,
}: CommandPaletteItemProps) {
  return (
    <CommandItem value={value} keywords={keywords} forceMount={forceMount} onSelect={onSelect}>
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate">{children}</span>
        {description && (
          <span className="truncate text-sm text-subtle-foreground">{description}</span>
        )}
      </span>
      {trailing}
    </CommandItem>
  )
}
