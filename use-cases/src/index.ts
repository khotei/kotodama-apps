// @kotodama/use-cases — platform-agnostic React feature hooks (mirrors the
// backend `use-cases/`) + the transport-client context. No DOM, no Chakra
// (tsc-enforced): a future desktop/native app reuses these; the web rendering
// lives in apps/web.
export { ApiClientProvider, useApiClient } from './api-client-context'
export { useWord } from './words/use-word'
