import type { ReactNode } from 'react'
import { SiteChrome } from '@/src/chrome/site-chrome.client'
import { SEARCH_WORDS_MOCK } from '@/src/library/search.mock'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      <div aria-hidden className="kdm-grain pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-[1]">
        <SiteChrome paletteWords={SEARCH_WORDS_MOCK} />
        <main className="mx-auto max-w-[1160px] px-5 pb-24 md:px-10 md:pb-10">{children}</main>
      </div>
    </div>
  )
}
