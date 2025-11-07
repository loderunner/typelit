/**
 * Before/After Comparison Example
 *
 * Shows the difference between string concatenation hell
 * and Typelit's type-safe approach.
 */

import { typelit } from '../../src/typelit';
import { typelitMarkdown } from './prompt-utils';

type CodeReviewContext = {
  code: {
    language: string;
    snippet: string;
  };
  user: {
    experienceLevel: string;
  };
  review: {
    focusAreas: string[];
  };
};

/**
 * ❌ BEFORE: String concatenation hell
 * 
 * Problems:
 * - Easy to miss variables
 * - No type safety
 * - Hard to refactor
 * - Runtime errors if context is wrong
 * - Hard to see what variables are needed
 */
export function buildCodeReviewPromptOldWay(context: CodeReviewContext): string {
  let prompt = 'You are an expert code reviewer specializing in ';
  prompt += context.code.language + ' code.\n\n';
  prompt += 'Reviewer guidance for ' + context.user.experienceLevel;
  prompt += ' level developer:\n';
  
  // Oops! Forgot to add the actual guidance based on experience level
  // This bug would only be caught at runtime, if at all
  
  prompt += '\nFocus areas for this review:\n';
  prompt += JSON.stringify(context.review.focusAreas, null, 2);
  
  prompt += '\n\nCode to review:\n```\n';
  prompt += context.code.snippet;
  prompt += '\n```';
  
  // What if we need to add a new field? Have to find all the places
  // What if we rename a property? Good luck finding all usages
  // What if we misspell a property? Runtime error!
  
  return prompt;
}

/**
 * ✅ AFTER: Typelit type-safe approach
 * 
 * Benefits:
 * - TypeScript catches missing variables at compile time
 * - Refactoring is safe - TypeScript tells you what breaks
 * - Clear what variables are needed from the template
 * - Impossible to miss a variable - types enforce it
 * - Easy to see the structure
 */
export const codeReviewPromptNewWay = typelit`
You are an expert code reviewer specializing in ${typelit.string('context', 'code', 'language')} code.

Reviewer guidance for ${typelit.string('context', 'user', 'experienceLevel')} level developer:
${typelit.string('guidance')}

Focus areas for this review:
${typelit.json('context', 'review', 'focusAreas')}

Code to review:
${typelitMarkdown('context', 'code', 'snippet')}
`;

// Helper to build with proper guidance
export function buildCodeReviewPromptNewWay(context: CodeReviewContext & { guidance: string }): string {
  return codeReviewPromptNewWay(context);
}

// Example showing type safety
export const exampleContext = {
  context: {
    code: {
      language: 'TypeScript',
      snippet: 'function add(a: number, b: number) { return a + b; }',
    },
    user: {
      experienceLevel: 'intermediate',
    },
    review: {
      focusAreas: ['type safety', 'readability'],
    },
  },
  guidance: 'Balance between explanation and direct feedback. Highlight best practices.',
};

// Try uncommenting this to see TypeScript catch the error:
// const broken = codeReviewPromptNewWay({ context: exampleContext.context });
// Error: Property 'guidance' is missing

// Try uncommenting this to see TypeScript catch the typo:
// const broken2 = codeReviewPromptNewWay({ 
//   context: { ...exampleContext.context, code: { language: 'TS', snipet: '...' } },
//   guidance: '...'
// });
// Error: Property 'snippet' is missing, 'snipet' doesn't exist
