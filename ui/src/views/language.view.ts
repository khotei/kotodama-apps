import type { operations } from '@kotodama/platform/api-client'

/**
 * The catalogue language union, derived type-only off the wire contract (the
 * one read ui is allowed of `platform/api-client`). Kit components stay generic
 * over the code `string`; the domain tier narrows to this.
 */
export type Language = operations['words.getWord']['parameters']['path']['language']
