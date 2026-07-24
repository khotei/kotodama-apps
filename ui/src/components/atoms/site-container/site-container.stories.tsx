import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteContainer } from './site-container'

const meta: Meta<typeof SiteContainer> = {
  title: 'Atoms/SiteContainer',
  component: SiteContainer,
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof SiteContainer>

export const Default: Story = {
  render: () => (
    <div className="bg-muted py-10">
      <SiteContainer>
        <div className="grid h-40 place-items-center rounded-lg border border-border-strong border-dashed bg-card text-center text-muted-foreground">
          Centered at the site max-width, inset by the page gutter
          <br />
          (the tinted band is the full viewport width)
        </div>
      </SiteContainer>
    </div>
  ),
}
