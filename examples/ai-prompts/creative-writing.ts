import { typelit } from '../../src/typelit';
import { typelitMarkdown, typelitTokenCount, typelitTemperature } from './prompt-utils';

/**
 * Creative Writing Prompt Example
 *
 * Demonstrates:
 * - Deeply nested character details (character.appearance.physical, character.background)
 * - Complex world-building context
 * - Plot element composition
 * - Genre-specific instructions
 * - Rich nested paths showing Typelit's power
 */

type Character = {
  name: string;
  role: string;
  appearance: {
    physical: {
      age: number;
      height: string;
      build: string;
      distinguishingFeatures: string[];
    };
    style: {
      clothing: string;
      accessories: string[];
    };
  };
  background: {
    origin: string;
    occupation: string;
    motivations: string[];
    fears: string[];
  };
  personality: {
    traits: string[];
    speechPattern: string;
  };
};

type WorldBuilding = {
  setting: {
    location: string;
    timePeriod: string;
    technologyLevel: string;
  };
  rules: {
    magic?: {
      system: string;
      limitations: string[];
    };
    physics?: string[];
  };
  culture: {
    socialStructure: string;
    customs: string[];
  };
};

type CreativeWritingRequest = {
  genre: 'fantasy' | 'sci-fi' | 'mystery' | 'romance' | 'horror';
  characters: Character[];
  world: WorldBuilding;
  plot: {
    incitingIncident: string;
    conflict: string;
    desiredOutcome: string;
    keyScenes: string[];
  };
  style: {
    tone: 'dark' | 'light' | 'satirical' | 'dramatic';
    pacing: 'fast' | 'moderate' | 'slow';
    pov: 'first' | 'third-limited' | 'third-omniscient';
  };
  constraints?: {
    maxLength?: number;
    includeDialogue: boolean;
  };
};

export const creativeWritingPrompt = typelit`
You are an expert creative writing assistant specializing in ${typelit.string('request', 'genre')} fiction.

## Genre & Style
Genre: ${typelit.string('request', 'genre')}
Tone: ${typelit.string('request', 'style', 'tone')}
Pacing: ${typelit.string('request', 'style', 'pacing')}
Point of View: ${typelit.string('request', 'style', 'pov')}

## Characters
${typelit.json('request', 'characters')}

## World Building
Setting: ${typelit.string('request', 'world', 'setting', 'location')}
Time Period: ${typelit.string('request', 'world', 'setting', 'timePeriod')}
Technology Level: ${typelit.string('request', 'world', 'setting', 'technologyLevel')}

Social Structure: ${typelit.string('request', 'world', 'culture', 'socialStructure')}
Customs: ${typelit.json('request', 'world', 'culture', 'customs')}

${typelit.string('magicSystemContext')}
${typelit.string('physicsRulesContext')}

## Plot
Inciting Incident: ${typelit.string('request', 'plot', 'incitingIncident')}
Central Conflict: ${typelit.string('request', 'plot', 'conflict')}
Desired Outcome: ${typelit.string('request', 'plot', 'desiredOutcome')}
Key Scenes: ${typelit.json('request', 'plot', 'keyScenes')}

## Instructions
${typelit.string('povInstruction')}
${typelit.string('dialogueInstruction')}
${typelit.string('lengthConstraint')}

Write a compelling scene that brings these elements together, staying true to the genre conventions while creating something fresh and engaging.
`;

// Helper function to build the full prompt with conditional parts
export const buildCreativeWritingPrompt = (request: CreativeWritingRequest) => {
  const magicSystemContext = request.world.rules?.magic
    ? `Magic System: ${JSON.stringify(request.world.rules.magic, null, 2)}`
    : '';
  const physicsRulesContext = request.world.rules?.physics
    ? `Physics Rules: ${JSON.stringify(request.world.rules.physics, null, 2)}`
    : '';
  
  const povInstructions = {
    first: 'Write in first person perspective.',
    'third-limited': 'Write in third person limited perspective.',
    'third-omniscient': 'Write in third person omniscient perspective.',
  };
  
  const povInstruction = povInstructions[request.style.pov];
  const dialogueInstruction = request.constraints?.includeDialogue
    ? 'Include dialogue between characters.'
    : 'Focus on narrative description.';
  const lengthConstraint = request.constraints?.maxLength
    ? `Keep the output under ${new Intl.NumberFormat('en-US').format(request.constraints.maxLength)} tokens.`
    : '';

  return creativeWritingPrompt({
    request,
    magicSystemContext,
    physicsRulesContext,
    povInstruction,
    dialogueInstruction,
    lengthConstraint,
  });
};

