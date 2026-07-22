'use client'

import {
  Button,
  cn,
  EmptyState,
  FilterChip,
  HighlightedText,
  ResultRow,
  SearchBox,
  SectionRule,
  StatusNote,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@kotodama/ui'
import {
  ArrowRightIcon,
  BookmarkIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SearchPos, SearchWordView } from './search.view'

const pad2 = (n: number) => String(n).padStart(2, '0')

const PAGE_SIZE = 6
const POS_TABS: { value: SearchPos | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
]

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
      word={<HighlightedText text={row.word} query={query} />}
      ipa={row.ipa}
      pos={row.posLabel}
      gloss={row.gloss}
      status={row.status}
      saved={row.saved}
      statusNote={
        row.status !== 'ready' && row.statusNote != null ? (
          <StatusNote note={row.statusNote} status={row.status} />
        ) : undefined
      }
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
    <div className="pt-9">
      <SectionRule label="Search" meta={`${words.length} words in library`} />

      <SearchBox
        className="mt-6 max-w-[720px]"
        placeholder="Search your words, or type a new one…"
        aria-label="Search words"
        hideNativeClear
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          resetPage()
        }}
        actions={
          <>
            {query !== '' && (
              <Button
                variant="outline"
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
            <Button variant="accent" asChild>
              <a href={`${generatePathPrefix}${encodeURIComponent(query.trim())}`}>
                <PlusIcon /> Add
              </a>
            </Button>
          </>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
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
        <FilterChip
          pressed={savedOnly}
          onPressedChange={(next) => {
            setSavedOnly(next)
            resetPage()
          }}
          icon={<BookmarkIcon />}
        >
          Saved only
        </FilterChip>
      </div>

      {filtered.length === 0 ? (
        savedOnly && query === '' ? (
          <EmptyState
            icon={<BookmarkIcon />}
            title="Nothing saved here yet."
            description="Words you save for review will collect here. Open any entry and tap Save."
          >
            <Button
              variant="outline"
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
            <Button variant="accent" size="lg" asChild>
              <a href={`${generatePathPrefix}${encodeURIComponent(query.trim())}`}>
                <SparklesIcon /> Generate “{query.trim()}”
              </a>
            </Button>
          </EmptyState>
        )
      ) : (
        <>
          <div className="mt-8 mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-serif text-base text-muted-foreground">
              <b className="font-medium text-foreground">{filtered.length}</b>{' '}
              {browsing
                ? 'words'
                : `${filtered.length === 1 ? 'match' : 'matches'} for “${query.trim()}”`}
              {pageCount > 1 && (
                <>
                  {' · '}
                  <span className="font-mono text-[12px] text-subtle-foreground tracking-[0.04em]">
                    {rangeStart}–{rangeEnd} of {filtered.length}
                  </span>
                </>
              )}
            </span>
            {browsing && (
              <span className="font-mono text-[11px] text-subtle-foreground uppercase tracking-[0.06em]">
                Sorted by added
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-col">
            {pageRows.map((row) => (
              <Row key={row.href} row={row} query={query} />
            ))}
          </div>
          {pageCount > 1 && (
            <nav
              className="mt-[30px] flex items-center justify-between gap-4 border-border-subtle border-t pt-[22px]"
              aria-label="Result pages"
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="inline-flex cursor-pointer items-center gap-2 px-1 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.11em] transition-colors hover:text-seal disabled:cursor-default disabled:text-faint-foreground disabled:opacity-45"
              >
                <ArrowRightIcon className="size-[15px] rotate-180" /> Prev
              </button>
              <ol className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <li key={n}>
                    <button
                      type="button"
                      aria-current={n === currentPage ? 'page' : undefined}
                      onClick={() => setPage(n)}
                      className={cn(
                        'grid h-[34px] min-w-[34px] cursor-pointer place-items-center rounded-[5px] border px-2 font-mono text-[12px] tracking-[0.06em] transition-colors',
                        n === currentPage
                          ? 'border-seal-line bg-accent text-seal-emphasis'
                          : 'border-transparent text-subtle-foreground hover:bg-card hover:text-foreground',
                      )}
                    >
                      {pad2(n)}
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
                className="inline-flex cursor-pointer items-center gap-2 px-1 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.11em] transition-colors hover:text-seal disabled:cursor-default disabled:text-faint-foreground disabled:opacity-45"
              >
                Next <ArrowRightIcon className="size-[15px]" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
