import { ArrowRightIcon } from 'lucide-react'
import { Fragment } from 'react'
import type { LibraryStat, TryWordView } from '../../../views/library.view'
import { SearchBox } from '../../molecules/search-box'
import { Button } from '../../ui/button'
import { Kbd } from '../../ui/kbd'

const PROPS = [
  {
    numeral: 'I.',
    title: (
      <>
        Four <em className="text-seal italic">depths</em> of meaning.
      </>
    ),
    body: 'Quick, Everyday, Deep, Cultural. Read at the layer you need — surface for context, fathoms for the work it does in a sentence.',
  },
  {
    numeral: 'II.',
    title: (
      <>
        Author <em className="text-seal italic">voices</em>.
      </>
    ),
    body: (
      <>
        Examples in the cadences of the writers who reach for the word — not just <em>what</em> it
        means, but how literature puts it to work.
      </>
    ),
  },
  {
    numeral: 'III.',
    title: (
      <>
        A library that <em className="text-seal italic">remembers</em>.
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
    <section className="pt-9 md:pt-16">
      <div className="mb-[30px] flex items-center gap-3">
        <span className="h-px w-[34px] bg-seal" />
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.24em]">
          言霊 Kotodama · the spirit that lives in a word
        </span>
      </div>
      <h1 className="max-w-[24ch] text-balance font-serif font-medium text-[40px] leading-none tracking-[-0.035em] md:text-[52px] lg:text-4xl">
        Every word is a doorway into a <em className="text-seal italic">deeper</em> world.
      </h1>
      <p className="mt-[26px] max-w-[56ch] font-serif text-base text-muted-foreground leading-[1.55] md:text-lg">
        A modern dictionary for readers who refuse the three-line definition. Four depths of
        meaning, etymology traced through its cultural lineage, and examples that show each word{' '}
        <em className="text-seal italic">alive</em> in literature — because a word carries a spirit,
        not just a gloss. And a quiet library that remembers for you.
      </p>

      <div className="mt-10 max-w-[600px]">
        <form action={searchPath}>
          <SearchBox
            name="q"
            placeholder="Look up a word in Spanish…"
            aria-label="Search words"
            className="border-2 border-foreground bg-popover shadow-hero"
            actions={
              <Button type="submit">
                Look up <ArrowRightIcon />
              </Button>
            }
          />
        </form>
        <div className="mt-5 pl-2">
          <div className="flex items-center gap-3 font-sans text-[11.5px] font-semibold text-seal uppercase tracking-[0.18em]">
            <span>Look up</span>
            <span className="size-1 rounded-full bg-seal-soft" />
            <span>Save</span>
            <span className="size-1 rounded-full bg-seal-soft" />
            <span>Remember</span>
            <Kbd className="ml-auto border-0 bg-transparent px-0 text-[11px] text-subtle-foreground normal-case tracking-[0.04em]">
              ⌘K anywhere
            </Kbd>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-2">
            <span className="font-sans text-[13px] text-subtle-foreground">Try</span>
            {tryWords.map(({ word, href }, i) => (
              <Fragment key={word}>
                {i > 0 && <span className="size-[3px] self-center rounded-full bg-border-strong" />}
                <a
                  href={href}
                  className="border-border-strong border-b pb-0.5 font-serif text-lg text-muted-foreground italic no-underline transition-colors hover:border-seal hover:text-seal"
                >
                  {word}
                </a>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-10">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="font-serif text-[32px] font-normal tracking-[-0.01em]">{value}</div>
              <div className="mt-0.5 whitespace-nowrap text-[12px] text-subtle-foreground tracking-[0.04em]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 border-border border-t pt-10 md:grid-cols-3">
        {PROPS.map(({ numeral, title, body }) => (
          <div key={numeral}>
            <span className="block font-mono text-[12px] text-seal tracking-[0.2em]">
              {numeral}
            </span>
            <h3 className="mt-2 font-serif text-xl font-medium leading-[1.12] tracking-[-0.015em]">
              {title}
            </h3>
            <p className="mt-[7px] max-w-[34ch] font-serif text-[15px] text-muted-foreground leading-[1.5] [&_em]:italic">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
