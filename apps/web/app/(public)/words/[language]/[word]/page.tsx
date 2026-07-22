import type { Language, ReadyWord } from '@kotodama/core/store'
import { WordScreen } from '@kotodama/ui'
import type { Metadata } from 'next'
import { getWordStatus, refreshWordPage, requestWordBuild } from '@/src/server/words/word.actions'
import { getWordState } from '@/src/server/words/word.loader'
import { WORD_SEED } from '@/src/word-seed'
import { WordStatusPoller } from '@/src/words/word-status-poller.client'

export const revalidate = 10
export const dynamicParams = true

export function generateStaticParams() {
  // Decoded, NOT percent-encoded — Next matches the decoded segment (gate f).
  return WORD_SEED.map(({ language, word }) => ({ language, word }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}): Promise<Metadata> {
  const { language, word } = await params
  const decodedWord = decodeURIComponent(word)
  // Same React.cache-wrapped read as the page: one fetch per request.
  const model = await getWordState(language as Language, decodedWord)
  const ready = model?.kind === 'ready' ? model.word : null

  const title = ready?.word ?? decodedWord
  const description = ready?.coreDefinition ?? 'This word is still being generated.'
  return {
    title,
    description,
    openGraph: { title, description },
    // Don't index a word that isn't built yet (AC-5).
    ...(ready ? {} : { robots: { index: false } }),
  }
}

// The DefinedTerm document, serialized with `<` escaped to `<` so a value
// can never break out of the <script> element (the standard JSON-LD injection
// guard) — dangerouslySetInnerHTML does no escaping of its own.
function DefinedTermJsonLd({ word, language }: { word: ReadyWord; language: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.word,
    description: word.coreDefinition,
    inLanguage: language,
  }
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; `<` is escaped above.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}) {
  const { language, word } = await params
  const lang = language as Language
  const decodedWord = decodeURIComponent(word)
  const model = await getWordState(lang, decodedWord)
  // Poll only while the backend is still building; the poller re-syncs the page (via
  // the injected refreshWordPage action) once it lands on succeeded/failed. Both props
  // are bound Server Actions — the serializable IO the app injects into the island.
  const building =
    model?.kind === 'unready' && (model.status === 'pending' || model.status === 'running')

  return (
    <>
      {model?.kind === 'ready' ? <DefinedTermJsonLd word={model.word} language={language} /> : null}
      <WordScreen
        model={model}
        language={lang}
        word={decodedWord}
        libraryHref="/"
        searchHref="/search"
        buildAction={requestWordBuild.bind(null, lang, decodedWord)}
      />
      {building ? (
        <WordStatusPoller
          poll={getWordStatus.bind(null, lang, decodedWord)}
          onSettled={refreshWordPage.bind(null, lang, decodedWord)}
        />
      ) : null}
    </>
  )
}
