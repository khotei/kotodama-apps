'use client'

import { BookmarkIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog'
import { Button } from '../../ui/button'

export type SaveWordButtonProps = {
  word: string
  initialSaved?: boolean
  /**
   * `hero` — the word-page CTA (`Save word` ⇄ outline `Saved`); `wotd` — the
   * bordered pill under the word of the day; `ghost` — a bare inline toggle.
   */
  look?: 'hero' | 'wotd' | 'ghost'
}

const LOOK: Record<
  NonNullable<SaveWordButtonProps['look']>,
  { unsavedLabel: string; variant: 'accent' | 'outline' | 'ghost'; className?: string }
> = {
  hero: { unsavedLabel: 'Save word', variant: 'accent' },
  wotd: {
    unsavedLabel: 'Save to library',
    variant: 'outline',
    className: 'rounded-md font-medium text-muted-foreground hover:border-seal hover:text-seal',
  },
  ghost: { unsavedLabel: 'Save', variant: 'ghost' },
}

/**
 * Save toggle with the design's full ritual: saving fires an Undo toast;
 * un-saving asks first (AlertDialog), then offers Undo too. State is local
 * until a saved-words backend exists — the seam is this island's interior.
 */
export function SaveWordButton({ word, initialSaved = false, look = 'hero' }: SaveWordButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [confirming, setConfirming] = useState(false)

  function save() {
    setSaved(true)
    toast(`Saved “${word}” for review`, {
      action: { label: 'Undo', onClick: () => setSaved(false) },
    })
  }

  function remove() {
    setConfirming(false)
    setSaved(false)
    toast(`Removed “${word}” from saved`, {
      action: { label: 'Undo', onClick: () => setSaved(true) },
    })
  }

  const { unsavedLabel, variant, className } = LOOK[look]

  return (
    <>
      <Button
        variant={saved && look === 'hero' ? 'outline' : variant}
        className={className}
        onClick={() => (saved ? setConfirming(true) : save())}
      >
        <BookmarkIcon className={saved ? 'fill-current' : undefined} />
        {saved ? 'Saved' : unsavedLabel}
      </Button>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{word}” from saved?</AlertDialogTitle>
            <AlertDialogDescription>
              It stays in your library — it just stops resurfacing for review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              Remove word
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
