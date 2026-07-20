import { expect, test } from '@playwright/test'

// AC-9: the word's content must be present in the RAW server-rendered HTML — no
// client JS. The `request` fixture is a plain HTTP GET (no browser, no JS), so
// what it sees is exactly what a crawler with JavaScript disabled sees.
//
// Runs against a REAL backend (see apps/e2e/CLAUDE.md), so it asserts STRUCTURE
// — the word is present and wrapped in a JSON-LD DefinedTerm — not the exact
// definition text, which the backend generates per word and is not fixed. The
// target backend must have this word seeded + succeeded.
const WORD_PATH = `/words/ja/${encodeURIComponent('言葉')}`

test.describe('public word page — SSR', () => {
  test('serves word content + JSON-LD in raw HTML with no JS (AC-2/AC-9)', async ({ request }) => {
    const res = await request.get(WORD_PATH)
    expect(res.status()).toBe(200)

    const html = await res.text()
    expect(html).toContain('言葉')
    expect(html).toContain('application/ld+json')
    expect(html).toContain('DefinedTerm')
    // The `<` inside the definition must be escaped so it can't break out of
    // the JSON-LD <script>.
    expect(html).not.toMatch(/"description":"[^"]*<script/i)
  })
})
