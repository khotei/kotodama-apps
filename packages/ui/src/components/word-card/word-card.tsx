import { StatusBadge, type WordStatus } from '../status-badge/status-badge'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader } from '../ui/card'

// The one skeleton composition. Presentational: it takes PRIMITIVE props (never
// the store's WordStateModel — ui may not import the spine), so the feature
// layer maps domain → props. Built from the shadcn primitives over the semantic
// tokens (`bg-card`, `text-muted-foreground`, …) — never raw colors. Status
// renders through StatusBadge, the one word-lifecycle vocabulary.

export type WordCardProps = {
  word: string
  language: string
  status: WordStatus
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
