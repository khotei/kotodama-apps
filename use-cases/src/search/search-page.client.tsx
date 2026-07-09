'use client'

import {
  Button,
  EmptyState,
  ResultRow,
  SearchBox,
  SectionRule,
  Tabs,
  TabsList,
  TabsTrigger,
  Toggle,
} from '@kotodama/ui'
import {
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import type { SearchPos, SearchWordView } from './search.view'

const PAGE_SIZE = 6
const POS_TABS: { value: SearchPos | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
]

function highlight(word: string, query: string): ReactNode {
  const at = word.toLowerCase().indexOf(query.toLowerCase())
  if (query === '' || at < 0) return word
  return (
    <>
      {word.slice(0, at)}
      <mark className="rounded-xs bg-primary/10 text-primary">
        {word.slice(at, at + query.length)}
      </mark>
      {word.slice(at + query.length)}
    </>
  )
}

function matches(row: SearchWordView, query: string, pos: SearchPos | 'all', savedOnly: boolean) {
  if (savedOnly && !row.saved) return false
  if (pos !== 'all' && row.pos !== pos) return false
  if (query !== '' && !row.word.toLowerCase().includes(query.toLowerCase())) return false
  return true
}

function Row({ row, query }: { row: SearchWordView; query: string }) {
  return (
    <ResultRow
      href={row.href}
      word={highlight(row.word, query)}
      ipa={row.ipa}
      pos={row.posLabel}
      gloss={row.gloss}
      status={row.status}
      saved={row.saved}
      statusNote={row.statusNote}
    />
  )
}

export type SearchPageProps = {
  words: readonly SearchWordView[]
  initialQuery?: string
  initialSavedOnly?: boolean
  /** Word-page URL prefix the Generate CTA appends the query to — `/words/es/`. */
  generatePathPrefix: string
}

/**
 * The Search screen island: filters compose (query ∧ pos ∧ saved), pagination
 * resets on any filter change. Client-side over the injected word list — the
 * mock-stage seam; a backend search swaps the list for injected results.
 */
export function SearchPage({
  words,
  initialQuery = '',
  initialSavedOnly = false,
  generatePathPrefix,
}: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery)
  const [pos, setPos] = useState<SearchPos | 'all'>('all')
  const [savedOnly, setSavedOnly] = useState(initialSavedOnly)
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      words
        .filter((row) => matches(row, query, pos, savedOnly))
        .sort((a, b) => b.addedRank - a.addedRank),
    [words, query, pos, savedOnly],
  )
  const browsing = query === ''
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(filtered.length, currentPage * PAGE_SIZE)

  const resetPage = () => setPage(1)

  return (
    <div className="pt-10">
      <SectionRule label="Search" meta={`${words.length} words in library`} />

      <SearchBox
        className="mt-6"
        placeholder="Search your words, or type a new one…"
        aria-label="Search words"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          resetPage()
        }}
        actions={
          <>
            {query !== '' && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Clear"
                onClick={() => {
                  setQuery('')
                  resetPage()
                }}
              >
                <XIcon />
              </Button>
            )}
            <Button asChild>
              <a href={`${generatePathPrefix}${encodeURIComponent(query.trim())}`}>
                <PlusIcon /> Add
              </a>
            </Button>
          </>
        }
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={pos}
          onValueChange={(value) => {
            setPos(value as SearchPos | 'all')
            resetPage()
          }}
        >
          <TabsList aria-label="Part of speech">
            {POS_TABS.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Toggle
          variant="outline"
          pressed={savedOnly}
          onPressedChange={(pressed) => {
            setSavedOnly(pressed)
            resetPage()
          }}
        >
          <BookmarkIcon /> Saved only
        </Toggle>
      </div>

      {filtered.length === 0 ? (
        savedOnly && query === '' ? (
          <EmptyState
            icon={<BookmarkIcon />}
            title="Nothing saved here yet."
            description="Words you save for review will collect here. Open any entry and tap Save."
          >
            <Button
              variant="secondary"
              onClick={() => {
                setSavedOnly(false)
                setPos('all')
                setQuery('')
                resetPage()
              }}
            >
              Clear filters
            </Button>
          </EmptyState>
        ) : (
          <EmptyState
            icon={<SearchIcon />}
            title={`No word matches “${query.trim()}”.`}
            description="It isn’t in your library yet — but Kotodama can write it a full entry in seconds."
          >
            <Button size="lg" asChild>
              <a href={`${generatePathPrefix}${encodeURIComponent(query.trim())}`}>
                <SparklesIcon /> Generate “{query.trim()}”
              </a>
            </Button>
          </EmptyState>
        )
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13.5px] text-muted-foreground">
              {browsing ? (
                <>Browsing the whole library · </>
              ) : (
                <>
                  <b className="text-foreground">{filtered.length}</b>{' '}
                  {filtered.length === 1 ? 'match' : 'matches'} for “{query.trim()}” ·{' '}
                </>
              )}
              <span className="font-mono text-[12px]">
                {rangeStart}–{rangeEnd} of {filtered.length}
              </span>
            </span>
            <span className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
              Sorted by added
            </span>
          </div>
          <div className="mt-2 border-border border-t">
            {pageRows.map((row) => (
              <Row key={row.word} row={row} query={query} />
            ))}
          </div>
          {pageCount > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Result pages">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeftIcon /> Previous
              </Button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === currentPage ? 'outline' : 'ghost'}
                  size="icon-sm"
                  aria-current={n === currentPage ? 'page' : undefined}
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next <ChevronRightIcon />
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
