import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Button } from './button'
import { Toaster } from './sonner'

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toaster',
  component: Toaster,
}

export default meta

type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast('Saved “mariposa”', {
            description: 'Added to your review list.',
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  ),
}
