import { languageName } from '@kotodama/platform/languages'
import { LibraryHero } from '@kotodama/ui'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { capitalize } from '@/src/utils/text'
import { wordHref } from '@/src/words/words-hrefs'
import { loadLibraryHero } from './library-hero.loaders'

export async function LibraryHeroContainer() {
  const { counts, tryWords } = await loadLibraryHero(DEFAULT_LANGUAGE)
  const studyLanguage = capitalize(languageName(DEFAULT_LANGUAGE))

  return (
    <LibraryHero
      stats={[
        { value: String(counts.succeeded), label: 'words ready to read' },
        { value: String(counts.pending + counts.running), label: 'taking shape now' },
        { value: studyLanguage, label: 'your study language' },
      ]}
      tryWords={tryWords.map((w) => ({ word: w.word, href: wordHref(DEFAULT_LANGUAGE, w.word) }))}
      languageName={studyLanguage}
      searchPath="/search"
    />
  )
}
