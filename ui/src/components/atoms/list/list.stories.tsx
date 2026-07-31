import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { pad2 } from '../../../lib/pad2'
import { List, ListItem } from './list'

const meta: Meta<typeof List> = {
  title: 'Atoms/List',
  component: List,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof List>

const words = ['mariposa', 'sobremesa', 'madrugar', 'estrenar']

/** `ordered divided`: the ruled, numbered frame the reading room sits on. */
export const Divided: Story = {
  render: () => (
    <List ordered divided className="max-w-md">
      {words.map((word, i) => (
        <ListItem key={word} className="flex items-baseline gap-md px-xs py-md">
          <span className="font-mono text-sm text-faint-foreground tracking-wider">
            {pad2(i + 1)}
          </span>
          <span className="font-serif text-xl font-medium">{word}</span>
        </ListItem>
      ))}
    </List>
  ),
}

/** Bare `<ul>`, no dividers — the composer sets its own rhythm from above. */
export const Plain: Story = {
  render: () => (
    <List className="flex max-w-md flex-col gap-xs">
      {words.map((word) => (
        <ListItem key={word} className="font-serif text-lg">
          {word}
        </ListItem>
      ))}
    </List>
  ),
}
