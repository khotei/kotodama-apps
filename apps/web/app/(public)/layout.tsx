import type { ReactNode } from 'react'
import { SiteChrome } from '@/src/chrome/site-chrome.client'
import { SEARCH_WORDS_MOCK } from '@/src/library/search.mock'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome paletteWords={SEARCH_WORDS_MOCK} />
      <main className="mx-auto max-w-[1160px] px-5 pb-24 md:px-10 md:pb-10">{children}</main>
    </>
  )
}
