import { ImageResponse } from 'next/og'

// Static OG card for a word page. Renders the word straight from the route
// segment (no backend fetch — so it prerenders even without the API up); Satori
// takes inline styles only, so brand colors are literal here, not @theme tokens.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BRAND = '#5b21b6'

export default async function Image({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}) {
  const { language, word } = await params
  const decodedWord = decodeURIComponent(word)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 24,
        padding: 96,
        background: '#0b0611',
        color: '#faf5ff',
      }}
    >
      <div style={{ fontSize: 40, letterSpacing: 8, color: BRAND, textTransform: 'uppercase' }}>
        Kotodama · {language}
      </div>
      <div style={{ fontSize: 140, fontWeight: 700, lineHeight: 1.1 }}>{decodedWord}</div>
    </div>,
    size,
  )
}