export const sampleCreativeWritingRequest: CreativeWritingRequest = {
  genre: 'fantasy',
  characters: [
    {
      name: 'Lyra Shadowweaver',
      role: 'protagonist',
      appearance: {
        physical: {
          age: 23,
          height: "5'6\"",
          build: 'slender but athletic',
          distinguishingFeatures: ['silver-streaked black hair', 'amber eyes that glow faintly in moonlight', 'small scar above left eyebrow'],
        },
        style: {
          clothing: 'dark leather tunic with silver fastenings',
          accessories: ['ancient amulet with unknown runes', 'worn satchel', 'dagger with bone handle'],
        },
      },
      background: {
        origin: 'orphaned in the Shadowlands, raised by thieves',
        occupation: 'arcane scholar and part-time relic hunter',
        motivations: ['discover the truth about her parents', 'master forbidden magic', 'protect the innocent'],
        fears: ['losing control of her power', 'becoming like those who killed her parents'],
      },
      personality: {
        traits: ['cunning', 'loyal', 'reckless', 'curious'],
        speechPattern: 'quick-witted, uses arcane terminology casually',
      },
    },
    {
      name: 'Kaelen Ironforge',
      role: 'mentor',
      appearance: {
        physical: {
          age: 58,
          height: "6'2\"",
          build: 'broad-shouldered, battle-scarred',
          distinguishingFeatures: ['graying beard braided with metal rings', 'missing left hand (replaced with magical prosthetic)', 'intense blue eyes'],
        },
        style: {
          clothing: 'sturdy dwarven-forged armor',
          accessories: ['warhammer with runic inscriptions', 'tankard that never empties'],
        },
      },
      background: {
        origin: 'mountain dwarf clan',
        occupation: 'retired war hero, now runs a magical academy',
        motivations: ['pass on knowledge', 'prevent another magical war'],
        fears: ['students making his past mistakes', 'dark magic returning'],
      },
      personality: {
        traits: ['gruff', 'wise', 'protective', 'stubborn'],
        speechPattern: 'direct, uses military metaphors',
      },
    },
  ],
  world: {
    setting: {
      location: 'the floating city of Aetherspire',
      timePeriod: 'Age of Reckoning (500 years after the Great Sundering)',
      technologyLevel: 'magitech - combination of magic and mechanical engineering',
    },
    rules: {
      magic: {
        system: 'elemental weaving - mages draw power from elemental planes',
        limitations: [
          'overuse causes physical decay',
          'each mage can only access 2-3 elements',
          'magic is tied to emotional state',
        ],
      },
      physics: [
        'gravity can be manipulated by skilled mages',
        'time flows differently in certain magical zones',
        'souls persist after death and can be bound to objects',
      ],
    },
    culture: {
      socialStructure: 'meritocratic council of mages, with commoners having limited rights',
      customs: [
        'naming ceremony at age 13 where magic affinity is tested',
        'annual Festival of Elements where mages demonstrate their skills',
        'forbidden to use magic on the dead',
      ],
    },
  },
  plot: {
    incitingIncident: 'Lyra discovers an ancient artifact that reacts to her touch, revealing she has forbidden Shadow magic',
    conflict: 'The artifact is sought by a secret organization that wants to use it to control all magic',
    desiredOutcome: 'Lyra must learn to control her power while preventing the artifact from falling into wrong hands',
    keyScenes: [
      'Discovery of the artifact in the forbidden archives',
      'First confrontation with the shadow organization',
      'Training session with Kaelen where she learns about her true power',
      'Climactic battle in the floating city',
    ],
  },
  style: {
    tone: 'dark',
    pacing: 'moderate',
    pov: 'third-limited',
  },
  constraints: {
    maxLength: 2000,
    includeDialogue: true,
  },
};
