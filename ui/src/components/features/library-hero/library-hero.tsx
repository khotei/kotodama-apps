import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
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
  /** Study-language display name for the lookup placeholder — `Spanish`. */
  languageName: string
  /** GET-form target for the hero search — `/search`. */
  searchPath: string
}

export function LibraryHero({ stats, tryWords, languageName, searchPath }: LibraryHeroProps) {
  return (
    <section>
      <div className="mb-xl flex items-center gap-sm">
        <span className="h-px w-[34px] bg-seal" />
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-caps">
          言霊 Kotodama · the spirit that lives in a word
        </span>
      </div>
      <h1 className="max-w-[24ch] text-balance font-serif font-medium text-3xl leading-none tracking-tightest md:text-4xl">
        Every word is a doorway into a <em className="text-seal italic">deeper</em> world.
      </h1>
      <p className="mt-lg max-w-[56ch] font-serif text-base text-muted-foreground leading-body md:text-lg">
        A modern dictionary for readers who refuse the three-line definition. Four depths of
        meaning, etymology traced through its cultural lineage, and examples that show each word{' '}
        <em className="text-seal italic">alive</em> in literature — because a word carries a spirit,
        not just a gloss. And a quiet library that remembers for you.
      </p>

      <div className="mt-2xl max-w-[600px]">
        <form action={searchPath}>
          <SearchBox
            name="q"
            placeholder={`Look up a word in ${languageName}…`}
            aria-label="Search words"
            className="border-2 border-foreground bg-popover shadow-hero"
            actions={
              <Button type="submit">
                Look up <ArrowRightIcon />
              </Button>
            }
          />
        </form>
        <div className="mt-lg pl-xs">
          <div className="flex items-center gap-sm font-sans text-xs font-semibold text-seal uppercase tracking-caps">
            <span>Look up</span>
            <span className="size-1 rounded-full bg-seal-soft" />
            <span>Save</span>
            <span className="size-1 rounded-full bg-seal-soft" />
            <span>Remember</span>
            <Kbd className="ml-auto border-0 bg-transparent px-0 text-xs text-subtle-foreground normal-case tracking-wide">
              ⌘K anywhere
            </Kbd>
          </div>
          <div className="mt-sm flex flex-wrap items-baseline gap-x-sm gap-y-xs">
            <span className="font-sans text-sm text-subtle-foreground">Try</span>
            {tryWords.map(({ word, href }, i) => (
              <Fragment key={word}>
                {i > 0 && <span className="size-0.5 self-center rounded-full bg-border-strong" />}
                <Link
                  href={href}
                  className="border-border-strong border-b pb-0.5 font-serif text-lg text-muted-foreground italic no-underline transition-colors hover:border-seal hover:text-seal"
                >
                  {word}
                </Link>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="mt-2xl flex flex-wrap gap-2xl">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="font-serif text-2xl font-normal tracking-tight">{value}</div>
              <div className="mt-0.5 whitespace-nowrap text-xs text-subtle-foreground tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2xl grid grid-cols-1 gap-2xl border-border border-t pt-2xl md:grid-cols-3">
        {PROPS.map(({ numeral, title, body }) => (
          <div key={numeral}>
            <span className="block font-mono text-xs text-seal tracking-caps">{numeral}</span>
            <h3 className="mt-xs font-serif text-xl font-medium leading-[1.12] tracking-tighter">
              {title}
            </h3>
            <p className="mt-xs max-w-[34ch] font-serif text-base text-muted-foreground leading-normal [&_em]:italic">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
