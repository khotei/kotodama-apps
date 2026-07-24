import type { StorybookConfig } from '@storybook/react-vite'

// Storybook is the fe-ui catalog (D3): it consumes the first-class fe-ui package
// directly. The @storybook/react-vite builder is the ONLY place Vite appears —
// never as the app bundler (D2); Bun builds apps/web.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
