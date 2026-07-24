import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResultRow } from './result-row'

const meta: Meta<typeof ResultRow> = {
  title: 'Core/ResultRow',
  component: ResultRow,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof ResultRow>

const highlight = (
  <>
    <mark className="rounded-xs bg-primary/10 text-primary">mar</mark>iposa
  </>
)

export const List: Story = {
  render: () => (
    <div className="max-w-2xl border-border border-t">
      <ResultRow
        href="#"
        word={highlight}
        ipa="/ma.ɾiˈpo.sa/"
        pos="noun · f."
        gloss="butterfly; a fickle or flighty person"
        saved
      />
      <ResultRow
        href="#"
        word="marea"
        ipa="/maˈɾe.a/"
        pos="noun · f."
        gloss="tide; a swelling crowd or feeling"
      />
      <ResultRow href="#" word="marchito" status="generating" statusNote="Spanish · arriving" />
      <ResultRow href="#" word="margen" status="pending" statusNote="Spanish · queued" />
      <ResultRow href="#" word="marasmo" status="failed" statusNote="Spanish · didn’t settle" />
    </div>
  ),
}
