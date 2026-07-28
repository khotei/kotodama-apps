import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookOpenIcon, SparklesIcon } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command'

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
}

export default meta

type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => (
    <Command className="max-w-md rounded-lg border">
      <CommandInput placeholder="Search words, or type a new one…" />
      <CommandList>
        <CommandEmpty>No words found.</CommandEmpty>
        <CommandGroup heading="Words">
          <CommandItem>
            <BookOpenIcon />
            mariposa
          </CommandItem>
          <CommandItem>
            <BookOpenIcon />
            sobremesa
          </CommandItem>
          <CommandItem>
            <BookOpenIcon />
            madrugar
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <SparklesIcon />
            Generate a new word
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
