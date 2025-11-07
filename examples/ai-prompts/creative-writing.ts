import { typelit } from '../../src/typelit';

/**
 * Creative Writing Helper Example
 *
 * Demonstrates:
 * - Rich nested context (character details, plot elements, world-building)
 * - Complex type structures for creative content
 * - Optional fields for flexible prompting
 * - Multiple levels of nesting to show Typelit's power
 */

type Genre =
  | 'fantasy'
  | 'sci-fi'
  | 'mystery'
  | 'thriller'
  | 'romance'
  | 'historical';
type Tone = 'dark' | 'light-hearted' | 'serious' | 'whimsical' | 'gritty';
type Perspective = 'first-person' | 'third-person-limited' | 'third-person-omniscient';

type Character = {
  name: string;
  age: number;
  background: {
    occupation: string;
    personality: string[];
    motivations: string;
    fears: string;
  };
  appearance: {
    physicalDescription: string;
    distinctiveFeatures: string[];
  };
  relationships: {
    allies?: string[];
    enemies?: string[];
    complicated?: string[];
  };
};

type WorldBuilding = {
  setting: {
    location: string;
    timePeriod: string;
    atmosphere: string;
  };
  rules: {
    magicSystem?: string;
    technology?: string;
    socialStructure: string;
  };
  conflicts: {
    personal: string[];
    societal: string[];
  };
};

type PlotElements = {
  incitingIncident: string;
  centralConflict: string;
  stakes: string;
  themes: string[];
  desiredLength: string;
};

type WritingPreferences = {
  genre: Genre;
  tone: Tone;
  perspective: Perspective;
  targetAudience: string;
};

export const creativeWritingPrompt = typelit`You are a creative writing assistant helping to develop a compelling story.

STORY PREFERENCES
Genre: ${typelit.string('preferences', 'genre')}
Tone: ${typelit.string('preferences', 'tone')}
Perspective: ${typelit.string('preferences', 'perspective')}
Target Audience: ${typelit.string('preferences', 'targetAudience')}

PROTAGONIST
Name: ${typelit.string('protagonist', 'name')}
Age: ${typelit.number('protagonist', 'age')}

Background:
- Occupation: ${typelit.string('protagonist', 'background', 'occupation')}
- Personality: ${typelit.json('protagonist', 'background', 'personality')}
- Core Motivation: ${typelit.string('protagonist', 'background', 'motivations')}
- Deepest Fear: ${typelit.string('protagonist', 'background', 'fears')}

Appearance:
- Physical Description: ${typelit.string('protagonist', 'appearance', 'physicalDescription')}
- Distinctive Features: ${typelit.json('protagonist', 'appearance', 'distinctiveFeatures')}

Relationships:
${typelit.json('protagonist', 'relationships')}

WORLD-BUILDING
Setting:
- Location: ${typelit.string('world', 'setting', 'location')}
- Time Period: ${typelit.string('world', 'setting', 'timePeriod')}
- Atmosphere: ${typelit.string('world', 'setting', 'atmosphere')}

World Rules:
${typelit.json('world', 'rules')}

Conflicts:
- Personal: ${typelit.json('world', 'conflicts', 'personal')}
- Societal: ${typelit.json('world', 'conflicts', 'societal')}

PLOT STRUCTURE
Inciting Incident: ${typelit.string('plot', 'incitingIncident')}
Central Conflict: ${typelit.string('plot', 'centralConflict')}
Stakes: ${typelit.string('plot', 'stakes')}
Themes to Explore: ${typelit.json('plot', 'themes')}
Desired Length: ${typelit.string('plot', 'desiredLength')}

---

Based on the above details, please write the opening scene that:
1. Establishes the protagonist's character and current situation
2. Hints at the world's unique elements
3. Sets the tone and atmosphere
4. Creates an immediate hook for the reader
5. Naturally leads toward the inciting incident

The scene should be vivid, engaging, and true to the specified genre and tone.`;

// Sample data - Fantasy example
export const sampleProtagonist: Character = {
  name: 'Kira Thornweave',
  age: 28,
  background: {
    occupation: 'Disgraced Royal Scholar',
    personality: [
      'Fiercely intelligent',
      'Haunted by past mistakes',
      'Sarcastic defense mechanism',
      'Loyal to those who earn it',
    ],
    motivations:
      'Redeem herself by uncovering the truth about the forbidden magic that destroyed her mentor',
    fears: 'That she carries the same corruption that consumed her mentor',
  },
  appearance: {
    physicalDescription:
      'Tall and lean with ink-stained fingers and permanent dark circles under her eyes',
    distinctiveFeatures: [
      'Silver streak in her black hair from a magical accident',
      'Intricate tattoo of banned runes on her left forearm, usually hidden',
      'Always carries a worn leather journal',
    ],
  },
  relationships: {
    allies: ['Marcus (former fellow scholar, now investigator)', 'The Archivist (mysterious information broker)'],
    enemies: ['The Council of Mages who expelled her', 'Her former rival Daven, now a High Inquisitor'],
    complicated: ['Her younger sister Elena, who still serves the Council'],
  },
};

export const sampleWorld: WorldBuilding = {
  setting: {
    location: 'Archeon City, capital of the Luminous Empire',
    timePeriod: 'Post-magical-revolution era (roughly Renaissance equivalent)',
    atmosphere:
      'Glittering spires hide deep corruption; magic is regulated and feared',
  },
  rules: {
    magicSystem:
      'Runic magic powered by willpower and knowledge. Forbidden runes offer great power but corrupt the user. All magic use is monitored by the Council.',
    technology: 'Early mechanical innovation mixed with magical enhancement',
    socialStructure:
      'Strict hierarchy: Mages rule, scholars advise, merchants profit, common folk obey. Dissenters disappear.',
  },
  conflicts: {
    personal: [
      'Kira must choose between redemption within the system or revolution against it',
      'Her investigation endangers her sister who still serves the Council',
    ],
    societal: [
      'The Council suppresses forbidden knowledge while secretly using it',
      'A resistance movement grows in the shadows',
      'The barrier protecting the city from external threats is weakening',
    ],
  },
};

export const samplePlot: PlotElements = {
  incitingIncident:
    "Kira discovers her mentor's final research notes hidden in a banned text, suggesting the Council deliberately orchestrated his corruption",
  centralConflict:
    'Uncover the Council conspiracy while avoiding detection and deciding who to trust',
  stakes:
    'The truth could save or destroy the Empire; Kira could restore her name or become the next corrupted mage',
  themes: [
    'The price of forbidden knowledge',
    'Redemption vs. revenge',
    'Individual truth vs. societal order',
    'Power corrupts those who claim to protect',
  ],
  desiredLength: 'Opening scene for a novel (1000-1500 words)',
};

export const samplePreferences: WritingPreferences = {
  genre: 'fantasy',
  tone: 'gritty',
  perspective: 'third-person-limited',
  targetAudience: 'Adult readers who enjoy complex moral questions',
};

// Example usage
// const prompt = creativeWritingPrompt({
//   preferences: samplePreferences,
//   protagonist: sampleProtagonist,
//   world: sampleWorld,
//   plot: samplePlot,
// });
