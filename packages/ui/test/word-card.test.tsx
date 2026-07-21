import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WordCard } from '../src/index'

// The one skeleton component (jsdom), the unit counterpart to its Storybook
// story — proves it mounts + shows its props. It consumes the shared canonical
// WordStatus and renders status through StatusBadge (no private enum).
describe('WordCard', () => {
  it('renders the word, language, ready status badge, and definition', () => {
    render(<WordCard word="lumen" language="en" status="ready" coreDefinition="A unit of light." />)

    expect(screen.getByRole('heading', { name: 'lumen' })).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('A unit of light.')).toBeInTheDocument()
  })

  it('shows the generating status and a placeholder when the definition is not ready', () => {
    render(<WordCard word="lumen" language="en" status="generating" />)

    expect(screen.getByText('Generating…')).toBeInTheDocument()
    expect(screen.getByText(/still being generated/)).toBeInTheDocument()
  })
})
