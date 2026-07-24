// Ambient augmentation so `tsc` sees the @testing-library/jest-dom matchers
// (`toBeInTheDocument`, …) on Vitest's `expect`. The matchers are REGISTERED at
// runtime by vitest.setup.ts; this file makes them visible to the type-checker.
// DOM workspaces (apps/web, packages/fe-{ui,theme}) include it via tsconfig; the
// /new-package --dom scaffold wires it in for future ones.
import '@testing-library/jest-dom/vitest'
