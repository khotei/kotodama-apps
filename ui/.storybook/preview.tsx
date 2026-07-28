import type { Decorator, Preview } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import '../src/styles.css'

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
  // Autodocs everywhere: every component gets a generated Docs page (args table +
  // stories), so the Storybook MCP serves real prop contracts to the agent, not a
  // bare canvas. Per-story `tags: ['!autodocs']` opts a noisy one out.
  tags: ['autodocs'],

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
    // Sidebar sections read as the component ladder (small → large), not
    // alphabetically: vendor primitives → domain-free kit → domain → assembly.
    options: {
      storySort: {
        order: ['UI', 'Atoms', 'Molecules', 'Organisms', 'Core', 'Features', 'Templates', 'Pages'],
      },
    },
    backgrounds: { disable: true },
    // App Router mocks: usePathname/useRouter come from the framework; a story
    // sets its route via `parameters.nextjs.navigation` (pathname defaults to `/`).
    nextjs: { appDirectory: true },
    // Populate the viewport toolbar with the stock device set; mobile-only stories
    // (MobileTabBar, CommandFab) pin themselves to a phone via `globals.viewport`.
    viewport: { options: INITIAL_VIEWPORTS },
  },
}

export default preview
