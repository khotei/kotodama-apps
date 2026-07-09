import { CheckIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Spinner } from '../ui/spinner'

export type GenerationStepState = 'done' | 'active' | 'pending'

export type GenerationStep = {
  label: ReactNode
  state: GenerationStepState
  /** Right-aligned mono meta, e.g. `1.2s` or `~4s`. */
  timing?: ReactNode
}

export type GenerationStepsProps = Omit<ComponentProps<'ol'>, 'children'> & {
  steps: readonly GenerationStep[]
}

export function GenerationSteps({ steps, className, ...props }: GenerationStepsProps) {
  return (
    <ol className={cn('flex flex-col gap-3', className)} {...props}>
      {steps.map((step, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are a static ordered pipeline
        <li key={index} className="flex items-center gap-3" data-state={step.state}>
          <span
            className={cn(
              'grid size-[22px] shrink-0 place-items-center rounded-full border font-mono text-[10.5px]',
              step.state === 'done' && 'border-transparent bg-success text-success-foreground',
              step.state === 'active' && 'border-transparent text-primary',
              step.state === 'pending' && 'border-border text-muted-foreground',
            )}
          >
            {step.state === 'done' && <CheckIcon className="size-3" />}
            {step.state === 'active' && <Spinner className="size-[18px]" />}
            {step.state === 'pending' && index + 1}
          </span>
          <span
            className={cn(
              'flex-1 text-sm',
              step.state === 'pending' && 'text-muted-foreground',
              step.state === 'active' && 'font-medium',
            )}
          >
            {step.label}
          </span>
          {step.timing != null && (
            <span className="font-mono text-[11px] text-muted-foreground">{step.timing}</span>
          )}
        </li>
      ))}
    </ol>
  )
}
