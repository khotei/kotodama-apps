import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>mariposa</CardTitle>
        <CardDescription>Spanish · noun, feminine</CardDescription>
      </CardHeader>
      <CardContent>A butterfly; figuratively, a fickle or flighty person.</CardContent>
      <CardFooter>
        <Button variant="outline">Open entry</Button>
      </CardFooter>
    </Card>
  ),
}
