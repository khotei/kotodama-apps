// @kotodama/use-cases — the web-only feature tier: domain-aware assemblies (RSC views
// + client islands) composed from `@kotodama/ui` primitives and `@kotodama/store`
// models. Next-free and prop-driven — the app injects data + Server Actions + URLs
// (all serializable across the RSC boundary). A future web module reuses these with
// its own Next wiring; the DOM-bound render layer does NOT port to native.

export { WordStatusPoller, type WordStatusPollerProps } from './words/word-status-poller.client'
export { WordView } from './words/word-view'
