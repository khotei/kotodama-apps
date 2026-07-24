import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

export type HighlightedTextProps = {
  text: string
  query: string
} & ComponentProps<'span'>

/** Renders `text` with the first case-insensitive occurrence of `query` wrapped in a `<mark>`. */
export function HighlightedText({ text, query, className, ...props }: HighlightedTextProps) {
  const at = query === '' ? -1 : text.toLowerCase().indexOf(query.toLowerCase())

  if (at < 0) {
    return (
      <span className={cn(className)} {...props}>
        {text}
      </span>
    )
  }

  return (
    <span className={cn(className)} {...props}>
      {text.slice(0, at)}
      <mark className="rounded-[3px] bg-accent px-0.5 text-seal-emphasis">
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </span>
  )
}
