import { describe, expect, it } from 'vitest'
import { plotSparkline } from '../src/components/atoms/sparkline/sparkline'

describe('plotSparkline', () => {
  it('spans the full width and inverts y so larger values sit higher', () => {
    const points = plotSparkline([0, 10])
    expect(points[0]).toEqual({ x: 0, y: 30 })
    expect(points[1]).toEqual({ x: 100, y: 2 })
  })

  it('draws a flat series as the vertical midline', () => {
    for (const point of plotSparkline([7, 7, 7])) {
      expect(point.y).toBe(16)
    }
  })
})
