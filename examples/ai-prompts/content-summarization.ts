import { typelit } from '../../src/typelit';

/**
 * Content Summarization Example
 *
 * Demonstrates:
 * - Type-safe prompt generation for article summarization
 * - Custom output length and style preferences
 * - Optional context fields (audience, specific focus)
 */

type SummaryLength = 'brief' | 'detailed' | 'comprehensive';
type SummaryStyle = 'bullet-points' | 'paragraph' | 'executive';
type Audience = 'general' | 'technical' | 'business' | 'academic';

type Article = {
  title: string;
  content: string;
  author: string;
  publicationDate: Date;
};

type SummaryPreferences = {
  length: SummaryLength;
  style: SummaryStyle;
  audience?: Audience;
  focusOn?: string[];
};

export const summarizationPrompt = typelit`You are a professional content summarizer.

Please summarize the following article:

Title: ${typelit.string('article', 'title')}
Author: ${typelit.string('article', 'author')}
Published: ${typelit.date('article', 'publicationDate')}

Content:
${typelit.string('article', 'content')}

---

Summary Requirements:
- Length: ${typelit.string('preferences', 'length')}
- Style: ${typelit.string('preferences', 'style')}
- Target audience: ${typelit.string('preferences', 'audience')}

${typelit.string('additionalInstructions')}

Provide a clear, accurate summary that captures the main points and key insights.`;

// Sample data
export const sampleArticle: Article = {
  title: 'The Future of Type-Safe Template Systems',
  content: `In modern software development, the intersection of type safety and dynamic content generation has become increasingly important. Traditional string concatenation and templating systems often lack the compile-time guarantees that developers need to build robust applications.

Type-safe templating systems offer a solution by catching errors at development time rather than runtime. This approach is particularly valuable in scenarios where missing or incorrectly typed data can lead to broken user experiences or security vulnerabilities.

The key innovation is leveraging TypeScript's advanced type system to create templates that understand their data requirements. When a template expects certain fields, the type system enforces that those fields are provided with the correct types. This eliminates entire classes of bugs and makes refactoring safer and more straightforward.

As applications become more complex and data-driven, the benefits of type-safe templating become even more pronounced. Development teams can work with confidence, knowing that their templates will always receive the correct data structure.`,
  author: 'Dr. Sarah Chen',
  publicationDate: new Date('2024-11-01'),
};

export const samplePreferences: SummaryPreferences = {
  length: 'brief',
  style: 'bullet-points',
  audience: 'technical',
};

export const additionalInstructions =
  'Focus on practical implications for software development teams.';

// Example usage
// const prompt = summarizationPrompt({
//   article: sampleArticle,
//   preferences: samplePreferences,
//   additionalInstructions: additionalInstructions,
// });
