'use client'

import type { ReactNode } from 'react'
import { toast } from 'sonner'
import {
  CHROME_COMMANDS_MOCK,
  CHROME_DESKTOP_NAV_MOCK,
  CHROME_MOBILE_NAV_MOCK,
} from '../../../fixtures/chrome.fixture'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import type { SearchWordView } from '../../../views/search.view'
import { AppMainWrapper } from '../../atoms/app-main-wrapper'
import { AppHeader } from '../../features/app-header'
import { Toaster } from '../../ui/sonner'
import { AppTemplate } from '../app-template'

export type StoryTemplateProps = {
  paletteWords?: readonly SearchWordView[]
  children: ReactNode
}

/**
 * Storybook-only harness: mounts the real {@link AppHeader} inside the
 * {@link AppTemplate} backdrop, so a page story renders exactly as the app mounts
 * it. Not for app code: the app wires real navigation in
 * `app/(public)/components/public-app-header/public-app-header.client.tsx` +
 * `app/(public)/layout.tsx`. Nothing escapes the iframe: links go through the
 * framework's next/* mocks (route via `parameters.nextjs.navigation.pathname`),
 * palette commands toast.
 */
export function StoryTemplate({ paletteWords = [], children }: StoryTemplateProps) {
  return (
    <AppTemplate>
      <AppHeader
        nav={{
          homeHref: '/',
          searchHref: '/search',
          desktop: CHROME_DESKTOP_NAV_MOCK,
          mobile: CHROME_MOBILE_NAV_MOCK,
        }}
        commands={CHROME_COMMANDS_MOCK}
        words={{
          list: paletteWords,
          onSearch: (query) => query && toast(`Would search “${query}”`),
          onSelect: (word) => toast(`Would navigate to ${word.href}`),
        }}
        language={{ current: CURRENT_LANGUAGE_MOCK, list: LANGUAGE_OPTIONS_MOCK }}
        theme={{}}
      />
      <AppMainWrapper>{children}</AppMainWrapper>
      <Toaster position="bottom-right" />
    </AppTemplate>
  )
}
