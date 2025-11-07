import { typelit } from '../../src/typelit';

import {
  modelSettingsInstruction,
  outputFormatInstruction,
  toneInstruction,
  typelitMarkdown,
  typelitTokenCount,
} from './building-blocks';

type CreativeWritingInput = {
  story: {
    genre: 'solarpunk' | 'cyberpunk' | 'fantasy-epic';
    premise: string;
    world: {
      era: string;
      keyLocations: string[];
      culturalTouchstones: string[];
      magicSyntax: string;
      dominantConflict: string;
    };
    characters: {
      protagonist: {
        name: string;
        archetype: 'reluctant-hero' | 'strategist' | 'seer';
        motivations: string[];
        internalConflict: string;
      };
      antagonist: {
        name: string;
        powerBase: string;
        motivations: string[];
        secret: string;
      };
      supportingCast: Array<{
        role: string;
        tiesToProtagonist: string;
        agenda: string;
      }>;
    };
    plot: {
      incitingIncident: string;
      turningPoints: string[];
      climaxImagery: string;
      themes: string[];
    };
    referenceStories?: Array<{
      title: string;
      reason: string;
    }>;
  };
  writing: {
    targetLengthTokens: number;
    viewpoint: 'first-person' | 'third-person-limited';
    pacing: 'brisk' | 'measured';
  };
  preferences: {
    tone: 'lyrical' | 'dark' | 'hopeful';
    detailLevel: 'key-points' | 'rich-prose';
    outputFormat: {
      includeOutline: boolean;
      includeChapterSummaries: boolean;
      includeSampleScene: boolean;
      narrativeVoice: 'present-tense' | 'past-tense';
    };
  };
  user: {
    authorName: string;
    creativeGoal: string;
  };
  model: {
    temperature: number;
    maxTokens: number;
  };
};

const creativeSystemPrompt = typelit`
You are a world-class narrative designer helping ${typelit.string('user', 'authorName')} craft a ${typelit.string('story', 'genre')} piece.

${toneInstruction}
${modelSettingsInstruction}

Always build on the provided canon; never invent lore that contradicts it.
`;

const creativeUserPrompt = typelit`
Goal: ${typelit.string('user', 'creativeGoal')}
Target viewpoint: ${typelit.string('writing', 'viewpoint')} with ${typelit.string('writing', 'pacing')} pacing.
Keep the outline under ${typelitTokenCount('writing', 'targetLengthTokens')}.

Premise: ${typelit.string('story', 'premise')}

World bible:
- Era and conflict: ${typelit.string('story', 'world', 'era')} – ${typelit.string('story', 'world', 'dominantConflict')}
- Key locations: ${typelit.json('story', 'world', 'keyLocations')}
- Cultural touchstones: ${typelit.json('story', 'world', 'culturalTouchstones')}
- Spell syntax rules:
${typelitMarkdown('story', 'world', 'magicSyntax')}

Core cast configuration:
${typelit.json('story', 'characters')}

Plot scaffolding:
${typelit.json('story', 'plot')}

Comparative references:
${typelit.string('supplemental', 'referenceLibrary')}

${outputFormatInstruction}
`;

/**
 * Builds a rich creative writing prompt with dense nested context.
 *
 * Automatically injects literary references when the user provides them, and
 * falls back to a guardrail explaining why none are present.
 */
export function buildCreativeWritingPrompt(input: CreativeWritingInput) {
  const referenceLibrary =
    input.story.referenceStories && input.story.referenceStories.length > 0
      ? input.story.referenceStories
          .map(({ title, reason }) => `- ${title}: ${reason}`)
          .join('\n')
      : 'No comparative references provided. Stay original but maintain tonal consistency.';

  const supplemental = {
    referenceLibrary,
  };

  return {
    system: creativeSystemPrompt({ ...input, supplemental }),
    user: creativeUserPrompt({ ...input, supplemental }),
  };
}

/**
 * Example creative writing payload showcasing deep world-building.
 */
