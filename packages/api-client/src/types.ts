import type { operations } from './schema.gen'

// The contract types projected straight off the generated operations — no
// hand-written response shapes (AC-4). These live in api-client (the transport
// base) so `core` can consume `WordStateView` without importing `repositories`
// (which would invert the layer direction).

export type Language = operations['words.getWord']['parameters']['path']['language']
export type JobStatus = NonNullable<operations['words.search']['parameters']['query']>['status']

/** getWord success: the full word entity, or `null` when absent (200 null). */
export type Word = operations['words.getWord']['responses'][200]['content']['application/json']
/** The two-branch state view (succeeded ⇒ word · pending/running/failed ⇒ stages). */
export type WordStateView =
  operations['words.buildWord']['responses'][200]['content']['application/json']
export type WordSearchResult =
  operations['words.search']['responses'][200]['content']['application/json']
export type WordCounts = operations['words.counts']['responses'][200]['content']['application/json']
