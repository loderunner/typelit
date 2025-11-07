import { typelit } from '../../src/typelit';

import {
  modelSettingsInstruction,
  outputFormatInstruction,
  toneInstruction,
  typelitMarkdown,
} from './building-blocks';

type ExperienceLevel = 'junior' | 'intermediate' | 'senior';

type CodeReviewInput = {
  code: {
    language: 'typescript' | 'python' | 'go';
    snippet: string;
    repository: string;
    changedFiles: string[];
    recentTestRuns: Array<{ name: string; status: 'pass' | 'fail' }>;
  };
  review: {
    focusAreas: Array<
      'correctness' | 'performance' | 'readability' | 'security'
    >;
    bugHistory: string[];
    severity: 'low' | 'medium' | 'high';
    previousIncidents?: string[];
  };
  user: {
    experienceLevel: ExperienceLevel;
    prefersActionableTickets: boolean;
  };
  preferences: {
    tone: 'direct' | 'mentoring' | 'collaborative';
    detailLevel: 'key-points' | 'deep-dive';
    outputFormat: {
      sections: Array<'summary' | 'issues' | 'tests' | 'followUp'>;
      includePositiveFeedback: boolean;
      linkToDocs: boolean;
    };
  };
  model: {
    temperature: number;
    maxTokens: number;
  };
};

const codeReviewSystemPrompt = typelit`
You are a meticulous ${typelit.string('code', 'language')} reviewer for the repository ${typelit.string('code', 'repository')}.

${toneInstruction}
${modelSettingsInstruction}

Tailor feedback to a ${typelit.string('user', 'experienceLevel')} developer.
Prioritize these focus areas: ${typelit.json('review', 'focusAreas')}

${outputFormatInstruction}
`;

const codeReviewUserPrompt = typelit`
Review this ${typelit.string('code', 'language')} code.
User's experience level: ${typelit.string('user', 'experienceLevel')}
Focus areas: ${typelit.json('review', 'focusAreas')}

Code:
${typelitMarkdown('code', 'snippet')}

Changed files: ${typelit.json('code', 'changedFiles')}
Recent test history: ${typelit.json('code', 'recentTestRuns')}
Repository bug history: ${typelit.json('review', 'bugHistory')}
Severity of potential issues: ${typelit.string('review', 'severity')}

Previous incidents to watch for:
${typelit.string('supplemental', 'incidentNotes')}

Reviewer directives:
${typelit.string('supplemental', 'experienceDirective')}

When proposing fixes, ${typelit.string('supplemental', 'ticketingStyle')}
`;

function resolveExperienceDirective(level: ExperienceLevel) {
  switch (level) {
    case 'junior':
      return 'Explain trade-offs plainly and suggest incremental fixes.';
    case 'intermediate':
      return 'Focus on maintainability and testing strategy validation.';
    case 'senior':
      return 'Assume context on system design; call out architectural risks.';
    default: {
      const exhaustiveCheck: never = level;
      throw new Error(`Unhandled experience level: ${exhaustiveCheck}`);
    }
  }
}

/**
 * Builds a code review prompt that adapts to the developer's experience level.
 *
 * Ensures required supplemental context is always derived when optional input
 * fields (like prior incidents) are missing.
 */
export function buildCodeReviewPrompt(input: CodeReviewInput) {
  const incidentNotes =
    input.review.previousIncidents && input.review.previousIncidents.length > 0
      ? input.review.previousIncidents
          .map((incident) => `- ${incident}`)
          .join('\n')
      : 'No previous production incidents supplied.';

  const supplemental = {
    experienceDirective: resolveExperienceDirective(input.user.experienceLevel),
    incidentNotes,
    ticketingStyle: input.user.prefersActionableTickets
      ? 'provide ready-to-file tickets with acceptance criteria.'
      : 'focus on conceptual feedback rather than filing tickets.',
  };

  return {
    system: codeReviewSystemPrompt({ ...input, supplemental }),
    user: codeReviewUserPrompt({ ...input, supplemental }),
  };
}

/**
 * Example code review payload demonstrating a TypeScript service review.
 */
export const sampleCodeReviewInput: CodeReviewInput = {
  code: {
    language: 'typescript',
    snippet: [
      'export async function getUserProfile(req: Request) {',
      "  const userId = req.params.userId ?? '';",
      '  const cacheKey = `user-profile:${userId}`;',
      '  let profile = await cache.get(cacheKey);',
      '  if (!profile) {',
      '    profile = await db.user.findUnique({ where: { id: userId } });',
      '    if (profile) {',
      '      await cache.set(cacheKey, profile, { ttl: 60 });',
      '    }',
      '  }',
      '  return profile;',
      '}',
    ].join('\n'),
    repository: 'git@github.com:acme/platform.git',
    changedFiles: [
      'services/user/get-user-profile.ts',
      'services/user/cache.ts',
    ],
    recentTestRuns: [
      { name: 'unit:user-service', status: 'pass' },
      { name: 'integration:user-endpoints', status: 'fail' },
    ],
  },
  review: {
    focusAreas: ['correctness', 'security', 'performance'],
    bugHistory: [
      'Missing null-checks on optional fields caused incidents last quarter.',
      'Cache stampede during product launches slowed the API.',
    ],
    severity: 'medium',
    previousIncidents: [
      '2024-05-02: Cached stale user profiles due to missing invalidation.',
    ],
  },
  user: {
    experienceLevel: 'intermediate',
    prefersActionableTickets: true,
  },
  preferences: {
    tone: 'collaborative',
    detailLevel: 'deep-dive',
    outputFormat: {
      sections: ['summary', 'issues', 'tests', 'followUp'],
      includePositiveFeedback: true,
      linkToDocs: true,
    },
  },
  model: {
    temperature: 0.1,
    maxTokens: 700,
  },
};
