import type { Meta, StoryObj } from '@storybook/react-vite'
import { Show } from './show'

// Resize the preview across the `md` (768px) line to watch the two swap.
const meta: Meta<typeof Show> = {
  title: 'Atoms/Show',
  component: Show,
}

export default meta
type Story = StoryObj<typeof Show>

export const Responsive: Story = {
  render: () => (
    <div className="flex gap-2">
      <Show on="mobile">
        <span className="rounded bg-seal px-3 py-1 text-seal-foreground text-sm">On mobile</span>
      </Show>
      <Show on="desktop">
        <span className="rounded bg-foreground px-3 py-1 text-background text-sm">On desktop</span>
      </Show>
    </div>
  ),
}
