import { CheckIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Spinner } from '../../atoms/spinner'

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
    <ol className={cn('flex flex-col gap-[2px]', className)} {...props}>
      {steps.map((step, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are a static ordered pipeline
        <li key={index} className="flex items-center gap-[14px] py-3" data-state={step.state}>
          <span
            className={cn(
              'grid size-[22px] shrink-0 place-items-center rounded-full border-[1.5px] font-mono text-2xs',
              step.state === 'done' && 'border-success bg-success text-success-foreground',
              step.state === 'active' && 'border-warning text-warning',
              step.state === 'pending' && 'border-border-strong text-faint-foreground',
            )}
          >
            {step.state === 'done' && <CheckIcon className="size-3" />}
            {step.state === 'active' && <Spinner className="size-[18px]" />}
            {step.state === 'pending' && index + 1}
          </span>
          <span
            className={cn(
              'flex-1 font-sans text-[15px] font-medium',
              step.state === 'pending' && 'text-faint-foreground',
            )}
          >
            {step.label}
          </span>
          {step.timing != null && (
            <span className="font-mono text-[11.5px] text-subtle-foreground">{step.timing}</span>
          )}
        </li>
      ))}
    </ol>
  )
}
