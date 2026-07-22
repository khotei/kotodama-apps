import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

const retryLinkClass =
  'cursor-pointer border-border border-b bg-transparent px-0.5 py-1 font-mono text-[11px] text-faint-foreground uppercase tracking-[0.1em] transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50'

/**
 * The quiet mono retry affordance. A plain (non-`'use client'`) module so a
 * server component can render it too — importing a value from a `'use client'`
 * module into an RSC yields a client-reference proxy, not the string.
 */
export function RetryLink({ type = 'button', className, ...props }: ComponentProps<'button'>) {
  return <button type={type} className={cn(retryLinkClass, className)} {...props} />
}
