import type { ComponentProps } from 'react'
import { StatusBadge, type WordStatus } from '../../core/status-badge/status-badge'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader } from '../../ui/card'

export type WordCardProps = {
  word: string
  language: string
  status: WordStatus
  coreDefinition?: string
} & ComponentProps<'div'>

export function WordCard({
  word,
  language,
  status,
  coreDefinition,
  className,
  ...props
}: WordCardProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader className="flex-row items-start justify-between gap-2.5">
        <h1 className="font-serif text-[26px] font-medium leading-[1.1] tracking-[-0.015em]">
          {word}
        </h1>
        <Badge variant="secondary" className="font-mono uppercase">
          {language}
        </Badge>
      </CardHeader>
      <CardContent>
        <StatusBadge status={status} className="mb-4" />
        {coreDefinition ? (
          <p className="font-serif text-[16px] leading-relaxed">{coreDefinition}</p>
        ) : (
          <p className="font-serif text-[16px] text-muted-foreground italic">
            Definition is still being generated.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
