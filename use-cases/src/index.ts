// @kotodama/use-cases — the web-only feature tier: domain-aware assemblies (RSC views
// + client islands) composed from `@kotodama/ui` primitives and `@kotodama/store`
// models. Next-free and prop-driven — the app injects data + Server Actions + URLs
// (all serializable across the RSC boundary). A future web module reuses these with
// its own Next wiring; the DOM-bound render layer does NOT port to native.

export { type MobileTab, MobileTabBar, type MobileTabBarProps } from './chrome/mobile-tab-bar'
export { SiteHeader, type SiteHeaderProps, type SiteNavLink } from './chrome/site-header'
export { AccentedWordMark } from './library/accented-word'
export {
  type AccentedWord,
  accentedWordText,
  type LibraryStat,
  type LibraryView,
  type RankedWordView,
  type TryWordView,
  type WotdGlanceView,
  type WotdView,
} from './library/library.view'
export { LibraryHero, type LibraryHeroProps } from './library/library-hero'
export { ListenButton, type ListenButtonProps } from './library/listen-button.client'
export { ReadingRoom, type ReadingRoomProps } from './library/reading-room'
export { WordOfTheDay, type WordOfTheDayProps } from './library/word-of-the-day'
export { WordStatusPoller, type WordStatusPollerProps } from './words/word-status-poller.client'
export { WordView } from './words/word-view'
