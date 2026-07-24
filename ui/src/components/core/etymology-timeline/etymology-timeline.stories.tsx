import type { Meta, StoryObj } from '@storybook/react-vite'
import { EtymologyTimeline } from './etymology-timeline'

const meta: Meta<typeof EtymologyTimeline> = {
  title: 'Core/EtymologyTimeline',
  component: EtymologyTimeline,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof EtymologyTimeline>

export const FourSteps: Story = {
  args: {
    steps: [
      { when: 's. XIII', form: 'María pósate', note: 'a children’s rhyme — "Mary, alight"' },
      { when: 's. XV', form: 'mariposa', note: 'the fused form settles' },
      { when: '1611', form: 'mariposa', note: 'Covarrubias records the modern sense' },
      { when: 'today', form: 'mariposa', note: 'standard across all registers' },
    ],
  },
}
