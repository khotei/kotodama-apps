import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'

export const DepthTabs = Tabs
export const DepthTabsContent = TabsContent

export function DepthTabsList({ className, ...props }: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        'grid w-full grid-cols-2 gap-0 rounded-none border-x-0 border-y bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto md:grid-cols-4',
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
        'group/tab h-auto flex-col items-start justify-start gap-1 whitespace-normal rounded-none border-x-0 border-t-2 border-t-transparent border-b-0 px-4 pt-4 pb-[15px] text-left transition-colors hover:bg-card data-[state=active]:border-t-seal data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none',
        className,
      )}
      {...props}
    >
      <span className="font-mono text-2xs uppercase tracking-[0.14em] text-faint-foreground group-data-[state=active]/tab:text-seal">
        {numeral}
      </span>
      <span className="font-serif text-[20px] leading-[1.05] tracking-[-0.01em] text-muted-foreground group-data-[state=active]/tab:text-foreground">
        {name}
      </span>
      {sublabel != null && (
        <span className="font-sans text-[11.5px] font-normal leading-snug text-subtle-foreground">
          {sublabel}
        </span>
      )}
    </TabsTrigger>
  )
}
