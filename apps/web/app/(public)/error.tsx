'use client'

// The public tree's error boundary: a throwing loader (unreachable backend)
// lands here — the degraded state lives ONCE, never as a null-branch per page.
export default function PublicError() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-lg text-center">
      <p className="text-muted-foreground">
        The library shelves are being restocked — check back in a moment.
      </p>
    </main>
  )
}
