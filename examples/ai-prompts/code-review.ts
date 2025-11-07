import { typelit } from '../../src/typelit';

/**
 * Code Review Assistant Example
 *
 * Demonstrates:
 * - Separate system and user prompt templates
 * - Nested context for code properties
 * - Type-safe handling of review focus areas
 * - JSON formatting for structured data
 */

type Language = 'typescript' | 'python' | 'go' | 'rust' | 'java' | 'javascript';

type CodeSnippet = {
  language: Language;
  snippet: string;
  context?: string;
};

type ReviewCriteria = {
  focusAreas: string[];
  checkForIssues: string[];
};

export const systemPrompt = typelit`You are an expert code reviewer providing constructive feedback.`;

export const userPrompt = typelit`Language: ${typelit.string('code', 'language')}

Code to review:
\`\`\`${typelit.string('code', 'language')}
${typelit.string('code', 'snippet')}
\`\`\`

${typelit.string('code', 'context')}

---

Review Focus:
${typelit.json('review', 'focusAreas')}

Check specifically for:
${typelit.json('review', 'checkForIssues')}

Please provide a thorough code review that:
1. Identifies potential bugs or issues
2. Suggests improvements for readability and maintainability
3. Highlights good practices already present
4. Focuses on the specified areas of concern

Format your response with clear sections and actionable recommendations.`;

export const sampleCode: CodeSnippet = {
  language: 'typescript',
  snippet: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}`,
  context: 'This function calculates the total price for a shopping cart.',
};

export const sampleReview: ReviewCriteria = {
  focusAreas: ['Type safety', 'Error handling', 'Best practices'],
  checkForIssues: [
    'Missing type annotations',
    'Edge cases not handled',
    'Code readability',
  ],
};

// Example usage
// const system = systemPrompt({});
// const user = userPrompt({
//   code: sampleCode,
//   review: sampleReview,
// });
