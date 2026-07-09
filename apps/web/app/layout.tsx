import { serverEnv } from '@kotodama/config'
import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

// The three variables feed the ui token sheet's font seam — --font-serif/sans/
// mono resolve through them (see @kotodama/ui styles.css); Storybook loads the
// same families without next/font.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
})

// metadataBase resolves the per-page OG image's relative URL to an absolute one.
// Build per environment.
export const metadata: Metadata = {
  metadataBase: new URL(serverEnv().KOTODAMA_SITE_URL),
  title: { default: 'Kotodama', template: '%s · Kotodama' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
