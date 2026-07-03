import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { semantic } from '@kotodama/fe-tokens'

// @kotodama/fe-theme — the Chakra `createSystem` config over fe-tokens' semantic
// tokens. Web-only (Chakra is DOM-bound), but it consumes ONLY the neutral
// semantic contract from fe-tokens (intent names, never raw primitives), so a
// native `ui` can re-implement the same contract against a different engine.
//
// Kept a separate package (not folded into fe-ui) precisely because this
// semantic-token contract is the web↔native seam, and both fe-ui and Storybook
// consume it.

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

/** The Chakra system every web consumer (fe-ui, apps/web, Storybook) provides. */
export const system = createSystem(defaultConfig, config)
