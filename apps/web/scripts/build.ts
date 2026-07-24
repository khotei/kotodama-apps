#!/usr/bin/env bun
import { fileURLToPath } from 'node:url'
import { buildClient } from '../src/build-client'

// Production build: bundle the client for the browser. SSG prerendering of
// public routes runs via `bun run prerender` (kept a separate step so it can
// point at a real backend). Vite is never the app bundler (D2) — Bun builds it.
const distDir = fileURLToPath(new URL('../dist', import.meta.url))
const out = await buildClient(`${distDir}/client`)
console.log(`built client bundle → ${out}`)
