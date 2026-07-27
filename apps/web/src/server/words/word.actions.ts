'use server'

import { buildWord, fetchWordState, type Language } from '@kotodama/core/repositories'
import type { WordBuildStatus } from '@kotodama/core/words'
import { revalidatePath } from 'next/cache'
import { createServerApiClient, createStaticApiClient } from '../api-client'

// The word feature's client-callable server surface (`'use server'`). A `'use server'`
// module imported by a client island exposes NETWORK REFERENCES, not the code, so it
// may import `server-only` transport and is the only serializable way to hand the client
// "a function" — see .claude/rules/frontend-state.md.

/**
 * The word's current build status — the typed poll function the status island calls each
 * tick (passed in as a Server Action, so no URL string / no client-side JSON parsing).
 * `cache: 'no-store'` bypasses the route's Data Cache so each poll sees fresh state.
 * `null` when the word does not exist.
 */
export async function getWordStatus(
  language: Language,
  word: string,
): Promise<WordBuildStatus | null> {
  try {
    const state = await fetchWordState(createStaticApiClient(), language, word, {
      cache: 'no-store',
    })
    return state?.status ?? null
  } catch {
    // Unreachable backend must not reject in the poll island — null = keep waiting.
    return null
  }
}

/**
 * Re-sync the word page after the backend finished building it. Called by the status
 * poller once the build leaves `pending`/`running`. `revalidatePath` from a Server
 * Action busts the route's Data Cache AND the client Router Cache and re-renders the
 * RSC page in the same round-trip — so the ready entry, metadata, and JSON-LD all
 * refresh at once, with no client-side refetch.
 */
export async function refreshWordPage(language: Language, word: string) {
  revalidatePath(`/words/${language}/${word}`)
}

/**
 * Queue (or re-queue) a build for the word, then re-sync the page — the Create /
 * Try-again / Generate CTAs bind this and submit it from a plain <form action>.
 * An unreachable backend is swallowed: the revalidated page simply re-renders
 * the current state (not-found / failed), which is the honest outcome.
 */
export async function requestWordBuild(language: Language, word: string) {
  try {
    await buildWord(await createServerApiClient(), language, word)
  } catch {}
  revalidatePath(`/words/${language}/${word}`)
}
