import OpenAI from 'openai';

import { codeReviewPrompt, sampleCode, sampleReview } from './code-review';

/**
 * AI Prompt Generation Examples
 *
 * Demonstrates using Typelit with OpenAI's API.
 * Run with: npx tsx examples/ai-prompts/index.ts
 */

// Generate type-safe prompt
const prompt = codeReviewPrompt({
  code: sampleCode,
  review: sampleReview,
});

// Example with OpenAI (requires OPENAI_API_KEY in environment)
if (process.env.OPENAI_API_KEY) {
  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert code reviewer.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  console.log(completion.choices[0].message.content);
}
