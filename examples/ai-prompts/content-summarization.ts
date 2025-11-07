import { typelit } from '../../src/typelit';
import { typelitTokenCount, typelitMarkdown, toneComponent } from './prompt-utils';

/**
 * Content Summarization Prompt Example
 *
 * Demonstrates:
 * - Token count formatting for length constraints
 * - Markdown formatting for article content
 * - Tone customization
 * - Optional context fields
 */

type SummarizationRequest = {
  article: string;
  targetLength: number; // in tokens
  style: 'concise' | 'detailed' | 'bullet-points';
  tone: 'professional' | 'casual' | 'technical' | 'friendly';
  focusAreas?: string[]; // optional - user might not always provide
};

export const summarizationPrompt = typelit`
You are an expert content summarizer.

${typelit.string('toneInstruction')}

Create a ${typelit.string('request', 'style')} summary of the following article.

Target length: ${typelitTokenCount('request', 'targetLength')}
${typelit.json('request', 'focusAreas')}

Article:
${typelitMarkdown('request', 'article')}
`;

// Helper function to build the full prompt with tone instructions
export const buildSummarizationPrompt = (request: SummarizationRequest) => {
  const toneInstruction = toneComponent(request.tone);
  return summarizationPrompt({ request, toneInstruction });
};

export const sampleSummarizationRequest: SummarizationRequest = {
  article: `# The Future of AI in Software Development

Artificial intelligence is transforming how we write code. From GitHub Copilot to ChatGPT, 
developers are finding new ways to leverage AI assistants.

## Key Benefits
- Faster code generation
- Better code quality through suggestions
- Reduced cognitive load

## Challenges
- Hallucination risks
- Over-reliance on AI
- Security concerns

The future looks promising, but developers must remain vigilant.`,
  targetLength: 200,
  style: 'bullet-points',
  tone: 'technical',
  focusAreas: ['benefits', 'challenges'],
};
