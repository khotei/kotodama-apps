'use client'

import { languageName } from '@kotodama/platform/languages'
import { ArrowDownIcon, CheckIcon, GlobeIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

// Capitalized autonym — `es` → `Español`. The menu names each language in
// itself (the universal switcher convention), so there is no display locale
// to inject and no label prop to drift.
const languageLabel = (code: string) => {
  const name = languageName(code)
  return name.charAt(0).toLocaleUpperCase(code) + name.slice(1)
}

export type LanguageMenuProps<L extends string = string> = {
  /** Bare catalogue codes (`es`); labels derive inside. */
  current: L
  languages: readonly L[]
  onSelect?: (code: L) => void
  /** Compact mobile rendering — the current language's code badge instead of the full trigger. */
  compact?: boolean
}

export function LanguageMenu<L extends string>({
  current,
  languages,
  onSelect,
  compact = false,
}: LanguageMenuProps<L>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-muted-foreground hover:border-muted-foreground hover:text-foreground"
        >
          {compact ? (
            current.toUpperCase()
          ) : (
            <>
              <GlobeIcon />
              <span className="font-semibold text-foreground">{languageLabel(current)}</span>
              <ArrowDownIcon className="size-3 text-subtle-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Study language</DropdownMenuLabel>
        {languages.map((code) => {
          const isCurrent = code === current
          return (
            <DropdownMenuItem
              key={code}
              className={cn(isCurrent && 'font-semibold text-seal')}
              onSelect={() => onSelect?.(code)}
            >
              {languageLabel(code)}
              {isCurrent && <CheckIcon className="ml-auto" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
