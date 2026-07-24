import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { semantic } from './tokens'

// The Chakra `createSystem` config over the semantic token contract (part of
// @kotodama/ui). It consumes ONLY the neutral semantic intents (`bg.canvas`,
// never a raw primitive), so a future native ui can re-implement the same
// contract against a different engine — the web↔native seam.

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: semantic.bg.canvas },
          surface: { value: semantic.bg.surface },
        },
        fg: {
          default: { value: semantic.fg.default },
          muted: { value: semantic.fg.muted },
        },
        border: {
          subtle: { value: semantic.border.subtle },
        },
        accent: {
          default: { value: semantic.accent.default },
          emphasis: { value: semantic.accent.emphasis },
        },
      },
    },
  },
})

/** The Chakra system every web consumer (ui, apps/web, Storybook) provides. */
export const system = createSystem(defaultConfig, config)
