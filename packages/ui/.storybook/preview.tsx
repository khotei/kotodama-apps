import type { Preview } from '@storybook/react-vite'

// Stories render the components directly — Tailwind + shadcn primitives are
// plain class strings, so there is no provider to wrap. (Tailwind CSS wiring for
// the Storybook build is a follow-up.)
const preview: Preview = {}

export default preview
