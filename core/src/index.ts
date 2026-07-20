// @kotodama/core — the web-only DOMAIN tier: small, composable domain-aware pieces
// (today the `words` domain) that `use-cases` composes into feature assemblies.
// Sits store ◄ core ◄ use-cases; may import @kotodama/ui + @kotodama/store, never
// use-cases or apps. See CLAUDE.md + .claude/rules/frontend-layering.md.

export { type AccentedWord, AccentedWordMark, accentedWordText } from './words/accented-word'
export { RetryLink } from './words/retry-link'
export { StatusNote } from './words/status-note'
