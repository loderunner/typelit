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

export type Article = {
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
export const samplePreferences: SummaryPreferences = {
  length: 'brief',
  style: 'bullet-points',
  audience: 'technical',
};

export const additionalInstructions =
  'Focus on practical implications for software development teams.';

// Example usage
// const prompt = summarizationPrompt({
//   article: { title: '...', content: '...', author: '...', publicationDate: new Date() },
//   preferences: samplePreferences,
//   additionalInstructions: additionalInstructions,
// });
