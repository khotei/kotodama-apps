import type { WordStateModel } from '@kotodama/store'
import { WordView } from '@kotodama/use-cases'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// The slice test at the app boundary: the app consumes the `@kotodama/use-cases`
// feature package and renders it. Branch coverage of the mapping lives in use-cases;
// here we assert the package integrates (resolves + renders) as the app wires it.

describe('word feature (app consumption)', () => {
  it('renders the feature view from @kotodama/use-cases', () => {
    const model: WordStateModel = { kind: 'unready', status: 'running', stages: [] }
    render(<WordView model={model} language="ja" word="言葉" />)
    expect(screen.getByText('Building…')).toBeInTheDocument()
  })
})
