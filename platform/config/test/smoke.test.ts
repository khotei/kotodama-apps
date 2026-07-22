import { expect, it } from 'vitest'
import { loadRootEnv, serverEnv } from '../src/index'

it('validates and returns the required server vars', () => {
  process.env.KOTODAMA_API_URL = 'http://localhost:3000'
  process.env.KOTODAMA_SITE_URL = 'http://localhost:4000'
  const env = serverEnv()
  expect(env.KOTODAMA_API_URL).toBe('http://localhost:3000')
  expect(env.KOTODAMA_SITE_URL).toBe('http://localhost:4000')
})

it('loadRootEnv does not override an already-set var', () => {
  process.env.KOTODAMA_API_URL = 'http://preset:9999'
  loadRootEnv()
  expect(process.env.KOTODAMA_API_URL).toBe('http://preset:9999')
})
