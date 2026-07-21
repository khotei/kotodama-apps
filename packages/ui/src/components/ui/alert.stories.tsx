import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleAlertIcon, InfoIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
}

export default meta

type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Entry is still generating</AlertTitle>
      <AlertDescription>The full definition will appear once the build settles.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <CircleAlertIcon />
      <AlertTitle>Generation failed</AlertTitle>
      <AlertDescription>A source timed out. Retry to re-queue the build.</AlertDescription>
    </Alert>
  ),
}
