import type { WordStatus } from '../../atoms/status-badge'

function verbClass(status: WordStatus) {
  return status === 'generating'
    ? 'text-seal'
    : status === 'failed'
      ? 'text-destructive'
      : 'text-faint-foreground'
}

/**
 * `Spanish · arriving` — the language stays muted, the state verb takes the
 * status colour. A note carrying no ` · ` separator is treated as the verb and
 * colours as a whole (so a single-segment note is never left uncoloured).
 */
export function StatusNote({ note, status }: { note: string; status: WordStatus }) {
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
