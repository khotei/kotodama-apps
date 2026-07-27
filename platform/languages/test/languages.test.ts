import { describe, expect, it } from 'vitest'
import { languageName } from '../src/index'

describe('languageName', () => {
  it('names a language in the injected ui locale, spelled as CLDR has it', () => {
    expect(languageName('es', 'en-GB')).toBe('Spanish')
    expect(languageName('es', 'ru')).toBe('Испанский')
  })

  it('names a language in itself when the locale is omitted', () => {
    expect(languageName('es')).toBe('Español')
    expect(languageName('uk')).toBe('Українська')
  })

  it('falls back to the code itself when Intl has no display name', () => {
    expect(languageName('zz', 'en-GB')).toBe('zz')
  })
})
