import type { ReactNode } from 'react'

export type SiteShellProps = {
  children: ReactNode
}

/**
 * The site's outer shell: the full-height page, the fixed paper-grain layer, and
 * the z-lifted content plane above it. The wrapper is one stacking context
 * (`isolate`) so the grain stays behind everything and inner z-indexes never
 * fight the rest of the document. Wrap the whole public tree in it — the app
 * layout mounts it; {@link StoryShell} reuses it for stories.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="relative isolate min-h-screen">
      <div aria-hidden className="kdm-grain pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
