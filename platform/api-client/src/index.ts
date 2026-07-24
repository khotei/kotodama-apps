// @kotodama/platform/api-client — pure transport: the openapi-fetch client factory + the
// generated contract types. The base of the platform-agnostic spine; imports
// nothing internal (leaf). fetchX access functions live one tier up, in
// @kotodama/core/repositories.

export type { ApiClient, ApiClientOptions } from './client'
export { createApiClient } from './client'
export type { operations, paths } from './schema.gen'
export { ApiError, unwrap } from './unwrap'
