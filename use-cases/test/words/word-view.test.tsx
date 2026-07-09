import type { WordStateModel } from '@kotodama/store'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WordView } from '../../src/words/word-view'

// use-cases owns the domain → view mapping: assert each branch renders the right card.
// A pure function of its `model` prop (data is RSC-resolved by the app).

describe('WordView', () => {
  it('maps an unready state to a building status', () => {
    const model: WordStateModel = { kind: 'unready', status: 'running', stages: [] }
    render(<WordView model={model} language="ja" word="言葉" />)
    expect(screen.getByText('Building…')).toBeInTheDocument()
  })

  it('shows a not-built message when the word is absent (null)', () => {
    render(<WordView model={null} language="ja" word="missing" />)
    expect(screen.getByText('This word has not been built yet.')).toBeInTheDocument()
  })
})
