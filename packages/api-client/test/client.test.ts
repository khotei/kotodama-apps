import { describe, expect, it } from 'vitest'
import { createApiClient } from '../src/index'

// api-client is pure transport — its behaviour (fetchX decode/error) is tested
// in @kotodama/repositories against this client. Here we only assert the factory
// wires a usable openapi-fetch instance with the GET method.
describe('createApiClient', () => {
  it('builds an openapi-fetch client exposing GET', () => {
    const client = createApiClient({ baseUrl: 'http://test' })
    expect(typeof client.GET).toBe('function')
  })
})
