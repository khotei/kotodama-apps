import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
}

export default meta

type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="meaning" className="max-w-md">
      <TabsList aria-label="Sections">
        <TabsTrigger value="meaning">Meaning</TabsTrigger>
        <TabsTrigger value="origins">Origins</TabsTrigger>
        <TabsTrigger value="voices">Voices</TabsTrigger>
      </TabsList>
      <TabsContent value="meaning">The everyday sense of the word.</TabsContent>
      <TabsContent value="origins">Where the word comes from.</TabsContent>
      <TabsContent value="voices">How writers have used it.</TabsContent>
    </Tabs>
  ),
}

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="meaning" className="max-w-md">
      <TabsList variant="line" aria-label="Sections">
        <TabsTrigger value="meaning">Meaning</TabsTrigger>
        <TabsTrigger value="origins">Origins</TabsTrigger>
        <TabsTrigger value="voices">Voices</TabsTrigger>
      </TabsList>
      <TabsContent value="meaning">The everyday sense of the word.</TabsContent>
      <TabsContent value="origins">Where the word comes from.</TabsContent>
      <TabsContent value="voices">How writers have used it.</TabsContent>
    </Tabs>
  ),
}
