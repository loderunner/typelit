import { typelit } from '../../src/typelit';

/**
 * Code Review Assistant Example
 *
 * Demonstrates:
 * - Nested context (code properties, user properties, review criteria)
 * - Different configurations based on experience level
 * - Type-safe handling of review focus areas
 * - Custom JSON formatting for structured data
 */

type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'principal';
type Language = 'typescript' | 'python' | 'go' | 'rust' | 'java' | 'javascript';

type CodeSnippet = {
  language: Language;
  snippet: string;
  context?: string;
  filePath?: string;
};

type User = {
  experienceLevel: ExperienceLevel;
  preferences: {
    verbosity: 'concise' | 'detailed';
    includeExamples: boolean;
  };
};

type ReviewCriteria = {
  focusAreas: string[];
  checkForIssues: string[];
  styleGuide?: string;
};

export const codeReviewPrompt = typelit`You are an expert code reviewer providing constructive feedback.

Code Details:
- Language: ${typelit.string('code', 'language')}
${typelit.string('code', 'filePath')}

Code to review:
\`\`\`${typelit.string('code', 'language')}
${typelit.string('code', 'snippet')}
\`\`\`

${typelit.string('code', 'context')}

---

Reviewer Profile:
- Experience level: ${typelit.string('user', 'experienceLevel')}
- Preferred verbosity: ${typelit.string('user', 'preferences', 'verbosity')}
- Include examples: ${typelit.boolean('user', 'preferences', 'includeExamples')}

Review Focus:
${typelit.json('review', 'focusAreas')}

Check specifically for:
${typelit.json('review', 'checkForIssues')}

${typelit.string('styleGuideNote')}

Please provide a thorough code review that:
1. Identifies potential bugs or issues
2. Suggests improvements for readability and maintainability
3. Highlights good practices already present
4. Adjusts explanation depth based on the reviewer's experience level
5. Focuses on the specified areas of concern

Format your response with clear sections and actionable recommendations.`;

// Sample data for junior developer
export const sampleCodeJunior: CodeSnippet = {
  language: 'typescript',
  snippet: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}`,
  context: 'This function calculates the total price for a shopping cart.',
  filePath: 'File: src/cart/calculator.ts',
};

export const sampleUserJunior: User = {
  experienceLevel: 'junior',
  preferences: {
    verbosity: 'detailed',
    includeExamples: true,
  },
};

export const sampleReviewJunior: ReviewCriteria = {
  focusAreas: ['Type safety', 'Error handling', 'Best practices'],
  checkForIssues: [
    'Missing type annotations',
    'Edge cases not handled',
    'Code readability',
  ],
};

// Sample data for senior developer
export const sampleCodeSenior: CodeSnippet = {
  language: 'typescript',
  snippet: `export async function processUserData<T extends UserBase>(
  users: T[],
  validator: (user: T) => Promise<boolean>,
  transformer: (user: T) => Promise<TransformedUser>
): Promise<TransformedUser[]> {
  const validUsers = await Promise.all(
    users.map(async (user) => {
      const isValid = await validator(user);
      return isValid ? user : null;
    })
  );
  
  return Promise.all(
    validUsers
      .filter((user): user is T => user !== null)
      .map(transformer)
  );
}`,
  context:
    'Generic utility for validating and transforming user data with async operations.',
  filePath: 'File: src/users/processing.ts',
};

export const sampleUserSenior: User = {
  experienceLevel: 'senior',
  preferences: {
    verbosity: 'concise',
    includeExamples: false,
  },
};

export const sampleReviewSenior: ReviewCriteria = {
  focusAreas: ['Performance', 'Type safety edge cases', 'API design'],
  checkForIssues: [
    'Unnecessary async operations',
    'Type narrowing correctness',
    'Error propagation',
  ],
  styleGuide: 'Follow strict TypeScript configuration',
};

export const styleGuideNote = (styleGuide?: string) =>
  styleGuide ? `\nStyle Guide: ${styleGuide}` : '';

// Example usage
// const prompt = codeReviewPrompt({
//   code: sampleCodeJunior,
//   user: sampleUserJunior,
//   review: sampleReviewJunior,
//   styleGuideNote: styleGuideNote(sampleReviewJunior.styleGuide),
// });
