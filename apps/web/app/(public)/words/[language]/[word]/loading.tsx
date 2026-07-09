// Streaming fallback for the word route: shown while the RSC page resolves on an
// uncached (soft) navigation. Params aren't available here, so it's a neutral
// skeleton, not a WordCard.
export default function Loading() {
  return (
    <main className="min-h-dvh space-y-4 p-8">
      <div className="h-40 max-w-lg animate-pulse rounded-xl bg-muted" />
    </main>
  )
}
