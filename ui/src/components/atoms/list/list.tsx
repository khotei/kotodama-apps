import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { cn } from '../../../lib/utils'

export type ListProps = ComponentPropsWithoutRef<'ul'> & {
  /** Render as `<ol>` — the ranking semantics for a numbered list. */
  ordered?: boolean
  /** Rule every row off the next: a top border on each `<li>`, bottom on the last. */
  divided?: boolean
}

/**
 * The bare list frame: renders `<ul>`, or `<ol>` when `ordered`, and owns only
 * its internal rhythm — never an outer margin.
 *
 * `divided` is the one look it advertises, hung on the child `<li>`s so the item
 * stays dumb. The leading marker, content and meta are the row's concern
 * ({@link RankRow}), not the frame's — that is why no `Indicator` slot exists.
 */
export function List({ ordered, divided, className, ...props }: ListProps) {
  const cls = cn(
    divided && '[&>li]:border-border-subtle [&>li]:border-t [&>li:last-child]:border-b',
    className,
  )
  return ordered ? <ol className={cls} {...props} /> : <ul className={cls} {...props} />
}

export type ListItemProps = ComponentProps<'li'>

/** A policy-free `<li>` slot; stays dumb so {@link List}'s `divided` can rule it. */
export function ListItem(props: ListItemProps) {
  return <li {...props} />
}
