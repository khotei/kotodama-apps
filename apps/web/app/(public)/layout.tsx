import { AppMainWrapper, AppShell } from '@kotodama/ui'
import type { ReactNode } from 'react'
import { PublicAppHeader } from './components/public-app-header/public-app-header.client'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <PublicAppHeader />

      <AppMainWrapper>{children}</AppMainWrapper>
    </AppShell>
  )
}
