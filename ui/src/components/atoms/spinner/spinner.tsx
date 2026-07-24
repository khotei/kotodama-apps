import { cn } from '../../../lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block size-3 shrink-0 animate-spin rounded-full border-[1.6px] border-current border-t-transparent',
        className,
      )}
      {...props}
    />
  )
}

export { Spinner }
