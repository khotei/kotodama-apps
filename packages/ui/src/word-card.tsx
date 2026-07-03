import { Badge, Box, Heading, Stack, Text } from '@chakra-ui/react'

// The one skeleton component. Presentational: it takes PRIMITIVE props (never
// core's NarrowedWordState — ui may not import the spine), so the feature
// layer maps domain → props. Chakra v3 + the semantic tokens from theme
// (`bg.surface`, `fg.default`, …) — never raw colors.

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
    <Box
      as="article"
      bg="bg.surface"
      color="fg.default"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      padding="6"
      maxW="lg"
    >
      <Stack direction="row" justify="space-between" align="center" mb="2">
        <Heading as="h1" size="lg">
          {word}
        </Heading>
        <Badge colorPalette="purple" textTransform="uppercase">
          {language}
        </Badge>
      </Stack>
      <Text color="fg.muted" fontSize="sm" mb="4">
        {STATUS_LABEL[status]}
      </Text>
      {coreDefinition ? (
        <Text>{coreDefinition}</Text>
      ) : (
        <Text color="fg.muted" fontStyle="italic">
          Definition is still being generated.
        </Text>
      )}
    </Box>
  )
}
