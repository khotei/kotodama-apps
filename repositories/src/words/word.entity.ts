import type { operations } from '@kotodama/api-client'

// The contract types projected straight off the generated `operations` — no
// hand-written response shapes. They live here, in the data-access tier that
// owns the wire vocabulary, so `store` (and any future consumer) reads one
// domain home; `api-client` stays pure transport (client + raw `operations`).
// Entity nouns carry the `*Entity` role suffix (as-fetched); shared value types
// (`Language`, `JobStatus`) stay plain — they travel across layers as primitives.

export type Language = operations['words.getWord']['parameters']['path']['language']
export type JobStatus = NonNullable<operations['words.search']['parameters']['query']>['status']

/** getWord success: the full word entity, or `null` when absent (200 null). */
export type WordEntity =
  operations['words.getWord']['responses'][200]['content']['application/json']
/** The two-branch state (succeeded ⇒ word · pending/running/failed ⇒ stages). */
export type WordStateEntity =
  operations['words.buildWord']['responses'][200]['content']['application/json']
export type WordSearchResultEntity =
  operations['words.search']['responses'][200]['content']['application/json']
export type WordCountsEntity =
  operations['words.counts']['responses'][200]['content']['application/json']
