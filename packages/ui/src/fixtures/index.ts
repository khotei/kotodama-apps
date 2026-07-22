// Design-surface fixtures (`@kotodama/ui/fixtures`): the canonical *View mocks the
// Storybook stories feed, re-used by apps/web as its design-stage stand-in until
// the backend loaders land. Kept off the main barrel — a dev surface, not runtime API.
export { LIBRARY_VIEW_MOCK } from './library.fixture'
export { SEARCH_WORDS_MOCK } from './search.fixture'
export { WORD_STATE_MOCKS_ALL } from './word.fixture'
