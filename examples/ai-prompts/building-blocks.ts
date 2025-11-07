import { createType, typelit } from '../../src/typelit';

type Temperature = number;

/**
 * Formats model token limits as human-readable strings.
 *
 * ```ts
 * typelitTokenCount('model', 'maxTokens');
 * ```
 */
export const typelitTokenCount = createType<number>({
  stringify: (value) => {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        `Token limits must be a positive number. Received: ${value}`,
      );
    }
    return `${Math.round(value).toLocaleString()} tokens`;
  },
});

/**
 * Wraps markdown snippets in a fenced code block when needed.
 *
 * ```ts
 * typelitMarkdown('code');
 * ```
 */
export const typelitMarkdown = createType<string>({
  stringify: (value) => {
    const trimmed = value.trim();
    if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
      return trimmed;
    }
    return ['```markdown', trimmed, '```'].join('\n');
  },
});

/**
 * Ensures temperatures are human-friendly and within the supported range.
 *
 * ```ts
 * typelitTemperature('model', 'temperature');
 * ```
 */
export const typelitTemperature = createType<Temperature>({
  stringify: (value) => {
    if (Number.isNaN(value) || value < 0 || value > 2) {
      throw new Error(
        `Temperature must be within the 0-2 range. Received: ${value}`,
      );
    }
    return `${value.toFixed(2)} temperature`;
  },
});

/**
 * Shared tone instruction block that can be composed into prompts.
 */
export const toneInstruction = typelit`
Maintain a ${typelit.string('preferences', 'tone')} tone with ${typelit.string('preferences', 'detailLevel')} detail.
`;

/**
 * Shared output specification block for prompt composition.
 */
export const outputFormatInstruction = typelit`
Match this output contract:
${typelit.json('preferences', 'outputFormat')}
`;

/**
 * Shared model configuration block for system prompts.
 */
export const modelSettingsInstruction = typelit`
Model configuration:
- Temperature: ${typelitTemperature('model', 'temperature')}
- Token budget: ${typelitTokenCount('model', 'maxTokens')}
`;

/**
 * Direct re-export of Typelit's JSON variable creator for discoverability.
 */
export const typelitJSON = typelit.json;
