import { createType } from '../../src/typelit';

import { codeReviewPrompt, sampleCode, sampleReview } from './code-review';

/**
 * AI Prompt Generation Examples
 *
 * Demonstrates using Typelit with OpenAI's API.
 * Run with: npx tsx examples/ai-prompts/index.ts
 */

// ============================================================================
// Custom Formatters for AI Prompts
// ============================================================================

/**
 * Format token count with appropriate scale
 */
export const typelitTokenCount = createType<number>({
  stringify: (tokens) => {
    if (tokens < 1000) return `${tokens} tokens`;
    if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K tokens`;
    return `${(tokens / 1000000).toFixed(2)}M tokens`;
  },
});

/**
 * Format model temperature parameter with description
 */
export const typelitTemperature = createType<number>({
  stringify: (temp) => {
    if (temp < 0 || temp > 2) return `${temp} (invalid range)`;
    if (temp <= 0.3) return `${temp} (very focused)`;
    if (temp <= 0.7) return `${temp} (balanced)`;
    if (temp <= 1.2) return `${temp} (creative)`;
    return `${temp} (highly creative)`;
  },
});

/**
 * Format markdown code blocks properly escaped for prompts
 */
export const typelitMarkdown = createType<string>({
  stringify: (markdown) => {
    return markdown.trim();
  },
});

/**
 * Format numbers as percentages
 */
export const typelitPercentage = createType<number>({
  stringify: (value) => `${(value * 100).toFixed(1)}%`,
});

/**
 * Format currency values
 */
export const typelitCurrency = createType<number>({
  stringify: (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  },
});

// ============================================================================
// Example: Code Review with OpenAI
// ============================================================================

async function main() {
  // Generate type-safe prompt
  const prompt = codeReviewPrompt({
    code: sampleCode,
    review: sampleReview,
  });

  console.log('Generated Prompt:');
  console.log('='.repeat(80));
  console.log(prompt);
  console.log('='.repeat(80));
  console.log();

  // Example with OpenAI (requires OPENAI_API_KEY in environment)
  if (process.env.OPENAI_API_KEY) {
    try {
      // Dynamic import to avoid requiring openai as a dependency
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI();

      console.log('Sending to OpenAI...');
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

      console.log('\nOpenAI Response:');
      console.log('-'.repeat(80));
      console.log(completion.choices[0].message.content);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error calling OpenAI:', error.message);
      }
    }
  } else {
    console.log(
      'Set OPENAI_API_KEY environment variable to test with OpenAI API',
    );
  }
}

main().catch(console.error);
