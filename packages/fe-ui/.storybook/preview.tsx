import type { Preview } from '@storybook/react-vite'
import { UiProvider } from '../src/provider'

// Every story renders under the real Chakra system (fe-theme), so a story is a
// faithful render of the component as apps/web mounts it — the story-as-test
// the frontend-testing rule relies on.
const preview: Preview = {
  decorators: [
    (Story) => (
      <UiProvider>
        <Story />
      </UiProvider>
    ),
  ],
}

export default preview
