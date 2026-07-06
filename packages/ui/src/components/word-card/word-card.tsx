import { Badge } from '../badge'
import { Card, CardContent, CardHeader, CardTitle } from '../card'

// The one skeleton component. Presentational: it takes PRIMITIVE props (never
// the store's WordStateModel — ui may not import the spine), so the feature
// layer maps domain → props. Tailwind + shadcn primitives over the semantic
// tokens (`bg-surface`, `text-foreground`, …) — never raw colors.

const STATUS_LABEL: Record<WordCardProps['status'], string> = {
  pending: 'Queued',
  running: 'Building…',
  succeeded: 'Ready',
  failed: 'Failed',
}

export interface WordCardProps {
  word: string
  language: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  coreDefinition?: string
}

export function WordCard({ word, language, status, coreDefinition }: WordCardProps) {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{word}</CardTitle>
        <Badge>{language}</Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{STATUS_LABEL[status]}</p>
        {coreDefinition ? (
          <p>{coreDefinition}</p>
        ) : (
          <p className="text-muted-foreground italic">Definition is still being generated.</p>
        )}
      </CardContent>
    </Card>
  )
}
