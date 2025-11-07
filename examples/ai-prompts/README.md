# AI Prompt Generation Examples

Examples showing how to use Typelit for type-safe LLM prompt generation.

## Quick Start

```bash
npx tsx examples/ai-prompts/index.ts
```

Set `OPENAI_API_KEY` to see a live example with OpenAI.

## Examples

Each file demonstrates a different prompt scenario:

- `content-summarization.ts` - Article summarization with length/style
  preferences
- `code-review.ts` - Code review prompts that adapt to developer experience
  level
- `data-analysis.ts` - Complex dataset analysis requests with optional fields
- `index.ts` - Live example calling OpenAI API with type-safe prompts

## Basic Usage

Define your prompt template:

```typescript
const codeReviewPrompt = typelit`Review this code:

Language: ${typelit.string('code', 'language')}
Experience Level: ${typelit.string('user', 'experienceLevel')}
Focus Areas: ${typelit.json('review', 'focusAreas')}

Code:
${typelit.string('code', 'snippet')}`;
```

TypeScript enforces the context structure:

```typescript
const prompt = codeReviewPrompt({
  code: {
    language: 'typescript',
    snippet: 'function add(a, b) { return a + b; }',
  },
  user: { experienceLevel: 'junior' },
  review: { focusAreas: ['Type safety', 'Error handling'] },
});
```

Send to your LLM:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }],
});
```

## Custom Formatters

Create formatters specific to LLM use cases:

```typescript
import { createType } from 'typelit';

const typelitTokenCount = createType<number>({
  stringify: (tokens) =>
    tokens < 1000
      ? `${tokens} tokens`
      : `${(tokens / 1000).toFixed(1)}K tokens`,
});

const typelitTemperature = createType<number>({
  stringify: (temp) => {
    if (temp <= 0.3) return `${temp} (focused)`;
    if (temp <= 0.7) return `${temp} (balanced)`;
    return `${temp} (creative)`;
  },
});
```
