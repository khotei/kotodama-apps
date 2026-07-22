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
import type { WordBuildStages } from '../../../views/word.view'

const STAGE_LABEL: Record<WordBuildStages[number]['stage'], string> = {
  fetch_source: 'Looking the word up',
  enrich_etymology: 'Tracing the etymology',
  enrich_tiers: 'Writing the four depths',
  enrich_authors: 'Gathering the voices',
  enrich_visuals: 'Rendering an image',
  final_review: 'Setting the entry',
}

function toGenerationSteps(stages: WordBuildStages): GenerationStep[] {
  return stages.map(({ stage, status }) => ({
    label: STAGE_LABEL[stage],
    state: status === 'succeeded' ? 'done' : status === 'running' ? 'active' : 'pending',
    timing: status === 'succeeded' ? 'done' : status === 'running' ? 'working…' : undefined,
  }))
}

function StateShell({
  backHref,
  cardClassName,
  contentClassName,
  children,
}: {
  backHref: string
  cardClassName?: string
  contentClassName?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-[760px] pt-10 pb-20">
      <Button asChild variant="ghost" size="sm" className="mb-7 text-muted-foreground">
        <a href={backHref}>
          <ArrowLeftIcon /> Library
        </a>
      </Button>
      <Card className={cardClassName}>
        <CardContent className={contentClassName ?? 'p-8'}>{children}</CardContent>
      </Card>
    </div>
  )
}

export type WordGeneratingViewProps = {
  word: string
  stages: WordBuildStages
  backHref: string
}

/** The build-in-progress state; steps map from the REAL backend stages. */
export function WordGeneratingView({ word, stages, backHref }: WordGeneratingViewProps) {
  return (
    <StateShell backHref={backHref}>
      <div className="mb-[26px] flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-serif font-medium text-[46px] leading-none tracking-[-0.03em]">
            {word}
          </div>
          <div className="mt-2 font-mono text-[13px] text-muted-foreground">added just now</div>
        </div>
        <StatusBadge status="generating" />
      </div>
      <GenerationSteps steps={toGenerationSteps(stages)} />
      <div className="mt-7 flex flex-col gap-2.5">
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[78%]" />
        <Skeleton className="h-4 w-[84%]" />
      </div>
      <p className="mt-[22px] font-sans text-[13px] text-subtle-foreground">
        Kotodama writes each entry from scratch. This usually takes about ten seconds — you can
        leave and come back.
      </p>
    </StateShell>
  )
}

export type WordFailedViewProps = {
  word: string
  stages: WordBuildStages
  backHref: string
  /** Injected Server Action (bound) the Try-again form submits. */
  buildAction?: (formData: FormData) => Promise<void>
}

export function WordFailedView({ word, stages, backHref, buildAction }: WordFailedViewProps) {
  const failedAt = stages.findIndex((stage) => stage.status === 'failed')
  const failed = failedAt >= 0 ? stages[failedAt] : undefined
  return (
    <StateShell
      backHref={backHref}
      cardClassName="border-destructive-subtle"
      contentClassName="flex flex-col items-center p-10 text-center"
    >
      <span className="mb-[14px] grid size-14 place-items-center rounded-full bg-destructive-subtle text-destructive">
        <TriangleAlertIcon className="size-[26px]" />
      </span>
      <div className="font-serif font-medium text-[40px] leading-none tracking-[-0.03em]">
        {word}
      </div>
      <h2 className="mt-[14px] font-serif font-medium text-[24px] leading-tight">
        This entry didn’t finish
      </h2>
      <p className="mt-2 max-w-[44ch] font-serif text-[16px] text-muted-foreground leading-[1.55]">
        We couldn’t finish writing this entry. Nothing was lost — your other words are safe.
      </p>
      {failed?.error != null && (
        <span className="mt-[18px] rounded-sm bg-destructive-subtle px-2.5 py-[5px] font-mono text-[11.5px] text-destructive tracking-[0.04em]">
          error: {failed.error.type} · step {failedAt + 1} of {stages.length}
        </span>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <form action={buildAction}>
          <Button type="submit" variant="accent" disabled={buildAction == null}>
            <RotateCcwIcon /> Try again
          </Button>
        </form>
        <Button asChild variant="ghost">
          <a href={backHref}>Back to library</a>
        </Button>
      </div>
    </StateShell>
  )
}

export type WordNotFoundViewProps = {
  word: string
  languageName: string
  backHref: string
  searchHref: string
  /** Injected Server Action (bound) the Create-this-entry form submits. */
  buildAction?: (formData: FormData) => Promise<void>
}

export function WordNotFoundView({
  word,
  languageName,
  backHref,
  searchHref,
  buildAction,
}: WordNotFoundViewProps) {
  return (
    <StateShell
      backHref={backHref}
      contentClassName="flex flex-col items-center px-10 py-14 text-center"
    >
      <span className="mb-[22px] grid size-[60px] place-items-center rounded-full bg-accent text-seal">
        <BookOpenIcon className="size-[26px]" />
      </span>
      <span className="mb-3 font-mono text-2xs text-subtle-foreground uppercase tracking-[0.2em]">
        Not in your library yet
      </span>
      <div className="font-serif font-medium text-[56px] leading-none tracking-[-0.03em]">
        {word}
      </div>
      <p className="mt-[18px] max-w-[48ch] font-serif text-lg text-muted-foreground leading-[1.6]">
        There’s no entry for “{word}” yet. Kotodama can write a full one — meaning, real examples,
        etymology, and an image — in about ten seconds.
      </p>
      <div className="mt-[30px] flex flex-wrap items-center justify-center gap-3">
        <form action={buildAction}>
          <Button type="submit" variant="accent" size="lg" disabled={buildAction == null}>
            <SparklesIcon /> Create this entry
          </Button>
        </form>
        <Button asChild variant="ghost" size="lg">
          <a href={searchHref}>Search instead</a>
        </Button>
      </div>
      <span className="mt-[22px] font-sans text-[12.5px] text-subtle-foreground">
        {languageName} · <span className="font-mono text-muted-foreground">{word}</span>
      </span>
    </StateShell>
  )
}
