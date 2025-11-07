import OpenAI from 'openai';

import {
  sampleCode,
  sampleReview,
  systemPrompt,
  userPrompt,
} from './code-review';

/**
 * AI Prompt Generation Examples
 *
 * Demonstrates using Typelit with OpenAI's API.
 * Requires OPENAI_API_KEY environment variable.
 * Run with: npx tsx examples/ai-prompts/index.ts
 */

// Generate type-safe prompts
const system = systemPrompt({ code: { language: sampleCode.language } });
const user = userPrompt({
  code: sampleCode,
  review: sampleReview,
});

// Call OpenAI API
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content: system,
    },
    {
      role: 'user',
      content: user,
    },
  ],
  temperature: 0.7,
});

console.log(completion.choices[0].message.content);
