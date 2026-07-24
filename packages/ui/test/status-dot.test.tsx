import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusDot } from '../src/index'

describe('StatusDot', () => {
  it('renders a dot styled by status and forwards className', () => {
    const { container } = render(<StatusDot status="generating" className="ml-2" />)
    const dot = container.querySelector('span')

    expect(dot).toHaveClass('ml-2')
    expect(dot).toHaveClass('bg-seal')
  })
})
