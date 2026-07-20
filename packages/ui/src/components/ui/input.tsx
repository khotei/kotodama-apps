import { cn } from '@kotodama/ui/lib/utils'
import type * as React from 'react'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 rounded-sm border border-border bg-card px-3.5 py-[11px] font-serif text-lg text-foreground transition-[color,border-color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-sans file:text-sm file:font-medium file:text-foreground placeholder:font-serif placeholder:text-subtle-foreground placeholder:italic disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45',
        'focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground',
        'aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
