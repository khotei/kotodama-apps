// The design-surface fixtures, in one subpath (`@kotodama/use-cases/fixtures`):
// the canonical *View / *Model mocks the Storybook stories feed, re-exported by
// apps/web as its design-stage stand-in until the backend loaders land. NOT part
// of the main barrel — fixtures are a dev surface, kept off the runtime API.
export { LIBRARY_VIEW_MOCK } from './library/library.fixture'
export { SEARCH_WORDS_MOCK } from './search/search.fixture'
export { WORD_STATE_MOCKS, WORD_STATE_MOCKS_ALL } from './words/word.fixture'
