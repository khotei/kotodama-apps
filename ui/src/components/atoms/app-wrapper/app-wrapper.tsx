import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '../../../lib/utils'

export type AppWrapperProps<E extends ElementType = 'div'> = {
  as?: E
} & ComponentPropsWithoutRef<E>

/**
 * The single definition of the site's content width + horizontal gutter; every
 * top-level section (the header bar, the page `<main>`, a standalone story) wraps
 * its content in it so the max-width and page margin can't drift between call
 * sites. Renders a `<div>` — pass `as="main"` for the page's semantic region.
 */
export function AppWrapper<E extends ElementType = 'div'>({
  as,
  className,
  ...props
}: AppWrapperProps<E>) {
  const Component = as ?? 'div'
  return (
    <Component className={cn('mx-auto max-w-[1160px] px-lg md:px-2xl', className)} {...props} />
  )
}
