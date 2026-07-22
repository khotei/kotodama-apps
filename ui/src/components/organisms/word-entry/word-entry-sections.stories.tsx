import type { Meta, StoryObj } from '@storybook/react-vite'
import { READY_WORD_FIXTURE } from '../../../fixtures/word.fixture'
import { ConnectionsSection } from './connections-section'
import { EntryAside } from './entry-aside'
import { MeaningSection } from './meaning-section'
import { OriginsSection } from './origins-section'
import { PicturesSection } from './pictures-section'
import { SourcesSection } from './sources-section'
import { VoicesSection } from './voices-section'

const meta: Meta = {
  title: 'Organisms/WordEntrySections',
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[760px] px-5">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Meaning: Story = { render: () => <MeaningSection tiers={READY_WORD_FIXTURE.tiers} /> }

export const Pictures: Story = {
  render: () => <PicturesSection visuals={READY_WORD_FIXTURE.visuals} />,
}

export const Origins: Story = {
  render: () => (
    <OriginsSection
      etymology={READY_WORD_FIXTURE.etymology}
      culturalGuide={READY_WORD_FIXTURE.culturalGuide}
    />
  ),
}

export const Voices: Story = {
  render: () => <VoicesSection voices={READY_WORD_FIXTURE.authorExamples} />,
}

export const Connections: Story = {
  render: () => (
    <ConnectionsSection
      relations={READY_WORD_FIXTURE.relations}
      translations={READY_WORD_FIXTURE.translations}
    />
  ),
}

export const Sources: Story = {
  render: () => <SourcesSection sources={READY_WORD_FIXTURE.sources} />,
}

export const Aside: Story = {
  render: () => (
    <div className="max-w-[300px]">
      <EntryAside
        word={READY_WORD_FIXTURE}
        nav={[
          ['sec-meaning', 'Meaning'],
          ['sec-pictures', 'In pictures'],
        ]}
      />
    </div>
  ),
}
