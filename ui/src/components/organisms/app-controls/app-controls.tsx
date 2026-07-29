import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import type { Language } from '../../../views/language.view'
import { Show } from '../../atoms/show'
import { CommandTrigger } from '../../molecules/command-trigger'
import { LanguageMenu } from '../../molecules/language-menu'
import { ThemeMenu, type ThemeMenuProps } from '../../molecules/theme-menu'
import { Button } from '../../ui/button'

export type AppControlsProps = {
  /** The ⌘K affordance: the desktop trigger + where the mobile magnifier links. */
  search: { label: string; shortcut: string; onTrigger: () => void; mobileHref: string }
  /** Bare catalogue codes; {@link LanguageMenu} derives the display labels. */
  language: {
    current: Language
    list: readonly Language[]
    onSelect?: (code: Language) => void
  }
  /** `{}` → {@link ThemeMenu}'s own default (flip `.dark` on `<html>`). */
  theme: ThemeMenuProps
}

/**
 * The header's right-hand control cluster — ⌘K trigger (desktop) / search
 * magnifier (mobile), the language menu in both densities, the theme menu —
 * each gated by viewport with {@link Show}. The standard filling for the
 * header bar's `controls` slot.
 */
export function AppControls({ search, language, theme }: AppControlsProps) {
  return (
    <>
      <Show on="desktop">
        <CommandTrigger
          label={search.label}
          shortcut={search.shortcut}
          onTrigger={search.onTrigger}
        />
      </Show>
      <Show on="mobile">
        <Button asChild variant="ghost" size="icon-sm" aria-label="Search">
          <Link href={search.mobileHref}>
            <SearchIcon />
          </Link>
        </Button>
      </Show>
      <Show on="desktop">
        <LanguageMenu
          current={language.current}
          languages={language.list}
          onSelect={language.onSelect}
        />
      </Show>
      <Show on="mobile">
        <LanguageMenu
          compact
          current={language.current}
          languages={language.list}
          onSelect={language.onSelect}
        />
      </Show>
      <ThemeMenu {...theme} />
    </>
  )
}
