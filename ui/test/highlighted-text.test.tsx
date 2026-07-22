import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HighlightedText } from '../src/index'

describe('HighlightedText', () => {
  it('wraps the matched substring in a <mark>', () => {
    const { container } = render(<HighlightedText text="mariposa" query="ripo" />)
    const mark = container.querySelector('mark')

    expect(mark).not.toBeNull()
    expect(mark).toHaveTextContent('ripo')
    expect(container).toHaveTextContent('mariposa')
  })

  it('renders plain text when the query is empty', () => {
    const { container } = render(<HighlightedText text="mariposa" query="" />)

    expect(container.querySelector('mark')).toBeNull()
    expect(container).toHaveTextContent('mariposa')
  })

  it('renders plain text when there is no match', () => {
    const { container } = render(<HighlightedText text="mariposa" query="zzz" />)

    expect(container.querySelector('mark')).toBeNull()
  })
})
