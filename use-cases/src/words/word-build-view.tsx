import type { UnreadyStages } from '@kotodama/store'
import {
  Button,
  Card,
  CardContent,
  type GenerationStep,
  GenerationSteps,
  Skeleton,
  StatusBadge,
} from '@kotodama/ui'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  RotateCcwIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

const STAGE_LABEL: Record<UnreadyStages[number]['stage'], string> = {
  fetch_source: 'Looking the word up',
  enrich_etymology: 'Tracing the etymology',
  enrich_tiers: 'Writing the four depths',
  enrich_authors: 'Gathering the voices',
  enrich_visuals: 'Rendering an image',
  final_review: 'Setting the entry',
}

function toGenerationSteps(stages: UnreadyStages): GenerationStep[] {
  return stages.map(({ stage, status }) => ({
    label: STAGE_LABEL[stage],
    state: status === 'succeeded' ? 'done' : status === 'running' ? 'active' : 'pending',
    timing: status === 'running' ? 'working…' : undefined,
  }))
}

function StateShell({ backHref, children }: { backHref: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[720px] pt-10 pb-20">
      <Button asChild variant="ghost" size="sm" className="mb-5 text-muted-foreground">
        <a href={backHref}>
          <ArrowLeftIcon /> Library
        </a>
      </Button>
      <Card>
        <CardContent className="p-7">{children}</CardContent>
      </Card>
    </div>
  )
}

export type WordGeneratingViewProps = {
  word: string
  stages: UnreadyStages
  backHref: string
}

/** The build-in-progress state; steps map from the REAL backend stages. */
export function WordGeneratingView({ word, stages, backHref }: WordGeneratingViewProps) {
  return (
    <StateShell backHref={backHref}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-serif text-4xl leading-tight">{word}</div>
          <div className="mt-1 font-mono text-[12px] text-muted-foreground">added just now</div>
        </div>
        <StatusBadge status="generating" />
      </div>
      <GenerationSteps steps={toGenerationSteps(stages)} className="mt-7" />
      <div className="mt-7 flex flex-col gap-2.5">
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[78%]" />
        <Skeleton className="h-4 w-[84%]" />
      </div>
      <p className="mt-6 text-[13px] text-muted-foreground">
        Kotodama writes each entry from scratch. This usually takes about ten seconds — you can
        leave and come back.
      </p>
    </StateShell>
  )
}

export type WordFailedViewProps = {
  word: string
  stages: UnreadyStages
  backHref: string
}

export function WordFailedView({ word, stages, backHref }: WordFailedViewProps) {
  const failedAt = stages.findIndex((stage) => stage.status === 'failed')
  const failed = failedAt >= 0 ? stages[failedAt] : undefined
  return (
    <StateShell backHref={backHref}>
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlertIcon className="size-5" />
        </span>
        <div className="font-serif text-[34px] leading-tight">{word}</div>
        <h2 className="font-medium text-lg">This entry didn’t finish</h2>
        <p className="max-w-[420px] text-sm text-muted-foreground leading-relaxed">
          We couldn’t finish writing this entry. Nothing was lost — your other words are safe.
        </p>
        {failed?.error != null && (
          <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            error: {failed.error.type} · step {failedAt + 1} of {stages.length}
          </span>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-2.5">
          <Button>
            <RotateCcwIcon /> Try again
          </Button>
          <Button asChild variant="ghost">
            <a href={backHref}>Back to library</a>
          </Button>
        </div>
      </div>
    </StateShell>
  )
}

export type WordNotFoundViewProps = {
  word: string
  languageName: string
  backHref: string
  searchHref: string
}

export function WordNotFoundView({
  word,
  languageName,
  backHref,
  searchHref,
}: WordNotFoundViewProps) {
  return (
    <StateShell backHref={backHref}>
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <BookOpenIcon className="size-5" />
        </span>
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
          Not in your library yet
        </span>
        <div className="font-serif text-[44px] leading-tight">{word}</div>
        <p className="max-w-[440px] text-sm text-muted-foreground leading-relaxed">
          There’s no entry for “{word}” yet. Kotodama can write a full one — meaning, real examples,
          etymology, and an image — in about ten seconds.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2.5">
          <Button size="lg">
            <SparklesIcon /> Create this entry
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={searchHref}>Search instead</a>
          </Button>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {languageName} · {word}
        </span>
      </div>
    </StateShell>
  )
}
