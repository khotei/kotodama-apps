import type { Meta, StoryObj } from '@storybook/react-vite'
import { DepthTabs, DepthTabsContent, DepthTabsList, DepthTabsTrigger } from './depth-tabs'

const meta: Meta<typeof DepthTabs> = {
  title: 'Molecules/DepthTabs',
  component: DepthTabs,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof DepthTabs>

export const FourDepths: Story = {
  render: () => (
    <DepthTabs defaultValue="quick" className="max-w-2xl">
      <DepthTabsList>
        <DepthTabsTrigger value="quick" numeral="I." name="Quick" sublabel="One breath" />
        <DepthTabsTrigger value="core" numeral="II." name="Core" sublabel="The everyday sense" />
        <DepthTabsTrigger value="full" numeral="III." name="Full" sublabel="Every register" />
        <DepthTabsTrigger value="scholar" numeral="IV." name="Scholar" sublabel="For the curious" />
      </DepthTabsList>
      <DepthTabsContent value="quick" className="pt-4 font-serif text-lg">
        A butterfly — the day-flying insect with wide, often colorful wings.
      </DepthTabsContent>
      <DepthTabsContent value="core" className="pt-4 font-serif text-lg">
        The everyday word for a butterfly; figuratively, a fickle or flighty person.
      </DepthTabsContent>
      <DepthTabsContent value="full" className="pt-4 font-serif text-lg">
        All registers, from playground to poetry.
      </DepthTabsContent>
      <DepthTabsContent value="scholar" className="pt-4 font-serif text-lg">
        Attested 1490; from María + posarse.
      </DepthTabsContent>
    </DepthTabs>
  ),
}
