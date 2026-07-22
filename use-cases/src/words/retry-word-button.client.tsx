'use client'

import type { Language } from '@kotodama/store'
import { RetryLink } from '@kotodama/ui'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { languageName } from './language-name'

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
    <RetryLink
      disabled={pending}
      onClick={(event) => {
        event.preventDefault()
        toast(`Re-queued “${word}” — ${languageName(language)} · arriving`)
        startTransition(() => retryAction(language, word))
      }}
    >
      Retry
    </RetryLink>
  )
}
