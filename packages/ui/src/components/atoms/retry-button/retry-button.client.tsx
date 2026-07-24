'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { RetryLink } from '../retry-link'

export type RetryButtonProps = {
  word: string
  /** Injected re-queue effect (a bound Server Action), fired on click. */
  onRetry: (word: string) => void | Promise<void>
}

/**
 * Row-level retry: fires an optimistic toast and the injected re-queue, holding
 * the link disabled for the transition. Needs a mounted {@link Toaster}. The
 * language-specific phrasing stays app-side — this shell knows only the word.
 */
export function RetryButton({ word, onRetry }: RetryButtonProps) {
  const [pending, startTransition] = useTransition()
  return (
    <RetryLink
      disabled={pending}
      onClick={(event) => {
        event.preventDefault()
        toast(`Re-queued “${word}” · arriving`)
        startTransition(() => onRetry(word))
      }}
    >
      Retry
    </RetryLink>
  )
}
