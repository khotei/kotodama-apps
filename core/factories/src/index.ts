// Own subpath so no shipped-code graph ever imports faker (Biome-banned there) —
// the mirror of the backend's `@kotodama/database/factories`.
export * from './words/word.factory'
