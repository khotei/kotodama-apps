import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PosPill } from '../src/index'

describe('PosPill', () => {
  it('renders its content and forwards className last-wins', () => {
    render(<PosPill className="test-cls">n.</PosPill>)
    const pill = screen.getByText('n.')

    expect(pill).toHaveClass('test-cls')
  })
})
