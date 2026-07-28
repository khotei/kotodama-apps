import { Toaster } from '@kotodama/ui'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SaveWordButton } from './save-word-button.client'

const meta: Meta<typeof SaveWordButton> = {
  title: 'Core/SaveWordButton',
  component: SaveWordButton,
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
type Story = StoryObj<typeof SaveWordButton>

export const Hero: Story = { args: { word: 'mariposa', look: 'hero' } }
export const HeroSaved: Story = { args: { word: 'mariposa', look: 'hero', initialSaved: true } }
export const Wotd: Story = { args: { word: 'mariposa', look: 'wotd' } }
export const Ghost: Story = { args: { word: 'mariposa', look: 'ghost' } }
