import type { Meta, StoryObj } from '@storybook/react-vite'
import type { WordBuildStages } from '../../../views/word.view'
import {
  WORD_BUILD_STAGE_SEQUENCE,
  WordFailedView,
  WordGeneratingView,
  WordNotFoundView,
} from './word-build-view'

const runningStages: WordBuildStages = WORD_BUILD_STAGE_SEQUENCE.map((stage, i) => ({
  stage,
  status: i === 0 ? 'succeeded' : i === 1 ? 'running' : 'pending',
}))

const failedStages: WordBuildStages = WORD_BUILD_STAGE_SEQUENCE.map((stage, i) =>
  i === 1
    ? { stage, status: 'failed', error: { message: 'source timed out', type: 'timed_out' } }
    : { stage, status: i === 0 ? 'succeeded' : 'pending' },
)

const meta: Meta = {
  title: 'Organisms/WordBuild',
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj

export const Generating: Story = {
  render: () => <WordGeneratingView word="empalagar" stages={runningStages} backHref="/" />,
}

export const Queued: Story = {
  render: () => (
    <WordGeneratingView
      word="resquemor"
      status="pending"
      stages={WORD_BUILD_STAGE_SEQUENCE.map((stage) => ({ stage, status: 'pending' }))}
      backHref="/"
    />
  ),
}

export const Failed: Story = {
  render: () => <WordFailedView word="merendar" stages={failedStages} backHref="/" />,
}

export const NotFound: Story = {
  render: () => (
    <WordNotFoundView word="alfombrilla" languageName="Spanish" backHref="/" searchHref="/search" />
  ),
}
