import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import './preview.css'

// The design-system stylesheet (Tailwind + tokens) is loaded once here so every
// story renders with real styling; @tailwindcss/vite (see main.ts) compiles it.
// No provider to wrap — shadcn primitives are plain class strings.

// `.dark` goes on <html>, not a wrapper <div> — tokens remap via the :root/.dark
// cascade, exactly as next-themes does it in apps/web.
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return <Story />
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design-system theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    backgrounds: { disable: true },
  },
}

export default preview
