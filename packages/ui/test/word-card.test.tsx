import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WordCard } from '../src/index'

// The one skeleton component (jsdom), the unit counterpart to its Storybook
// story — proves it mounts + shows its props. No provider: Tailwind + shadcn
// primitives are plain class strings, nothing to wrap.
describe('WordCard', () => {
  it('renders the word, language, ready status, and definition', () => {
    render(
      <WordCard word="lumen" language="en" status="succeeded" coreDefinition="A unit of light." />,
    )

    expect(screen.getByRole('heading', { name: 'lumen' })).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('A unit of light.')).toBeInTheDocument()
  })

  it('shows a placeholder when the definition is still generating', () => {
    render(<WordCard word="lumen" language="en" status="running" />)

    expect(screen.getByText('Building…')).toBeInTheDocument()
    expect(screen.getByText(/still being generated/)).toBeInTheDocument()
  })
})
