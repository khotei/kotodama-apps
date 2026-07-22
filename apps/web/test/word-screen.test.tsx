import type { WordStateModel } from '@kotodama/store'
import { WordScreen } from '@kotodama/ui'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// The slice test at the app boundary: the app injects its `WordStateModel` (from
// the store domain tier) into the `@kotodama/ui` WordScreen, which declares its own
// view type — this asserts the model is structurally accepted + renders as wired.

describe('word feature (app consumption)', () => {
  it('renders the word screen from @kotodama/ui with the store model', () => {
    const model: WordStateModel = { kind: 'unready', status: 'running', stages: [] }
    render(
      <WordScreen model={model} language="ja" word="言葉" libraryHref="/" searchHref="/search" />,
    )
    expect(screen.getByText('Generating…')).toBeInTheDocument()
  })
})
