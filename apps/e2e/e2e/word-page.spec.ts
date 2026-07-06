import { expect, test } from '@playwright/test'

// AC-9: the word's content must be present in the RAW server-rendered HTML — no
// client JS. The `request` fixture is a plain HTTP GET (no browser, no JS), so
// what it sees is exactly what a crawler with JavaScript disabled sees.
const WORD_PATH = `/words/ja/${encodeURIComponent('言葉')}`

test.describe('public word page — SSR', () => {
  test('serves word content + JSON-LD in raw HTML with no JS (AC-2/AC-9)', async ({ request }) => {
    const res = await request.get(WORD_PATH)
    expect(res.status()).toBe(200)

    const html = await res.text()
    expect(html).toContain('言葉')
    expect(html).toContain('Language as living speech')
    expect(html).toContain('application/ld+json')
    expect(html).toContain('DefinedTerm')
    // The `<` inside the definition must be escaped so it can't break out of
    // the JSON-LD <script>.
    expect(html).not.toMatch(/"description":"[^"]*<script/i)
  })
})
