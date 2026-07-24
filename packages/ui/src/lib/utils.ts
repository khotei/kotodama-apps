import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge class lists with Tailwind conflict resolution (last-wins). Every
 *  component wraps its final className in this so a consumer's `className`
 *  predictably overrides the defaults. shadcn-generated components import `cn`
 *  from here (the `utils` alias in `components.json`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
