import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader } from '../ui/card'

// The one skeleton composition. Presentational: it takes PRIMITIVE props (never
// the store's WordStateModel — ui may not import the spine), so the feature
// layer maps domain → props. Built from the shadcn primitives over the semantic
// tokens (`bg-card`, `text-muted-foreground`, …) — never raw colors.

const STATUS_LABEL: Record<WordCardProps['status'], string> = {
  pending: 'Queued',
  running: 'Building…',
  succeeded: 'Ready',
  failed: 'Failed',
}

export type WordCardProps = {
  word: string
  language: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  coreDefinition?: string
}

export function WordCard({ word, language, status, coreDefinition }: WordCardProps) {
  return (
    <Card className="max-w-lg">
      <CardHeader className="flex-row items-start justify-between gap-2.5">
        <h1 className="font-serif text-[26px] font-medium leading-[1.1] tracking-[-0.015em]">
          {word}
        </h1>
        <Badge variant="secondary" className="font-mono uppercase">
          {language}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-4 font-mono text-2xs text-subtle-foreground uppercase tracking-[0.14em]">
          {STATUS_LABEL[status]}
        </p>
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
