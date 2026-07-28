'use server'

import { buildWord, type Language } from '@kotodama/core/repositories'
import { revalidatePath } from 'next/cache'
import { createServerApiClient } from '../../server/server-api-client'

// The word feature's client-callable commands (Server Actions) — every export is
// a `request*` mutation; reads live in word.loaders.ts.

/**
 * Queue (or re-queue) a build for the word, then re-sync the page — the Create /
 * Try-again / Generate CTAs bind this and submit it from a plain <form action>.
 * An unreachable backend is swallowed: the revalidated page simply re-renders
 * the current state (not-found / failed), which is the honest outcome.
 */
export async function requestWordBuild(language: Language, word: string) {
  try {
    await buildWord(createServerApiClient(), language, word)
  } catch {}
  revalidatePath(`/words/${language}/${word}`)
}

/**
 * Re-sync the word page after the backend finished building it. Called by the status
 * poller once the build leaves `pending`/`running`. `revalidatePath` from a Server
 * Action busts the route's Data Cache AND the client Router Cache and re-renders the
 * RSC page in the same round-trip — so the ready entry, metadata, and JSON-LD all
 * refresh at once, with no client-side refetch.
 */
export async function requestWordRefresh(language: Language, word: string) {
  revalidatePath(`/words/${language}/${word}`)
}
