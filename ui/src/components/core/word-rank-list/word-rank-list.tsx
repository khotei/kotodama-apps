import { pad2 } from '../../../lib/pad2'
import type { RankedWordView } from '../../../views/library.view'
import { AccentedWordMark } from '../../atoms/accented-word'
import { List, ListItem } from '../../atoms/list'
import { PosPill } from '../../atoms/pos-pill'
import { Timestamp } from '../../atoms/timestamp'
import { WordRow } from '../word-row'

export type WordRankListProps = {
  words: readonly RankedWordView[]
}

/**
 * The reading room's "most looked up" column: an ordinal-ranked list of ready
 * words — pos + timestamp, no build status. Far simpler than its sibling
 * {@link WordRecentList}, which carries the pending/failed lifecycle.
 */
export function WordRankList({ words }: WordRankListProps) {
  return (
    <List ordered divided>
      {words.map((word, index) => (
        <ListItem key={word.href}>
          <WordRow>
            <WordRow.Lead>{pad2(index + 1)}</WordRow.Lead>
            <WordRow.Main>
              <WordRow.Word href={word.href}>
                <AccentedWordMark word={word.word} />
              </WordRow.Word>
              {word.gloss != null && <WordRow.Gloss>{word.gloss}</WordRow.Gloss>}
            </WordRow.Main>
            <WordRow.Meta>
              {word.pos != null && <PosPill>{word.pos}</PosPill>}
              <Timestamp>{word.when}</Timestamp>
            </WordRow.Meta>
          </WordRow>
        </ListItem>
      ))}
    </List>
  )
}
