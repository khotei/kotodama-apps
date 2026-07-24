import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const VIEW_W = 100
const VIEW_H = 32
const PAD_Y = 2

/**
 * Maps a series onto viewBox coordinates; a flat series (min = max) draws as
 * the vertical midline rather than dividing by zero.
 */
export function plotSparkline(values: readonly number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  const step = values.length > 1 ? VIEW_W / (values.length - 1) : 0
  return values.map((value, i) => ({
    x: i * step,
    y: span === 0 ? VIEW_H / 2 : PAD_Y + (1 - (value - min) / span) * (VIEW_H - PAD_Y * 2),
  }))
}

export type SparklineProps = Omit<ComponentProps<'div'>, 'children'> & {
  values: readonly number[]
  startLabel?: ReactNode
  endLabel?: ReactNode
  /** Evenly-spaced axis ticks (`1800 · 1900 · 2000 · 2024`); overrides start/end. */
  axisLabels?: readonly string[]
}

/** Frequency trend: cinnabar `--seal` line + accent-wash area fill + end dot, mono axis. */
export function Sparkline({
  values,
  startLabel,
  endLabel,
  axisLabels,
  className,
  ...props
}: SparklineProps) {
  const points = plotSparkline(values)
  const line = points.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `0,${VIEW_H} ${line} ${VIEW_W},${VIEW_H}`
  const last = points.at(-1)

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="relative">
        <svg
          role="img"
          aria-label="Frequency trend"
          className="block h-8 w-full"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
        >
          <polygon className="fill-accent" points={area} />
          <polyline
            className="fill-none stroke-seal stroke-[1.6]"
            vectorEffect="non-scaling-stroke"
            points={line}
          />
        </svg>
        {last != null && (
          <span
            className="absolute right-0 size-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-seal"
            style={{ top: `${(last.y / VIEW_H) * 100}%` }}
          />
        )}
      </div>
      {axisLabels != null && axisLabels.length > 0 ? (
        <div className="mt-1 flex justify-between font-mono text-[10px] text-faint-foreground tracking-[0.08em]">
          {axisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : (
        (startLabel != null || endLabel != null) && (
          <div className="mt-1 flex justify-between font-mono text-[10px] text-subtle-foreground">
            <span>{startLabel}</span>
            <span>{endLabel}</span>
          </div>
        )
      )}
    </div>
  )
}
