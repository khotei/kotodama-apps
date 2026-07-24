import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FilterChip } from '../src/index'

describe('FilterChip', () => {
  it('reflects the pressed state via aria-pressed', () => {
    const { rerender } = render(<FilterChip pressed={false}>Saved only</FilterChip>)
    const button = screen.getByRole('button', { name: /saved only/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    rerender(<FilterChip pressed>Saved only</FilterChip>)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onPressedChange with the toggled value on click', () => {
    const onPressedChange = vi.fn()
    render(
      <FilterChip pressed={false} onPressedChange={onPressedChange}>
        Saved only
      </FilterChip>,
    )

    fireEvent.click(screen.getByRole('button', { name: /saved only/i }))
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })
})
