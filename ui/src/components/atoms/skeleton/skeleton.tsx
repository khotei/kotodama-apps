import { cn } from '../../../lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-[5px] bg-secondary after:absolute after:inset-0 after:animate-[kdm-shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-card after:to-transparent after:content-['']",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
