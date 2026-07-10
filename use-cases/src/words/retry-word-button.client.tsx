'use client'

import type { Language } from '@kotodama/store'
import { useTransition } from 'react'
import { toast } from 'sonner'

/** The design's `.rk-retry` — a quiet mono text affordance, cinnabar on hover. */
export const retryLinkClass =
  'cursor-pointer border-border border-b bg-transparent px-0.5 py-1 font-mono text-[11px] text-faint-foreground uppercase tracking-[0.1em] transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50'

export type RetryWordButtonProps = {
  language: Language
  word: string
  /** Injected Server Action — `requestWordBuild`. */
  retryAction: (language: Language, word: string) => Promise<void>
}

/** Row-level retry: re-queues the build optimistically and says so. */
export function RetryWordButton({ language, word, retryAction }: RetryWordButtonProps) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      className={retryLinkClass}
      disabled={pending}
      onClick={(event) => {
        event.preventDefault()
        toast(`Re-queued “${word}” — Spanish · arriving`)
        startTransition(() => retryAction(language, word))
      }}
    >
      Retry
    </button>
  )
}
