import { describe, expect, it } from 'vitest'
import { ApiError, unwrap } from '../src/index'

describe('unwrap', () => {
  it('returns the data on a 2xx', () => {
    const response = new Response(null, { status: 200 })
    expect(unwrap({ data: { word: 'lumen' }, response })).toEqual({ word: 'lumen' })
  })

  it('throws an ApiError carrying the status + error body on a non-2xx', () => {
    const response = new Response(null, { status: 409 })
    let err: unknown
    try {
      unwrap({ error: { _tag: 'WordNotReadyError' }, response })
    } catch (e) {
      err = e
    }
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).status).toBe(409)
    expect((err as ApiError).body).toEqual({ _tag: 'WordNotReadyError' })
  })
})
