import { Button, Card, CardContent, Skeleton, Spinner } from '@kotodama/ui'
import { ArrowLeftIcon } from 'lucide-react'

export type WordLoadingViewProps = {
  backHref: string
}

/** Fetching an EXISTING entry — distinct from generating (a build in progress). */
export function WordLoadingView({ backHref }: WordLoadingViewProps) {
  return (
    <div className="pt-10 pb-20" aria-busy="true">
      <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
        <a href={backHref}>
          <ArrowLeftIcon /> Library
        </a>
      </Button>
      <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1fr_300px] lg:gap-14">
        <div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-[92px] rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Skeleton className="h-[104px] w-[62%]" />
            <Skeleton className="h-[22px] w-[32%]" />
            <Skeleton className="h-8 w-[48%]" />
          </div>
          <div className="mt-7 flex flex-col gap-2.5">
            <Skeleton className="h-[17px] w-[90%]" />
            <Skeleton className="h-[17px] w-[82%]" />
          </div>
          <Skeleton className="mt-9 h-[42px] w-[140px] rounded-full" />
          <div className="mt-[60px]">
            <Skeleton className="h-3 w-[120px]" />
            <div className="mt-6 flex flex-col gap-2.5">
              <Skeleton className="h-[17px] w-full" />
              <Skeleton className="h-[17px] w-[94%]" />
              <Skeleton className="h-[17px] w-[70%]" />
            </div>
          </div>
          <div className="mt-9 flex items-center gap-2.5 font-mono text-[12px] text-seal tracking-[0.06em]">
            <Spinner className="size-3.5" /> Loading entry…
          </div>
        </div>
        <aside>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[140px] w-full" />
              <div className="mt-4 flex flex-col gap-2.5">
                <Skeleton className="h-3 w-[80%]" />
                <Skeleton className="h-3 w-[65%]" />
                <Skeleton className="h-3 w-[72%]" />
                <Skeleton className="h-3 w-[58%]" />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
