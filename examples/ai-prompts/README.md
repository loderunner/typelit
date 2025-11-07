# AI Prompt Generation Examples

Examples showing how to use Typelit for type-safe LLM prompt generation.

## Quick Start

Requires `OPENAI_API_KEY` environment variable:

```bash
export OPENAI_API_KEY=your-api-key
npx tsx examples/ai-prompts/index.ts
```

## Examples

Each file demonstrates a different prompt scenario:

- `content-summarization.ts` - Article summarization with length/style
  preferences
- `code-review.ts` - Code review with separate system and user prompts
- `index.ts` - Live example calling OpenAI API with type-safe prompts
