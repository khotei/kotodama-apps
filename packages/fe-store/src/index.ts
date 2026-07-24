// @kotodama/fe-store — TanStack Query queryOptions factories. Spine (no DOM):
// the cross-platform reuse unit that a future apps/mobile shares unchanged.

export type { ApiClient, Language } from '@kotodama/fe-api-client'

// The store is apps/web's GATEWAY to the API: apps/web may not import
// fe-api-client directly (Biome ban — AC-2), so the client factory + the types
// a route needs to construct a client / read params are re-exported here. The
// transport itself stays hidden behind the fetchX functions.
export { ApiError, createApiClient } from '@kotodama/fe-api-client'
export { wordQueryOptions } from './word.store'
