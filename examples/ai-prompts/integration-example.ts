/**
 * Integration Example: Using Typelit Prompts with AI SDKs
 *
 * Demonstrates how to integrate type-safe prompt generation
 * with OpenAI, Anthropic, and other AI providers.
 */

import { buildCodeReviewPrompt, sampleCodeReviewRequest } from './code-review';
import { buildSummarizationPrompt, sampleSummarizationRequest } from './content-summarization';
import { buildCreativeWritingPrompt, sampleCreativeWritingRequest } from './creative-writing';

/**
 * Example: OpenAI Integration
 *
 * Note: This requires the OpenAI SDK to be installed:
 * npm install openai
 */
export async function exampleOpenAIIntegration() {
  // Uncomment when OpenAI SDK is available:
  /*
  import OpenAI from 'openai';
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = buildCodeReviewPrompt(sampleCodeReviewRequest);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert code reviewer. Provide detailed, constructive feedback.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
  */
  
  return 'OpenAI integration example - install openai package to use';
}

/**
 * Example: Anthropic Integration
 *
 * Note: This requires the Anthropic SDK to be installed:
 * npm install @anthropic-ai/sdk
 */
export async function exampleAnthropicIntegration() {
  // Uncomment when Anthropic SDK is available:
  /*
  import Anthropic from '@anthropic-ai/sdk';
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = buildSummarizationPrompt(sampleSummarizationRequest);

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.content[0].text;
  */
  
  return 'Anthropic integration example - install @anthropic-ai/sdk package to use';
}

/**
 * Example: Prompt Chaining
 *
 * Shows how to use output from one prompt as input to another.
 * Type safety ensures the chained data structures match.
 */
export async function examplePromptChaining() {
  // Step 1: Generate creative writing
  const creativePrompt = buildCreativeWritingPrompt(sampleCreativeWritingRequest);
  // const creativeOutput = await callAI(creativePrompt);
  const creativeOutput = '[Generated creative writing content...]';

  // Step 2: Summarize the creative output
  const summaryPrompt = buildSummarizationPrompt({
    article: creativeOutput,
    targetLength: 300,
    style: 'concise',
    tone: 'professional',
    focusAreas: ['plot', 'character development'],
  });

  // Type safety ensures:
  // - creativeOutput is a string (required by summarization)
  // - All required fields are present
  // - Types match expected structure

  return summaryPrompt;
}

/**
 * Example: Building Prompts from API Data
 *
 * Shows how to safely transform API responses into prompt context.
 * TypeScript ensures the transformation is correct.
 */
export function exampleBuildingFromAPIData() {
  // Simulated API response
  const apiTicketData = {
    id: 'CS-2024-08472',
    priority: 'high' as const,
    category: 'technical issue',
    subject: 'Unable to sync data',
    description: 'Data sync is broken after update',
    customer: {
      previousTickets: 2,
      satisfactionScore: 8,
    },
  };

  // Type-safe transformation
  const supportRequest = {
    ticket: {
      id: apiTicketData.id,
      priority: apiTicketData.priority,
      category: apiTicketData.category,
      subject: apiTicketData.subject,
      description: apiTicketData.description,
      customerHistory: {
        previousTickets: apiTicketData.customer.previousTickets,
        satisfactionScore: apiTicketData.customer.satisfactionScore,
      },
    },
    company: {
      name: 'CloudSync Pro',
      tone: 'empathetic' as const,
      values: ['customer-first', 'transparency', 'rapid resolution'],
    },
    product: {
      name: 'CloudSync Pro Desktop',
      version: '2.3.1',
      knownIssues: ['Sync fails for files larger than 500MB'],
      documentationUrl: 'https://docs.cloudsyncpro.com/troubleshooting',
    },
    response: {
      includeNextSteps: true,
      offerEscalation: true,
    },
  };

  // TypeScript ensures this matches the expected structure
  const { buildCustomerSupportPrompt } = require('./customer-support');
  return buildCustomerSupportPrompt(supportRequest);
}

/**
 * Example: Error Handling with Type Safety
 *
 * Shows how type safety prevents common errors when building prompts.
 */
export function exampleErrorHandling() {
  // This would cause a compile-time error:
  /*
  const brokenPrompt = buildSummarizationPrompt({
    // Missing 'article' field - TypeScript catches this!
    targetLength: 200,
    style: 'concise',
    tone: 'professional',
  });
  */

  // This would also cause a compile-time error:
  /*
  const brokenPrompt2 = buildSummarizationPrompt({
    article: '...',
    targetLength: '200', // Wrong type - should be number!
    style: 'concise',
    tone: 'professional',
  });
  */

  return 'Type safety prevents these errors at compile time';
}

// Run examples
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Integration Examples');
  console.log('='.repeat(80));
  console.log('\n1. OpenAI Integration:');
  console.log(exampleOpenAIIntegration());
  console.log('\n2. Anthropic Integration:');
  console.log(exampleAnthropicIntegration());
  console.log('\n3. Prompt Chaining:');
  console.log(examplePromptChaining());
  console.log('\n4. Building from API Data:');
  console.log(exampleBuildingFromAPIData());
  console.log('\n5. Error Handling:');
  console.log(exampleErrorHandling());
}
