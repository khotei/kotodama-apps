import { Button, Card, CardContent, Kbd, SearchBox } from '@kotodama/ui'
import { ArrowRightIcon } from 'lucide-react'
import type { LibraryStat, TryWordView } from './library.view'

const PROPS = [
  {
    numeral: 'I.',
    title: (
      <>
        Four <em className="text-primary">depths</em> of meaning.
      </>
    ),
    body: 'Quick, Everyday, Deep, Cultural. Read at the layer you need — surface for context, fathoms for the work it does in a sentence.',
  },
  {
    numeral: 'II.',
    title: (
      <>
        Author <em className="text-primary">voices</em>.
      </>
    ),
    body: 'Examples in the cadences of the writers who reach for the word — not just what it means, but how literature puts it to work.',
  },
  {
    numeral: 'III.',
    title: (
      <>
        A library that <em className="text-primary">remembers</em>.
      </>
    ),
    body: 'Every word you save resurfaces just as it’s about to slip. Spaced repetition without the Anki tax — no streaks, no badges.',
  },
]

export type LibraryHeroProps = {
  stats: readonly LibraryStat[]
  tryWords: readonly TryWordView[]
  /** GET-form target for the hero search — `/search`. */
  searchPath: string
}

export function LibraryHero({ stats, tryWords, searchPath }: LibraryHeroProps) {
  return (
    <section className="pt-[68px]">
      <div className="flex items-center gap-3">
        <span className="h-[3px] w-7 bg-seal" />
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
          言霊 Kotodama · the spirit that lives in a word
        </span>
      </div>
      <h1 className="mt-6 max-w-[820px] font-serif font-light text-[38px] leading-[1.05] md:text-[66px]">
        Every word is a doorway into a <em className="text-primary">deeper</em> world.
      </h1>
      <p className="mt-5 max-w-[680px] text-[15px] text-muted-foreground leading-relaxed">
        A modern dictionary for readers who refuse the three-line definition. Four depths of
        meaning, etymology traced through its cultural lineage, and examples that show each word{' '}
        <em>alive</em> in literature — because a word carries a spirit, not just a gloss. And a
        quiet library that remembers for you.
      </p>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_340px]">
        <div>
          <form action={searchPath}>
            <SearchBox
              name="q"
              placeholder="Look up a word in Spanish…"
              aria-label="Search words"
              actions={
                <Button type="submit">
                  Look up <ArrowRightIcon />
                </Button>
              }
            />
          </form>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
              Try
            </span>
            {tryWords.map(({ word, href }) => (
              <a
                key={word}
                href={href}
                className="border-border border-b font-serif text-[15px] text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
              >
                {word}
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
            <span>Look up</span>
            <span className="size-1 rounded-full bg-border" />
            <span>Save</span>
            <span className="size-1 rounded-full bg-border" />
            <span>Remember</span>
            <Kbd className="ml-1">⌘K anywhere</Kbd>
          </div>
          <div className="mt-10 flex gap-10">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="font-serif text-3xl">{value}</div>
                <div className="mt-1 max-w-[110px] text-[12.5px] text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          {PROPS.map(({ numeral, title, body }) => (
            <Card key={numeral}>
              <CardContent className="p-5">
                <span className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
                  {numeral}
                </span>
                <h3 className="mt-1.5 font-serif text-[19px] leading-snug">{title}</h3>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </aside>
      </div>
    </section>
  )
}
