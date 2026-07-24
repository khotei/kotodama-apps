import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@kotodama/fe-theme'
import type { ReactNode } from 'react'

// The single Chakra provider bound to fe-theme's system. apps/web wraps both its
// SSR entry and its client entry with this so server and client render against
// the SAME system (a mismatch would cause hydration drift).
export function UiProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
