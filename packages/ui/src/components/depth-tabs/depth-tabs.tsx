import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export const DepthTabs = Tabs
export const DepthTabsContent = TabsContent

export function DepthTabsList({ className, ...props }: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        // the registry list pins h-9 behind the same variant prefix, which a
        // bare h-auto cannot override through tailwind-merge
        'grid w-full grid-cols-2 gap-0.5 group-data-[orientation=horizontal]/tabs:h-auto md:grid-cols-4',
        className,
      )}
      {...props}
    />
  )
}

export type DepthTabsTriggerProps = Omit<ComponentProps<typeof TabsTrigger>, 'children'> & {
  numeral: ReactNode
  name: ReactNode
  sublabel?: ReactNode
}

/**
 * The `depth` tabs variant: a stacked trigger — mono roman numeral · serif
 * name · muted sublabel — stretching to fill the list (2×2 grid on mobile).
 */
export function DepthTabsTrigger({
  numeral,
  name,
  sublabel,
  className,
  ...props
}: DepthTabsTriggerProps) {
  return (
    <TabsTrigger
      className={cn(
        'h-auto flex-col items-start gap-0.5 whitespace-normal px-3.5 py-2.5 text-left',
        className,
      )}
      {...props}
    >
      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
        {numeral}
      </span>
      <span className="font-serif text-[15px] leading-tight">{name}</span>
      {sublabel != null && (
        <span className="text-[11.5px] font-normal leading-snug text-muted-foreground">
          {sublabel}
        </span>
      )}
    </TabsTrigger>
  )
}
