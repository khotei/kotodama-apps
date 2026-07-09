import type { WordStateModel } from '@kotodama/store'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WordScreen } from '../../src/words/word-screen'

// use-cases owns the domain → view mapping: assert each model branch selects
// the right screen state. A pure function of its `model` prop.

const HREFS = { libraryHref: '/', searchHref: '/search' }

describe('WordScreen', () => {
  it('maps an absent word (null) to the not-found state', () => {
    render(<WordScreen model={null} language="es" word="resquemor" {...HREFS} />)
    expect(screen.getByText('Not in your library yet')).toBeInTheDocument()
    expect(screen.getByText('Create this entry')).toBeInTheDocument()
  })

  it('maps a running build to the generating state with its real stages', () => {
    const model: WordStateModel = {
      kind: 'unready',
      status: 'running',
      stages: [
        { stage: 'fetch_source', status: 'succeeded' },
        { stage: 'enrich_etymology', status: 'running' },
        { stage: 'final_review', status: 'pending' },
      ],
    }
    render(<WordScreen model={model} language="es" word="empalagar" {...HREFS} />)
    expect(screen.getByText('Generating…')).toBeInTheDocument()
    expect(screen.getByText('Tracing the etymology')).toBeInTheDocument()
  })

  it('maps a failed build to the failed state with the error code', () => {
    const model: WordStateModel = {
      kind: 'unready',
      status: 'failed',
      stages: [
        { stage: 'fetch_source', status: 'succeeded' },
        { stage: 'enrich_etymology', status: 'failed', error: { message: 'x', type: 'timed_out' } },
      ],
    }
    render(<WordScreen model={model} language="es" word="merendar" {...HREFS} />)
    expect(screen.getByText('This entry didn’t finish')).toBeInTheDocument()
    expect(screen.getByText(/error: timed_out · step 2 of 2/)).toBeInTheDocument()
  })
})
