'use client'

import { ArrowDownIcon, CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

export type ColorMode = 'light' | 'system' | 'dark'

const MODES = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'Auto', Icon: MonitorIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
] as const

// The default handler flips `.dark` on <html> — the same cascade next-themes
// drives; the app injects `setTheme` instead to persist the choice.
const applyMode = (mode: ColorMode) => {
  const dark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

export type ModeMenuProps = {
  /** The mode to check-mark — e.g. next-themes' `theme`. */
  mode?: string
  onModeChange?: (mode: ColorMode) => void
}

export function ModeMenu({ mode, onModeChange = applyMode }: ModeMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Color mode"
          className="gap-[7px] px-[11px] text-muted-foreground hover:border-muted-foreground hover:text-foreground"
        >
          <SunIcon className="dark:hidden" />
          <MoonIcon className="hidden dark:block" />
          <ArrowDownIcon className="hidden size-3 text-subtle-foreground md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color mode</DropdownMenuLabel>
        {MODES.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            className={cn(mode === value && 'font-semibold text-seal')}
            onSelect={() => onModeChange(value)}
          >
            <Icon /> {label}
            {mode === value && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
