'use client'

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

export type LanguageOption = {
  /** Short badge shown in the compact trigger, e.g. `ES`. */
  code: string
  label: string
}

export type LanguageMenuProps = {
  current: LanguageOption
  languages: readonly LanguageOption[]
  onSelect?: (code: string) => void
  /** Compact mobile rendering — the current language's code badge instead of the full trigger. */
  compact?: boolean
}

export function LanguageMenu({ current, languages, onSelect, compact = false }: LanguageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-muted-foreground hover:border-muted-foreground hover:text-foreground"
        >
          {compact ? (
            current.code
          ) : (
            <>
              <GlobeIcon />
              <span className="font-semibold text-foreground">{current.label}</span>
              <ArrowDownIcon className="size-3 text-subtle-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Study language</DropdownMenuLabel>
        {languages.map(({ code, label }) => {
          const isCurrent = code === current.code
          return (
            <DropdownMenuItem
              key={code}
              className={cn(isCurrent && 'font-semibold text-seal')}
              onSelect={() => onSelect?.(code)}
            >
              {label}
              {isCurrent && <CheckIcon className="ml-auto" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
