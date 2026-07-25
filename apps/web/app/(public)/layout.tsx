import { SiteContainer, SiteShell } from '@kotodama/ui'
import { SEARCH_WORDS_MOCK } from '@kotodama/ui/fixtures'
import type { ReactNode } from 'react'
import { SiteChrome } from '@/src/chrome/site-chrome.client'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <SiteChrome paletteWords={SEARCH_WORDS_MOCK} />
      <SiteContainer as="main" className="pb-4xl md:pb-2xl">
        {children}
      </SiteContainer>
    </SiteShell>
  )
}
