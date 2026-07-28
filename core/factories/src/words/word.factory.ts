import { faker } from '@faker-js/faker'
import type {
  WordCountsEntity,
  WordEntity,
  WordSearchEntity,
  WordStateEntity,
} from '@kotodama/core/repositories'

type Word = NonNullable<WordEntity>
type SucceededWordState = Extract<WordStateEntity, { status: 'succeeded' }>
type UnreadyWordState = Exclude<WordStateEntity, { status: 'succeeded' }>
type UnreadySearchItem = Exclude<WordSearchEntity, { status: 'succeeded' }>
type Stage = Word['stages'][number]

// An exhaustive Record, not a plain array — `satisfies` on an array checks only
// membership, so a backend stage ADDITION would silently shorten every trail.
const STAGE_SEQUENCE = {
  fetch_source: true,
  enrich_etymology: true,
  enrich_tiers: true,
  enrich_authors: true,
  enrich_visuals: true,
  final_review: true,
} satisfies Record<Stage['stage'], true>

export const WORD_BUILD_STAGES = Object.keys(STAGE_SEQUENCE) as Stage['stage'][]

const makeExample = () => ({
  text: faker.lorem.sentence(),
  register: faker.helpers.arrayElement(['everyday', 'colloquial', 'literary', 'formal']),
})

const makeTier = () => ({
  title: faker.lorem.words(3),
  body: faker.lorem.sentences(2),
  examples: Array.from({ length: 2 }, makeExample),
})

const makeVisual = (kind: Word['visuals']['hero']['kind']) => ({
  kind,
  imageKey: `test/${faker.string.uuid()}`,
  prompt: faker.lorem.sentence(),
  caption: faker.lorem.sentence(),
  concept: faker.lorem.words(2),
})

const makeStage = (
  stage: Stage['stage'],
  status: Stage['status'],
  error?: Stage['error'],
): Stage => (error ? { stage, status, error } : { stage, status })

/** A stage trail consistent with the given overall build status — all done for
 *  `succeeded`, a spread of done/running/pending for `running`, one failed stage
 *  (with an error) for `failed`, all pending for `pending`. */
export function makeStages(status: 'pending' | 'running' | 'succeeded' | 'failed'): Stage[] {
  switch (status) {
    case 'pending':
      return WORD_BUILD_STAGES.map((stage) => makeStage(stage, 'pending'))
    case 'succeeded':
      return WORD_BUILD_STAGES.map((stage) => makeStage(stage, 'succeeded'))
    case 'running':
      return WORD_BUILD_STAGES.map((stage, i) =>
        makeStage(stage, i === 0 ? 'succeeded' : i === 1 ? 'running' : 'pending'),
      )
    case 'failed':
      return WORD_BUILD_STAGES.map((stage, i) =>
        i === 1
          ? makeStage(stage, 'failed', { message: faker.lorem.sentence(), type: 'timed_out' })
          : makeStage(stage, i === 0 ? 'succeeded' : 'pending'),
      )
  }
}

/** A full, contract-valid ready word — every section populated with plausible
 *  generated content; pin what a test asserts on via `overrides`. */
// The narrowed return (status pinned to 'succeeded') lets a ready word feed
// ready-only slots (e.g. a wotd rail) without a cast — a full word IS ready.
export function makeWord(overrides: Partial<Omit<Word, 'status'>> = {}): Word & {
  status: 'succeeded'
} {
  const word = faker.lorem.word()
  const created = faker.date.past().toISOString()
  return {
    id: faker.string.uuid(),
    word,
    language: 'en',
    status: 'succeeded',
    stages: makeStages('succeeded'),
    coreDefinition: faker.lorem.sentence(),
    lexical: {
      partOfSpeech: 'noun',
      countable: faker.datatype.boolean(),
      plural: { primary: `${word}s`, also: [] },
      register: ['everyday'],
    },
    pronunciation: {
      ipa: `/${word}/`,
      respelling: word,
      audio: { uk: null, us: null },
    },
    tiers: {
      quick: makeTier(),
      everyday: makeTier(),
      deep: makeTier(),
      cultural: makeTier(),
    },
    etymology: {
      summary: faker.lorem.sentence(),
      firstAttested: { year: faker.number.int({ min: 800, max: 1900 }), language: 'Latin' },
      origin: { from: faker.lorem.word(), to: word, gloss: faker.lorem.words(3) },
      descent: [
        {
          when: `${faker.number.int({ min: 800, max: 1900 })}`,
          form: faker.lorem.word(),
          languageName: 'Latin',
          gloss: faker.lorem.words(3),
        },
      ],
    },
    authorExamples: [
      {
        author: faker.person.fullName(),
        authorImageUrl: '',
        language: 'en',
        isGenerated: true,
        quote: faker.lorem.sentence(),
      },
    ],
    culturalGuide: {
      timeline: [{ date: '19c.', text: faker.lorem.sentence() }],
      notes: [faker.lorem.sentence()],
    },
    relations: { synonyms: [], antonyms: [], family: [] },
    translations: [],
    visuals: {
      hero: makeVisual('hero'),
      infographic: makeVisual('infographic'),
      memes: [makeVisual('meme')],
    },
    sources: [{ index: 1, type: 'primary', title: faker.lorem.words(4) }],
    provenance: { model: 'test', promptHash: faker.string.hexadecimal({ length: 8 }) },
    frequency: {
      band: 'common',
      series: [{ year: 2000, value: faker.number.int({ min: 1, max: 100 }) }],
    },
    createdAt: created,
    updatedAt: created,
    ...overrides,
  }
}

/** A still-building (or failed) search list item: identity + status + a stage
 *  trail consistent with that status. */
export function makeUnreadySearchItem(
  status: UnreadySearchItem['status'] = 'running',
  overrides: Partial<UnreadySearchItem> = {},
): UnreadySearchItem {
  const created = faker.date.past().toISOString()
  return {
    id: faker.string.uuid(),
    word: faker.lorem.word(),
    language: 'en',
    status,
    stages: makeStages(status),
    createdAt: created,
    updatedAt: created,
    ...overrides,
  }
}

/** A contract-valid `words.counts` body; pin asserted fields via `overrides`. */
export function makeWordCounts(overrides: Partial<WordCountsEntity> = {}): WordCountsEntity {
  return { total: 10, pending: 2, running: 1, succeeded: 6, failed: 1, ...overrides }
}

/** The `succeeded` arm of the word build state. */
export function makeSucceededWordState(
  overrides: Partial<SucceededWordState> = {},
): SucceededWordState {
  return { status: 'succeeded', word: makeWord(), ...overrides }
}

/** A non-terminal (or failed) word build state, with a stage trail consistent
 *  with the given status. */
export function makeUnreadyWordState(
  status: UnreadyWordState['status'] = 'running',
  overrides: Partial<UnreadyWordState> = {},
): UnreadyWordState {
  return { status, stages: makeStages(status), ...overrides }
}
