// @kotodama/use-cases — the web-only feature tier: domain-aware assemblies (RSC views
// + client islands) composed from `@kotodama/ui` primitives and `@kotodama/store`
// models. Next-free and prop-driven — the app injects data + Server Actions + URLs
// (all serializable across the RSC boundary). A future web module reuses these with
// its own Next wiring; the DOM-bound render layer does NOT port to native.

export { CommandPalette, type CommandPaletteProps } from './chrome/command-palette.client'
export { type MobileTab, MobileTabBar, type MobileTabBarProps } from './chrome/mobile-tab-bar'
export { SiteHeader, type SiteHeaderProps, type SiteNavLink } from './chrome/site-header'
