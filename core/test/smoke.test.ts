import { expect, it } from 'vitest'
import { accentedWordText } from '../src/words/accented-word'

it('joins an accented word into plain text', () => {
  expect(accentedWordText({ pre: 'mari', stress: 'po', post: 'sa' })).toBe('mariposa')
})
