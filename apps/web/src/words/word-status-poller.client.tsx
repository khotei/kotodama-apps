'use client'

import type { WordBuildStatus } from '@kotodama/store'
import { useState } from 'react'
import useInterval from 'react-use/lib/useInterval'

// The word feature's ONE client island (`.client.tsx` = browser-bundle files). Next-free
// and prop-driven: both injected props are Server Actions (the only serializable way to
// pass "a function" from an RSC page to a client component) —
//   • `poll` — the typed status fetcher, called each tick. A Server Action, so there is
//     no URL string and no client-side JSON parsing; the type flows end-to-end.
//   • `onSettled` — run once the build leaves pending/running so the app can revalidate.
// Server Actions dispatch serially per client — harmless for a lone periodic poll; if a
// page ever runs many competing actions, poll via a client GET instead (frontend-state.md).
// The interval + teardown are `react-use`'s `useInterval`; `delay: null` pauses it.

export type WordStatusPollerProps = {
  /** The word's current build status — a bound Server Action, called each tick. */
  poll: () => Promise<WordBuildStatus | null>
  /** Fired once, when the build leaves pending/running — a bound Server Action. */
  onSettled: () => void | Promise<void>
  intervalMs?: number
}

function isBuilding(status: WordBuildStatus) {
  return status === 'pending' || status === 'running'
}

export function WordStatusPoller({ poll, onSettled, intervalMs = 1000 }: WordStatusPollerProps) {
  const [active, setActive] = useState(true)

  useInterval(
    async () => {
      // Don't poll from a backgrounded tab.
      if (document.hidden) return
      const status = await poll()
      if (status === null || isBuilding(status)) return
      setActive(false)
      await onSettled()
    },
    active ? intervalMs : null,
  )

  return null
}
