import { typelit } from '../../src/typelit';
import { typelitTemperature } from './prompt-utils';

/**
 * Prompt Composition Example
 *
 * Demonstrates:
 * - Separating system prompts from user prompts
 * - Composing reusable prompt components
 * - Building multi-turn conversation templates
 * - Model parameter configuration
 */

/**
 * Reusable system prompt components
 */
export const systemPromptBase = typelit`
You are ${typelit.string('role')}.
${typelit.string('instructions')}
`;

export const outputFormatInstructions = typelit`
Respond in ${typelit.string('format')} format.
${typelit.string('formatNote')}
`;

/**
 * User prompt template
 */
export const userPromptTemplate = typelit`
${typelit.string('task')}

Context:
${typelit.string('context')}

${typelit.string('constraintsSection')}
`;

/**
 * Model configuration template
 */
export const modelConfigTemplate = typelit`
Model: ${typelit.string('model')}
Temperature: ${typelitTemperature('temperature')}
Max Tokens: ${typelit.string('maxTokens')}
`;

/**
 * Composed prompt builder
 */
type PromptComposition = {
  system: {
    role: string;
    instructions: string;
  };
  user: {
    task: string;
    context: string;
    constraints?: string;
  };
  model: {
    model: string;
    temperature: number;
    maxTokens: string;
  };
};

export const buildComposedPrompt = (composition: PromptComposition) => {
  const systemPrompt = systemPromptBase({
    role: composition.system.role,
    instructions: composition.system.instructions,
  });

  const formatNote = composition.user.constraints && composition.user.constraints.includes('json')
    ? 'Ensure your response is valid JSON.'
    : '';
  
  const formatInstructions = outputFormatInstructions({
    format: 'json', // or derive from composition
    formatNote,
  });

  const constraintsSection = composition.user.constraints
    ? `Constraints: ${composition.user.constraints}`
    : '';

  const userPrompt = userPromptTemplate({
    task: composition.user.task,
    context: composition.user.context,
    constraintsSection,
  });

  const modelConfig = modelConfigTemplate({
    model: composition.model.model,
    temperature: composition.model.temperature,
    maxTokens: composition.model.maxTokens,
  });

  return {
    system: systemPrompt + '\n\n' + formatInstructions,
    user: userPrompt,
    config: modelConfig,
  };
};

export const sampleComposition: PromptComposition = {
  system: {
    role: 'an expert API documentation writer',
    instructions: 'Write clear, concise API documentation with code examples.',
  },
  user: {
    task: 'Document the user authentication endpoint',
    context: `Endpoint: POST /api/v1/auth/login
Accepts: { email: string, password: string }
Returns: { token: string, expiresAt: number, user: User }
Error codes: 400 (invalid input), 401 (invalid credentials), 500 (server error)`,
    constraints: 'Include TypeScript examples and error handling',
  },
  model: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: '2000',
  },
};