export const sampleCreativeWritingInput: CreativeWritingInput = {
  story: {
    genre: 'solarpunk',
    premise:
      'A city-sized greenhouse arcology prepares for its first contact with an ocean-dwelling civilization beneath the ice.',
    world: {
      era: 'Post-carbon renaissance',
      keyLocations: [
        'Heliopolis canopy gardens',
        'Subglacial listening chambers',
        'The lumen archive (AI curated library)',
      ],
      culturalTouchstones: [
        'Ceremonial pollination festivals',
        'Conflict mediation via communal dreaming',
        'Bioluminescent tattoos that record personal vows',
      ],
      magicSyntax: [
        'Root-binding mantra:',
        '```',
        'align breath with sun cycle',
        'invoke lumen seed registry',
        'channel heat into the vascular lattice',
        '```',
        'Resonance etiquette:',
        '```',
        'no vocalization above 40Hz within reflection chambers',
        'sustain notes for triads of 12 heartbeats',
        'harmonic breach is punishable by exile',
        '```',
      ].join('\n'),
      dominantConflict:
        'Negotiating energy-sharing treaties without collapsing the oceanic thermocline.',
    },
    characters: {
      protagonist: {
        name: 'Iris Vale',
        archetype: 'strategist',
        motivations: [
          'Preserve the arcology ecosystem',
          'Prove the viability of non-extractive diplomacy',
        ],
        internalConflict:
          'Questions whether engineered empathy rituals can be authentic.',
      },
      antagonist: {
        name: 'Admiral Kade',
        powerBase:
          'Command of the geothermal fleet stationed under the ice shelf',
        motivations: [
          'Secure exclusive energy rights',
          'Expose perceived hypocrisy in Heliopolis leadership',
        ],
        secret:
          'Grew up in the arcology before defecting to the oceanic coalition.',
      },
      supportingCast: [
        {
          role: 'Bioacoustic translator',
          tiesToProtagonist:
            'Iris’s sibling who communicates via harmonic algae blooms',
          agenda:
            'Ensure mutual comprehension even if it reveals family secrets.',
        },
        {
          role: 'Archivist AI',
          tiesToProtagonist:
            'Custodian of pre-collapse treaties bound to assist any envoy',
          agenda:
            'Maintain impartiality while nudging toward long-term stability.',
        },
      ],
    },
    plot: {
      incitingIncident:
        'An emissary whale breaches the ice with a treaty encoded in bioluminescent pulses.',
      turningPoints: [
        'The oceanic delegation requests access to the arcology’s seed vault.',
        'A heatwave threatens the delicate ice layer protecting the sea civilization.',
        'Evidence surfaces that Admiral Kade sabotaged past negotiations.',
      ],
      climaxImagery:
        'Aurora-lit ice caverns resonating with synchronized whale song and human choir harmonies.',
      themes: [
        'Radical cooperation',
        'Tension between engineered and organic ecosystems',
        'Legacy of promises kept or broken',
      ],
    },
    referenceStories: [
      {
        title: 'The Dispossessed',
        reason:
          'Use the delicate political balance and moral ambiguity as inspiration.',
      },
      {
        title: 'The Long Way to a Small, Angry Planet',
        reason: 'Match the hopeful tone and found-family dynamics.',
      },
    ],
  },
  writing: {
    targetLengthTokens: 750,
    viewpoint: 'third-person-limited',
    pacing: 'measured',
  },
  preferences: {
    tone: 'hopeful',
    detailLevel: 'rich-prose',
    outputFormat: {
      includeOutline: true,
      includeChapterSummaries: true,
      includeSampleScene: true,
      narrativeVoice: 'present-tense',
    },
  },
  user: {
    authorName: 'Leo Martínez',
    creativeGoal:
      'Pitch a serialized audio drama that balances ecological optimism with political intrigue.',
  },
  model: {
    temperature: 0.85,
    maxTokens: 1200,
  },
};
