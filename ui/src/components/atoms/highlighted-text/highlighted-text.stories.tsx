import type { Meta, StoryObj } from '@storybook/react-vite'
import { HighlightedText } from './highlighted-text'

const meta: Meta<typeof HighlightedText> = {
  title: 'Atoms/HighlightedText',
  component: HighlightedText,
}

export default meta

type Story = StoryObj<typeof HighlightedText>

export const Match: Story = { args: { text: 'mariposa', query: 'ripo' } }
export const CaseInsensitive: Story = { args: { text: 'Mariposa', query: 'MAR' } }
export const NoMatch: Story = { args: { text: 'mariposa', query: 'xyz' } }
export const EmptyQuery: Story = { args: { text: 'mariposa', query: '' } }
