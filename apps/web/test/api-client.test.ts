import { describe, expect, it } from 'vitest'
import {
  createBrowserApiClient,
  createServerApiClient,
  createStaticApiClient,
} from '../src/api-client'

describe('api-client factories', () => {
  it('build a typed openapi-fetch client exposing GET', () => {
    expect(typeof createBrowserApiClient().GET).toBe('function')
    expect(typeof createStaticApiClient().GET).toBe('function')
  })

  it('server client is async (mirrors await cookies())', async () => {
    expect(typeof (await createServerApiClient()).GET).toBe('function')
  })
})
