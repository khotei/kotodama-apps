import type { ReactNode } from 'react'
import { AppWrapper } from '../app-wrapper'

export type AppMainWrapperProps = {
  children: ReactNode
}

/**
 * The page's `<main>` region — the site gutter (via {@link AppWrapper}) plus the
 * standard bottom rhythm, shared by the app layout and the Storybook harness so
 * the two can't drift. One per page (it renders the semantic `<main>`).
 */
export function AppMainWrapper({ children }: AppMainWrapperProps) {
  return (
    <AppWrapper as="main" className="pb-4xl md:pb-2xl">
      {children}
    </AppWrapper>
  )
}
