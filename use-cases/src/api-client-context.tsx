import type { ApiClient } from '@kotodama/api-client'
import { createContext, type ReactNode, useContext } from 'react'

// The React-level injection point for the transport client. Platform-agnostic
// (React context, no DOM) so a use-case hook reads the client without every
// hook taking it as a parameter. Apps provide it once at their root.
const ApiClientContext = createContext<ApiClient | null>(null)

export function ApiClientProvider({
  client,
  children,
}: {
  client: ApiClient
  children: ReactNode
}) {
  return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext)
  if (!client) throw new Error('useApiClient must be used within an ApiClientProvider')
  return client
}
