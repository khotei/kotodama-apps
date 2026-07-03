#!/usr/bin/env bun
import { fileURLToPath } from 'node:url'
import { buildClient } from '../src/build-client'
import { renderPage } from '../src/entry-server'
import { renderDocument } from '../src/html-template'

// SSG prerender (AC-14): render each public route to a static HTML artifact that
// still hydrates (it embeds the dehydrated cache + the client bundle). This is
// the "crawler-visible + interactive" build output for public word pages.
const ROUTES = ['/words/en/lumen']

const distDir = fileURLToPath(new URL('../dist', import.meta.url))
await buildClient(`${distDir}/client`)

for (const route of ROUTES) {
  const { html, dehydratedState } = await renderPage(route)
  const doc = renderDocument({ appHtml: html, dehydratedState, clientScript: '/entry-client.js' })
  const out = `${distDir}/prerender${route}.html`
  await Bun.write(out, doc)
  console.log(`prerendered ${route} → ${out}`)
}
