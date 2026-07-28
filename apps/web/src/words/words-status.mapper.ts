import type { UnreadyListWord } from '@kotodama/core/words'
import { languageName } from '@kotodama/platform/languages'
import { DEFAULT_LANGUAGE } from '../language/language'
import { capitalize } from '../utils/text'

// Render-only copy for an unready row's mono note — never branched on. The
// status TOKEN itself flows through untranslated: ui's WordStatus IS the wire
// union (the vocabularies were unified by decision on T4).
const STATUS_NOTE_LABEL = {
  pending: 'queued',
  running: 'arriving',
  failed: 'didn’t settle',
} as const satisfies Record<UnreadyListWord['status'], string>

/** The unready row's mono note — `Spanish · queued`. */
export function unreadyStatusNote(item: UnreadyListWord) {
  return `${capitalize(languageName(item.language, DEFAULT_LANGUAGE))} · ${STATUS_NOTE_LABEL[item.status]}`
}
