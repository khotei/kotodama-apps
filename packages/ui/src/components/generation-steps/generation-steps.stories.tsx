import type { Meta, StoryObj } from '@storybook/react-vite'
import { GenerationSteps } from './generation-steps'

const meta: Meta<typeof GenerationSteps> = {
  title: 'Molecules/GenerationSteps',
  component: GenerationSteps,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof GenerationSteps>

export const InProgress: Story = {
  args: {
    steps: [
      { label: 'Reading the sources', state: 'done', timing: '0.8s' },
      { label: 'Writing the four depths', state: 'done', timing: '2.1s' },
      { label: 'Tracing the etymology', state: 'active' },
      { label: 'Gathering the voices', state: 'pending' },
      { label: 'Setting the entry', state: 'pending' },
    ],
    className: 'max-w-md',
  },
}
