import type { ReactNode } from 'react'
import { SiteChrome, SiteTabBar } from '@/src/chrome/site-chrome.client'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome />
      <main className="mx-auto max-w-[1160px] px-5 pb-24 md:px-10 md:pb-10">{children}</main>
      <SiteTabBar />
    </>
  )
}
