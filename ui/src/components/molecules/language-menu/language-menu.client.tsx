'use client'

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@kotodama/ui'
import { ArrowDownIcon, CheckIcon, GlobeIcon } from 'lucide-react'
import { toast } from 'sonner'

export type LanguageOption = {
  label: string
  available: boolean
}

const DEFAULT_LANGUAGES: readonly LanguageOption[] = [
  { label: 'Spanish', available: true },
  { label: 'French', available: false },
  { label: 'German', available: false },
]

export type LanguageMenuProps = {
  languages?: readonly LanguageOption[]
  /** Compact mobile rendering — the `ES` badge instead of the full trigger. */
  compact?: boolean
}

export function LanguageMenu({
  languages = DEFAULT_LANGUAGES,
  compact = false,
}: LanguageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-[13px] text-muted-foreground hover:border-muted-foreground hover:text-foreground"
        >
          {compact ? (
            'ES'
          ) : (
            <>
              <GlobeIcon />
              <span className="font-semibold text-foreground">Spanish</span>
              <ArrowDownIcon className="size-3 text-subtle-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Study language</DropdownMenuLabel>
        {languages.map(({ label, available }) => (
          <DropdownMenuItem
            key={label}
            className={cn(available && 'font-semibold text-seal')}
            onSelect={() => {
              if (!available) {
                toast(`${label} isn’t available yet — staying on Spanish`)
              }
            }}
          >
            {label}
            {available && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
