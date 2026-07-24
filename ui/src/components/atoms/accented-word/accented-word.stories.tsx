import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccentedWordMark } from './accented-word'

const meta: Meta<typeof AccentedWordMark> = {
  title: 'Atoms/AccentedWordMark',
  component: AccentedWordMark,
  decorators: [
    (Story) => (
      <span className="font-serif text-4xl">
        <Story />
      </span>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AccentedWordMark>

export const Stressed: Story = { args: { word: { pre: 'mari', stress: 'po', post: 'sa' } } }
export const Unstressed: Story = { args: { word: { pre: 'sobremesa' } } }
