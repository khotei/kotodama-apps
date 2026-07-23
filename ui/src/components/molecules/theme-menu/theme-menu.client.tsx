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

export type ThemeMode = 'light' | 'system' | 'dark'

const THEMES = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'Auto', Icon: MonitorIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
] as const

// The default handler flips `.dark` on <html> — the same cascade next-themes
// drives; the app injects `setTheme` instead to persist the choice.
const applyTheme = (theme: ThemeMode) => {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

export type ThemeMenuProps = {
  /** The theme to check-mark — e.g. next-themes' `theme`. */
  theme?: string
  onThemeChange?: (theme: ThemeMode) => void
}

export function ThemeMenu({ theme, onThemeChange = applyTheme }: ThemeMenuProps) {
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
        {THEMES.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            className={cn(theme === value && 'font-semibold text-seal')}
            onSelect={() => onThemeChange(value)}
          >
            <Icon /> {label}
            {theme === value && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
