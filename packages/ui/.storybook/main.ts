import type { StorybookConfig } from '@storybook/react-vite'

// Storybook is the ui catalog (D3): it consumes the first-class ui package
// directly. The @storybook/react-vite builder is the ONLY place Vite appears —
// never as the app bundler (apps/web is Next/Turbopack).
const config: StorybookConfig = {
  // The catalog spans the presentational stack: ui atoms/molecules co-located
  // here + use-cases organisms/pages co-located there. ui stays a leaf — its
  // LIBRARY imports nothing internal; only this dev catalog reaches up.
  stories: ['../src/**/*.stories.@(ts|tsx)', '../../../use-cases/src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
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
}

export default config
