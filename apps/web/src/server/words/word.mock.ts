import type { ReadyWord, WordStateModel } from '@kotodama/store'

// Design-stage fixtures (mirror the handoff's Word artboards) so every screen
// state is reachable WITHOUT a backend: mariposa → ready, empalagar →
// generating, resquemor → queued, merendar → failed. getWordState consults
// these only after the real fetch came up empty — a live backend always wins.
export const WORD_STATE_MOCKS: Readonly<Record<string, WordStateModel>> = {
  mariposa: {
    kind: 'ready',
    word: {
      id: 'mock-word-1207',
      word: 'mariposa',
      language: 'es',
      status: 'succeeded',
      coreDefinition: 'a butterfly of the daylight hours',
      lexical: {
        partOfSpeech: 'noun · f.',
        countable: true,
        plural: { primary: 'mariposas', also: [] },
        register: ['everyday'],
      },
      pronunciation: {
        ipa: '/ma.ɾiˈpo.sa/',
        respelling: 'mah-ree-POH-sah',
        audio: { uk: null, us: null },
      },
      tiers: {
        quick: {
          title: 'Insecto alado · a winged insect',
          body: 'A feminine noun for an insect of the order Lepidoptera — large, vivid, scale-covered wings, and above all a creature of the daytime air, seen drifting among flowers.',
          examples: [
            { text: 'Una mariposa se posó sobre la flor.', register: 'everyday' },
            { text: 'La mariposa abrió sus alas al sol.', register: 'everyday' },
            { text: 'Vimos una mariposa amarilla en el jardín.', register: 'everyday' },
          ],
        },
        everyday: {
          title: 'The butterfly of daily speech',
          body: 'In everyday Spanish, mariposa names the day-flying butterfly and stands apart from the night-flying polilla. It flutters into idioms for restlessness and for stomachs full of nerves.',
          examples: [
            { text: 'Tengo mariposas en el estómago.', register: 'colloquial' },
            { text: 'El niño persiguió la mariposa por el parque.', register: 'everyday' },
            { text: 'Las mariposas migran miles de kilómetros.', register: 'everyday' },
          ],
        },
        deep: {
          title: 'Fragility, change, and the soul',
          body: 'Beyond the insect, mariposa carries an emblematic second life: metamorphosis makes it a figure of personal transformation; its brief season, a figure of the ephemeral; its lightness, of the soul itself.',
          examples: [
            { text: 'Su vida fue breve como el vuelo de una mariposa.', register: 'literary' },
            { text: 'El alma, mariposa que escapa del cuerpo dormido.', register: 'literary' },
            { text: 'Renació como mariposa tras años de crisálida.', register: 'figurative' },
          ],
        },
        cultural: {
          title: 'From Darío’s princess to garden tattoos',
          body: 'Modernist poets made the butterfly an emblem of desire and escape; Lorca tuned it to childhood and song. Today it lives on in décor, fashion and metaphors of change — some colloquial uses call for care with register.',
          examples: [
            {
              text: 'quiere ser golondrina, quiere ser mariposa. — Rubén Darío',
              register: 'literary',
            },
            { text: 'Mariposa del aire, qué hermosa eres. — F. G. Lorca', register: 'literary' },
            { text: 'Se tatuó una mariposa como símbolo de su nueva vida.', register: 'everyday' },
          ],
        },
      },
      etymology: {
        summary:
          'Usually explained as a medieval expressive formation that lexicalised an Old Spanish call — Mari, posa(te)!, ‘Mary, alight!’ — addressed to the insect, though the exact derivation is not fully secure.',
        firstAttested: { year: null, language: 'Old Spanish' },
        origin: { from: 'Mari, posa(te)!', to: 'mariposa', gloss: '‘Mary, alight!’' },
        descent: [
          {
            when: 'med. (uncertain)',
            form: 'mariposa',
            languageName: 'Old Spanish',
            gloss: 'butterfly',
          },
          { when: '16c.+', form: 'mariposa', languageName: 'Spanish', gloss: 'butterfly' },
          {
            when: 'today',
            form: 'mariposa',
            languageName: 'Spanish',
            gloss: 'esp. a day-flying butterfly',
          },
        ],
      },
      authorExamples: [
        {
          author: 'Federico García Lorca',
          authorImageUrl: '',
          work: '“Mariposa”, en Canciones',
          language: 'es',
          isGenerated: false,
          quote: 'Mariposa del aire, / qué hermosa eres, / mariposa del aire / dorada y verde.',
        },
        {
          author: 'Rubén Darío',
          authorImageUrl: '',
          work: '“Sonatina”, en Prosas profanas',
          language: 'es',
          isGenerated: false,
          quote:
            'La princesa está triste… ¿qué tendrá la princesa? / … / quiere ser golondrina, quiere ser mariposa.',
        },
        {
          author: 'Pablo Neruda',
          authorImageUrl: '',
          language: 'es',
          isGenerated: true,
          quote: 'La mariposa cruza el mediodía como una pequeña llama que aprendió a callar.',
        },
        {
          author: 'Juan Ramón Jiménez',
          authorImageUrl: '',
          language: 'es',
          isGenerated: true,
          quote:
            'Una mariposa blanca se posó en la tarde, y todo el jardín pareció pensar en silencio.',
        },
      ],
      culturalGuide: {
        timeline: [
          {
            date: '16–17c.',
            text: 'Settles as the name of the day-flying butterfly — and begins to circulate in metaphors of lightness and the ephemeral.',
          },
          {
            date: 'late 19c.',
            text: 'Modernist poets make the butterfly an emblem of desire and escape — the princess of ‘Sonatina’ ‘quiere ser mariposa’.',
          },
          {
            date: 'early 20c.',
            text: 'Lorca turns the mariposa into a musical, chromatic creature tied to childhood, song and luminous fragility.',
          },
          {
            date: 'late 20–21c.',
            text: 'Lives on in décor, fashion, tattoos and metaphors of personal change — some colloquial uses call for care with register.',
          },
        ],
        forecast2030:
          'By 2030 mariposa is likely to keep its heavy symbolic charge in Spanish — vulnerable nature, personal transformation, digital aesthetics and poetic memory — gaining force in environmental writing as a marker of threatened beauty.',
        notes: [
          'Core sense: a lepidopteran, especially day-flying; not strictly the same as polilla (moth), though both are Lepidoptera.',
          'In poetry its most frequent values are lightness, colour, fleetingness, metamorphosis, desire, soul and attraction to light.',
          'Quotes marked ‘AI · in style’ are literary imitations made to illustrate possible usage, not documentary citations.',
        ],
      },
      relations: {
        synonyms: [
          { term: 'lepidóptero', note: 'the technical term for the order' },
          { term: 'palomilla', note: 'regional & popular; can also name a moth' },
        ],
        antonyms: [],
        family: ['mariposario', 'mariposear', 'mariposón'],
      },
      translations: [
        { language: 'en', term: 'butterfly' },
        { language: 'fr', term: 'papillon' },
        { language: 'de', term: 'Schmetterling' },
        { language: 'ja', term: '蝶 (chō)' },
        { language: 'ru', term: 'бабочка' },
      ],
      visuals: {
        hero: {
          kind: 'hero',
          imageKey: 'mock/mariposa-hero',
          prompt:
            'hero image — a luminous day-flying butterfly resting on a sunlit wildflower, golden hour',
          caption: 'Mariposa — a butterfly seen in daylight among flowers.',
          concept: 'daylight butterfly among flowers',
        },
        infographic: {
          kind: 'infographic',
          imageKey: 'mock/mariposa-infographic',
          prompt:
            'infographic — wordless naturalist breakdown; metamorphosis cycle in a circular composition',
          caption: 'Butterfly anatomy and life cycle, without a single label.',
          concept: 'metamorphosis cycle',
        },
        memes: [
          {
            kind: 'meme',
            imageKey: 'mock/mariposa-meme-1',
            prompt: 'meme — butterfly on a petal runway, bees unimpressed',
            caption: 'When you arrive in the garden dressed for the occasion.',
            concept: 'dressed for the occasion',
          },
          {
            kind: 'meme',
            imageKey: 'mock/mariposa-meme-2',
            prompt: 'meme — caterpillar sees butterfly reflection in dewdrop',
            caption: 'Current form vs. final form.',
            concept: 'current vs final form',
          },
          {
            kind: 'meme',
            imageKey: 'mock/mariposa-meme-3',
            prompt: 'meme — butterfly glides, smaller insects flap frantically',
            caption: 'Some beings hustle. Some beings glide.',
            concept: 'gliding above the hustle',
          },
        ],
      },
      sources: [
        { index: 1, type: 'primary', title: 'Reference extract on Lepidoptera / mariposas' },
      ],
      sourceVersions: { model: 'mock', promptHash: 'mock' },
      frequency: {
        band: 'common',
        trendNote:
          'Likely stable in general Spanish over recent decades, varying by genre and topic rather than trending.',
        series: [
          { year: 1950, value: 60 },
          { year: 1968, value: 62 },
          { year: 1985, value: 61 },
          { year: 2003, value: 63 },
          { year: 2020, value: 62 },
        ],
      },
      createdAt: '2026-05-27T09:00:00.000Z',
      updatedAt: '2026-05-27T09:00:00.000Z',
    },
  },
  empalagar: {
    kind: 'unready',
    status: 'running',
    stages: [
      { stage: 'fetch_source', status: 'succeeded' },
      { stage: 'enrich_tiers', status: 'succeeded' },
      { stage: 'enrich_authors', status: 'running' },
      { stage: 'enrich_etymology', status: 'pending' },
      { stage: 'enrich_visuals', status: 'pending' },
    ],
  },
  resquemor: {
    kind: 'unready',
    status: 'pending',
    stages: [
      { stage: 'fetch_source', status: 'pending' },
      { stage: 'enrich_tiers', status: 'pending' },
      { stage: 'enrich_authors', status: 'pending' },
      { stage: 'enrich_etymology', status: 'pending' },
      { stage: 'enrich_visuals', status: 'pending' },
    ],
  },
  merendar: {
    kind: 'unready',
    status: 'failed',
    stages: [
      { stage: 'fetch_source', status: 'succeeded' },
      { stage: 'enrich_tiers', status: 'succeeded' },
      {
        stage: 'enrich_etymology',
        status: 'failed',
        error: { message: 'source timed out', type: 'timed_out' },
      },
      { stage: 'enrich_authors', status: 'pending' },
      { stage: 'enrich_visuals', status: 'pending' },
    ],
  },
}

const MARIPOSA = WORD_STATE_MOCKS.mariposa as { kind: 'ready'; word: ReadyWord }

/** The other list words marked `ready` reuse the mariposa entry (word + gloss
 *  swapped) so clicking their rows never lands on not-found mid-review. */
const DERIVED_READY: readonly [string, string][] = [
  ['sobremesa', 'the lingering talk after a meal'],
  ['madrugar', 'to get up very early'],
  ['estrenar', 'to use or wear for the first time'],
  ['friolero', 'sensitive to the cold'],
  ['anteayer', 'the day before yesterday'],
  ['tutear', 'to address someone with the informal tú'],
]

export const WORD_STATE_MOCKS_ALL: Readonly<Record<string, WordStateModel>> = {
  ...WORD_STATE_MOCKS,
  ...Object.fromEntries(
    DERIVED_READY.map(([word, gloss]) => [
      word,
      {
        kind: 'ready',
        word: { ...MARIPOSA.word, id: `mock-word-${word}`, word, coreDefinition: gloss },
      } satisfies WordStateModel,
    ]),
  ),
}
