import { SiteContainer, SiteShell } from '@kotodama/ui'
import type { ReactNode } from 'react'
import { PublicSiteHeader } from './components/public-site-header/public-site-header.client'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <PublicSiteHeader />

      {/* @todo: Create reusable component? like AppBodyContaier? in StoryShell same thing. I believe they should be smame for all pages? */}
      <SiteContainer as="main" className="pb-4xl md:pb-2xl">
        {children}
      </SiteContainer>
    </SiteShell>
  )
}
