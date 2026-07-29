import { AppMainWrapper, AppTemplate } from '@kotodama/ui'
import type { ReactNode } from 'react'
import { PublicAppHeader } from './components/public-app-header/public-app-header.client'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AppTemplate>
      <PublicAppHeader />

      <AppMainWrapper>{children}</AppMainWrapper>
    </AppTemplate>
  )
}
