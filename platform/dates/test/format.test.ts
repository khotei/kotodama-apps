import { describe, expect, it } from 'vitest'
import { formatDayMonth, formatRelative } from '../src/index'

const NOW = new Date('2026-07-27T12:00:00Z')
const ago = (seconds: number) => new Date(NOW.getTime() - seconds * 1000).toISOString()

describe('formatRelative', () => {
  it.each([
    [30, 'now'],
    [-120, 'now'],
    [120, '2 minutes ago'],
    [90 * 60, '1 hour ago'],
    [26 * 3600, 'yesterday'],
    [21 * 86_400, '3 weeks ago'],
  ])('%s seconds back reads "%s" in en-GB', (seconds, label) => {
    expect(formatRelative(ago(seconds), NOW, 'en-GB')).toBe(label)
  })

  it('speaks the injected locale — CLDR grammar included', () => {
    expect(formatRelative(ago(120), NOW, 'ru')).toBe('2 минуты назад')
    expect(formatRelative(ago(26 * 3600), NOW, 'ru')).toBe('вчера')
  })
})

describe('formatDayMonth', () => {
  it('formats day + short month in the injected locale', () => {
    expect(formatDayMonth('2026-05-27T10:00:00Z', 'en-GB')).toBe('27 May')
    expect(formatDayMonth('2026-05-27T10:00:00Z', 'ru')).toBe('27 мая')
  })
})
