// Design-surface fixtures (`@kotodama/ui/fixtures`): the canonical *View mocks the
// Storybook stories feed, re-used by apps/web as its design-stage stand-in until
// the backend loaders land. Kept off the main barrel — a dev surface, not runtime API.
export {
  CHROME_COMMANDS_MOCK,
  CHROME_DESKTOP_NAV_MOCK,
  CHROME_MOBILE_NAV_MOCK,
} from './chrome.fixture'
export { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from './language.fixture'
export { LIBRARY_VIEW_MOCK } from './library.fixture'
export { SEARCH_WORDS_MOCK } from './search.fixture'
