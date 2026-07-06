import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

// The design-system stylesheet (Tailwind + tokens) is loaded once here so every
// story renders with real styling; @tailwindcss/vite (see main.ts) compiles it.
// No provider to wrap — shadcn primitives are plain class strings.
const preview: Preview = {}

export default preview
