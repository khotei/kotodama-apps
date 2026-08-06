import type { WordStatus } from '../word-status'

// @todo: maybe create hash map?
function verbClass(status: WordStatus) {
  return status === 'running'
    ? 'text-seal'
    : status === 'failed'
      ? 'text-destructive'
      : 'text-faint-foreground'
}

export type WordStatusNoteProps = { note: string; status: WordStatus }

/**
 * `Spanish · arriving` — the language stays muted, the state verb takes the
 * status colour. A note carrying no ` · ` separator is treated as the verb and
 * colours as a whole (so a single-segment note is never left uncoloured).
 */
export function WordStatusNote({ note, status }: WordStatusNoteProps) {
  const sep = note.indexOf(' · ')
  if (sep < 0) {
    return <span className={verbClass(status)}>{note}</span>
  }
  return (
    <span className="text-muted-foreground">
      {note.slice(0, sep)}
      {' · '}
      <span className={verbClass(status)}>{note.slice(sep + 3)}</span>
    </span>
  )
}
