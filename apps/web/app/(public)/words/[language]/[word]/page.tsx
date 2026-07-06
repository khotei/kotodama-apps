import { WordCard } from '@kotodama/ui'

export const revalidate = 10
export const dynamicParams = true

export function generateStaticParams() {
  // Decoded, NOT percent-encoded — Next matches the decoded segment (gate f).
  return [{ language: 'ja', word: '言葉' }]
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}) {
  const { language, word } = await params
  const decodedWord = decodeURIComponent(word)
  return (
    <main className="min-h-dvh bg-background p-8">
      <WordCard
        word={decodedWord}
        language={language}
        status="succeeded"
        coreDefinition={`A placeholder definition for “${decodedWord}”. The real word-fetch data path (RSC prefetch → dehydrate → useWord) lands in the next task.`}
      />
    </main>
  )
}
