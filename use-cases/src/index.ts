// @kotodama/use-cases — the web-only feature tier: domain-aware assemblies (RSC views
// + client islands) composed from `@kotodama/ui` primitives and `@kotodama/store`
// models. Next-free and prop-driven — the app injects data + Server Actions + URLs
// (all serializable across the RSC boundary). A future web module reuses these with
// its own Next wiring; the DOM-bound render layer does NOT port to native.

export { type AccentedWord, AccentedWordMark, accentedWordText } from '@kotodama/core'
export { CommandPalette, type CommandPaletteProps } from './chrome/command-palette.client'
export { type MobileTab, MobileTabBar, type MobileTabBarProps } from './chrome/mobile-tab-bar'
export { SiteHeader, type SiteHeaderProps, type SiteNavLink } from './chrome/site-header'
export type {
  LibraryStat,
  LibraryView,
  RankedWordView,
  TryWordView,
  WotdGlanceView,
  WotdView,
} from './library/library.view'
export { LibraryHero, type LibraryHeroProps } from './library/library-hero'
export { LibraryScreen, type LibraryScreenProps } from './library/library-screen'
export { ListenButton, type ListenButtonProps } from './library/listen-button.client'
export { ReadingRoom, type ReadingRoomProps } from './library/reading-room'
export { WordOfTheDay, type WordOfTheDayProps } from './library/word-of-the-day.client'
export type { SearchPos, SearchWordView } from './search/search.view'
export { SearchPage, type SearchPageProps } from './search/search-page.client'
export {
  RetryWordButton,
  type RetryWordButtonProps,
} from './words/retry-word-button.client'
export { SaveWordButton, type SaveWordButtonProps } from './words/save-word-button.client'
export {
  WordFailedView,
  type WordFailedViewProps,
  WordGeneratingView,
  type WordGeneratingViewProps,
  WordNotFoundView,
  type WordNotFoundViewProps,
} from './words/word-build-view'
export { WordEntryView, type WordEntryViewProps } from './words/word-entry-view'
export { WordLoadingView, type WordLoadingViewProps } from './words/word-loading-view'
export { WordScreen, type WordScreenProps } from './words/word-screen'
export { WordStatusPoller, type WordStatusPollerProps } from './words/word-status-poller.client'
