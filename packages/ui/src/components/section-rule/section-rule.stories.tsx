import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionRule } from './section-rule'

const meta: Meta<typeof SectionRule> = {
  title: 'Atoms/SectionRule',
  component: SectionRule,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof SectionRule>

export const Default: Story = {
  args: { label: 'Word of the day' },
}

export const WithMeta: Story = {
  args: { label: 'The reading room', meta: 'Recent activity · updates hourly' },
}
