import { Toaster } from '@kotodama/ui'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WordSaveButton } from './word-save-button.client'

const meta: Meta<typeof WordSaveButton> = {
  title: 'Core/WordSaveButton',
  component: WordSaveButton,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WordSaveButton>

export const Hero: Story = { args: { word: 'mariposa', look: 'hero' } }
export const HeroSaved: Story = { args: { word: 'mariposa', look: 'hero', initialSaved: true } }
export const Wotd: Story = { args: { word: 'mariposa', look: 'wotd' } }
export const Ghost: Story = { args: { word: 'mariposa', look: 'ghost' } }
