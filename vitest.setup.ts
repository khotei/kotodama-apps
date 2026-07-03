// Global Vitest setup, applied to every workspace via vitest.base.ts.
//
// - Registers @testing-library/jest-dom matchers (`toBeInTheDocument`, …).
// - Unmounts React trees + clears the jsdom document after each test so a
//   render in one test can't leak into the next (Testing Library's `cleanup`).
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
