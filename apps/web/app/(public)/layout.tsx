import type { ReactNode } from 'react'
import { SiteChrome } from '@/src/chrome/site-chrome.client'
import { SEARCH_WORDS_MOCK } from '@/src/library/search.mock'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 [background-image:radial-gradient(rgba(24,21,26,0.020)_1px,transparent_1px),radial-gradient(rgba(24,21,26,0.013)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),radial-gradient(rgba(255,255,255,0.010)_1px,transparent_1px)]"
        style={{
          opacity: 'var(--grain-opacity)',
          backgroundSize: '3px 3px, 7px 7px',
          backgroundPosition: '0 0, 1px 2px',
        }}
      />
      <div className="relative z-[1]">
        <SiteChrome paletteWords={SEARCH_WORDS_MOCK} />
        <main className="mx-auto max-w-[1160px] px-5 pb-24 md:px-10 md:pb-10">{children}</main>
      </div>
    </div>
  )
}
