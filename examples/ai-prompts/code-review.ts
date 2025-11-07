import { typelit } from '../../src/typelit';
import { typelitMarkdown, typelitTokenCount } from './prompt-utils';

/**
 * Code Review Prompt Example
 *
 * Demonstrates:
 * - Deeply nested context (code.language, user.experienceLevel, review.focusAreas)
 * - Experience-level-based prompt customization
 * - Multiple code snippets
 * - Structured review criteria
 */

type CodeReviewRequest = {
  code: {
    language: string;
    snippet: string;
  };
  user: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  review: {
    focusAreas: string[];
    includeSuggestions: boolean;
    maxLength?: number; // optional token limit
  };
};

const getExperienceLevelGuidance = (level: 'beginner' | 'intermediate' | 'advanced') => {
  const guidance = {
    beginner: 'Provide detailed explanations and gentle suggestions. Focus on learning opportunities.',
    intermediate: 'Balance between explanation and direct feedback. Highlight best practices.',
    advanced: 'Be concise and technical. Focus on edge cases, performance, and architecture.',
  };
  return guidance[level];
};

export const codeReviewPrompt = typelit`
You are an expert code reviewer specializing in ${typelit.string('request', 'code', 'language')} code.

Reviewer guidance for ${typelit.string('request', 'user', 'experienceLevel')} level developer:
${typelit.string('guidance')}

Focus areas for this review:
${typelit.json('request', 'review', 'focusAreas')}

${typelit.string('suggestionInstruction')}
${typelit.string('lengthConstraint')}

Code to review:
${typelitMarkdown('request', 'code', 'snippet')}

Provide a structured review covering:
1. Code quality and correctness
2. Performance considerations
3. Security concerns
4. Maintainability
5. Adherence to best practices
`;

// Helper function to build the full prompt with conditional parts
export const buildCodeReviewPrompt = (request: CodeReviewRequest) => {
  const guidance = getExperienceLevelGuidance(request.user.experienceLevel);
  const suggestionInstruction = request.review.includeSuggestions
    ? 'Include specific code suggestions and improvements.'
    : 'Provide feedback only, no code suggestions.';
  const lengthConstraint = request.review.maxLength
    ? `Keep your review under ${new Intl.NumberFormat('en-US').format(request.review.maxLength)} tokens.`
    : '';

  return codeReviewPrompt({
    request,
    guidance,
    suggestionInstruction,
    lengthConstraint,
  });
};

export const sampleCodeReviewRequest: CodeReviewRequest = {
  code: {
    language: 'TypeScript',
    snippet: `function processUsers(users: User[]) {
  const results = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      results.push({
        id: users[i].id,
        name: users[i].name.toUpperCase(),
        email: users[i].email
      });
    }
  }
  return results;
}`,
  },
  user: {
    experienceLevel: 'intermediate',
  },
  review: {
    focusAreas: ['performance', 'type safety', 'readability'],
    includeSuggestions: true,
    maxLength: 500,
  },
};
