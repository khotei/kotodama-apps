import { faker } from '@faker-js/faker'
import type { WordEntity, WordStateEntity } from '@kotodama/core/repositories'

// The FE mirror of the backend's `@kotodama/database/factories`: `make*` builders
// returning fully-typed wire values, so a schema regen that reshapes an entity
// breaks a factory at compile time — never a test at runtime. faker is a
// devDependency (`catalog:test`); this subpath is test-only and Biome-banned
// from every shipped-code tree, so faker can never reach a production bundle.

type Word = NonNullable<WordEntity>
type SucceededWordState = Extract<WordStateEntity, { status: 'succeeded' }>
type UnreadyWordState = Exclude<WordStateEntity, { status: 'succeeded' }>
type Stage = Word['stages'][number]

export const WORD_BUILD_STAGES = [
  'fetch_source',
  'enrich_etymology',
  'enrich_tiers',
  'enrich_authors',
  'enrich_visuals',
  'final_review',
] as const satisfies readonly Stage['stage'][]

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
export function makeWord(overrides: Partial<Word> = {}): Word {
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
