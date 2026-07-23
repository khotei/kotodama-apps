import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteShell } from './site-shell'

const meta: Meta<typeof SiteShell> = {
  title: 'Templates/SiteShell',
  component: SiteShell,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof SiteShell>

export const Default: Story = {
  render: () => (
    <SiteShell>
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Site content sits on the paper-grain backdrop
      </div>
    </SiteShell>
  ),
}
