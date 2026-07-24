'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

// The one client provider left: theme. Data no longer needs a client cache — reads
// are RSC (src/server/*.loader.ts), writes are Server Actions (*.actions.ts), and the
// sole client island polls the same-origin API directly. No QueryClient, no injected
// API client.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
