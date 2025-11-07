import { codeReviewPrompt, sampleCode, sampleReview } from './code-review';

/**
 * AI Prompt Generation Examples
 *
 * Demonstrates using Typelit with OpenAI's API.
 * Run with: npx tsx examples/ai-prompts/index.ts
 */

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
