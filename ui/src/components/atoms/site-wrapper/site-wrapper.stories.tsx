import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SiteWrapper } from './site-wrapper'

const meta: Meta<typeof SiteWrapper> = {
  title: 'Atoms/SiteWrapper',
  component: SiteWrapper,
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof SiteWrapper>

export const Default: Story = {
  render: () => (
    <div className="bg-muted py-2xl">
      <SiteWrapper>
        <div className="grid h-40 place-items-center rounded-lg border border-border-strong border-dashed bg-card text-center text-muted-foreground">
          Centered at the site max-width, inset by the page gutter
          <br />
          (the tinted band is the full viewport width)
        </div>
      </SiteWrapper>
    </div>
  ),
}
