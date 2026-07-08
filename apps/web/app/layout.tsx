import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { env } from '@/src/env'
import { Providers } from './providers'
import './globals.css'

// metadataBase resolves the per-page OG image's relative URL to an absolute one.
// KOTODAMA_SITE_URL comes from the validated env() — build per environment.
export const metadata: Metadata = {
  metadataBase: new URL(env().KOTODAMA_SITE_URL),
  title: { default: 'Kotodama', template: '%s · Kotodama' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
