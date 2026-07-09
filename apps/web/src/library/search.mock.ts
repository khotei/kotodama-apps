import type { SearchWordView } from '@kotodama/use-cases'

// Design-stage fixture (mirrors the handoff's Search screen) — same seam as
// library.mock.ts: a backend search endpoint replaces this list.
const word = (
  name: string,
  view: Omit<SearchWordView, 'href' | 'word' | 'addedRank'>,
  addedRank: number,
): SearchWordView => ({ href: `/words/es/${name}`, word: name, addedRank, ...view })

export const SEARCH_WORDS_MOCK: readonly SearchWordView[] = [
  word('empalagar', { status: 'generating', saved: true, statusNote: 'Spanish · arriving' }, 10),
  word('resquemor', { status: 'pending', saved: false, statusNote: 'Spanish · queued' }, 9),
  word('merendar', { status: 'failed', saved: true, statusNote: 'Spanish · didn’t settle' }, 8),
  word(
    'mariposa',
    {
      pos: 'noun',
      posLabel: 'noun',
      ipa: '/ma.ɾiˈpo.sa/',
      gloss: '“a butterfly of the daylight hours”',
      status: 'ready',
      saved: true,
    },
    7,
  ),
  word(
    'sobremesa',
    {
      pos: 'noun',
      posLabel: 'noun',
      ipa: '/so.βɾeˈme.sa/',
      gloss: '“the lingering talk after a meal”',
      status: 'ready',
      saved: true,
    },
    6,
  ),
  word(
    'madrugar',
    {
      pos: 'verb',
      posLabel: 'verb',
      ipa: '/ma.ðɾuˈɣaɾ/',
      gloss: '“to get up very early”',
      status: 'ready',
      saved: true,
    },
    5,
  ),
  word(
    'estrenar',
    {
      pos: 'verb',
      posLabel: 'verb',
      ipa: '/es.tɾeˈnaɾ/',
      gloss: '“to use or wear for the first time”',
      status: 'ready',
      saved: false,
    },
    4,
  ),
  word(
    'friolero',
    {
      pos: 'adjective',
      posLabel: 'adj.',
      ipa: '/fɾjoˈle.ɾo/',
      gloss: '“sensitive to the cold”',
      status: 'ready',
      saved: false,
    },
    3,
  ),
  word(
    'anteayer',
    {
      pos: 'adverb',
      posLabel: 'adv.',
      ipa: '/an.te.aˈʝeɾ/',
      gloss: '“the day before yesterday”',
      status: 'ready',
      saved: false,
    },
    2,
  ),
  word(
    'tutear',
    {
      pos: 'verb',
      posLabel: 'verb',
      ipa: '/tu.teˈaɾ/',
      gloss: '“to address someone with the informal tú”',
      status: 'ready',
      saved: false,
    },
    1,
  ),
]
