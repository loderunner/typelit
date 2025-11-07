import { createType } from '../../src/typelit';

/**
 * Custom formatters for AI prompt generation
 *
 * These utilities demonstrate how Typelit enables domain-specific
 * formatting that makes prompts cleaner and more maintainable.
 */

/**
 * Formats token counts with proper units and context.
 * Example: 1500 -> "1,500 tokens"
 */
export const typelitTokenCount = createType<number>({
  stringify: (count) => {
    return new Intl.NumberFormat('en-US').format(count) + ' tokens';
  },
});

/**
 * Formats markdown code blocks with proper syntax highlighting.
 * Wraps content in triple backticks with optional language identifier.
 */
export const typelitMarkdown = createType<string>({
  stringify: (content) => {
    // Simple markdown code block formatter
    // In real usage, you might want to detect language or accept it as a parameter
    return '```\n' + content + '\n```';
  },
});

/**
 * Formats temperature values for model parameters.
 * Ensures values are between 0 and 2, formatted to 1 decimal place.
 */
export const typelitTemperature = createType<number>({
  stringify: (temp) => {
    const clamped = Math.max(0, Math.min(2, temp));
    return clamped.toFixed(1);
  },
});

/**
 * Reusable prompt components that can be composed into larger prompts
 */

/**
 * System prompt component for output format instructions
 */
export const outputFormatComponent = (format: 'json' | 'markdown' | 'plain') => {
  const formatInstructions = {
    json: 'Respond with valid JSON only, no additional text.',
    markdown: 'Format your response using Markdown.',
    plain: 'Respond in plain text.',
  };
  return formatInstructions[format];
};

/**
 * System prompt component for tone instructions
 */
export const toneComponent = (tone: 'professional' | 'casual' | 'technical' | 'friendly') => {
  const toneInstructions = {
    professional: 'Use a professional, formal tone.',
    casual: 'Use a casual, conversational tone.',
    technical: 'Use technical language appropriate for developers.',
    friendly: 'Use a warm, friendly tone.',
  };
  return toneInstructions[tone];
};
