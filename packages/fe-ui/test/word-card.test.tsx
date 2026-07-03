import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UiProvider, WordCard } from '../src/index'

// Renders the one skeleton component under the real Chakra provider (jsdom), the
// unit counterpart to its Storybook story — proves it mounts + shows its props.
describe('WordCard', () => {
  it('renders the word, language, ready status, and definition', () => {
    render(
      <UiProvider>
        <WordCard word="lumen" language="en" status="succeeded" coreDefinition="A unit of light." />
      </UiProvider>,
    )

    expect(screen.getByRole('heading', { name: 'lumen' })).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('A unit of light.')).toBeInTheDocument()
  })

  it('shows a placeholder when the definition is still generating', () => {
    render(
      <UiProvider>
        <WordCard word="lumen" language="en" status="running" />
      </UiProvider>,
    )

    expect(screen.getByText('Building…')).toBeInTheDocument()
    expect(screen.getByText(/still being generated/)).toBeInTheDocument()
  })
})
