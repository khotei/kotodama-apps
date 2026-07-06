import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

// metadataBase resolves the per-page OG image's relative URL to an absolute one;
// inlined at build time, so build per environment (as with KOTODAMA_API_URL).
export const metadata: Metadata = {
  metadataBase: new URL(process.env.KOTODAMA_SITE_URL ?? 'http://localhost:3000'),
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
