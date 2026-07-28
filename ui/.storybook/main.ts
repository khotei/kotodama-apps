import type { StorybookConfig } from '@storybook/nextjs-vite'

// Storybook is the ui catalog (D3): it consumes the first-class ui package
// directly. The @storybook/nextjs-vite builder is the ONLY place Vite appears —
// never as the app bundler (apps/web is Next/Turbopack) — and it mocks the
// next/* modules (link, navigation) that ui components import.
const config: StorybookConfig = {
  // The whole presentational stack now lives in ui: atoms → molecules →
  // organisms → templates → pages, each co-located with its story.
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },

  // Tailwind v4's own Vite plugin processes the `@import "tailwindcss"` in
  // styles.css (imported by preview.tsx) and auto-detects the component classes
  // under ../src, so stories render with the real design-system styling.
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    config.plugins ??= []
    config.plugins.push(tailwindcss())
    return config
  },

  addons: ['@storybook/addon-mcp', '@storybook/addon-a11y'],
}

export default config
