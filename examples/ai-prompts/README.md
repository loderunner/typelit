# AI Prompt Examples

Type-safe prompt generation for real-world LLM workflows: summaries, reviews,
creative writing, analytics, and customer support. Each example shows how
Typelit keeps prompts flexible without letting missing context slip through.

## Quick Start

Run every scenario:

```bash
npx tsx examples/ai-prompts/index.ts
```

Focus on a single scenario:

```bash
npx tsx examples/ai-prompts/index.ts creative-writing
```

## Structure

| File                       | What it demonstrates                                                     |
| -------------------------- | ------------------------------------------------------------------------ |
| `content-summarization.ts` | Article→summary prompts with optional examples and strict token budgets  |
| `code-review.ts`           | Nested context (code, user, review focus), experience-aware guidance     |
| `creative-writing.ts`      | Deeply nested world-building with reusable prompt components             |
| `data-analysis.ts`         | Prompt chaining, structured output contracts, JSON formatting helpers    |
| `customer-support.ts`      | Multi-turn conversation (system/developer/user) with optional KB context |
| `building-blocks.ts`       | Shared tone/output/model instructions + custom Typelit variable creators |
| `index.ts`                 | Simple CLI to print prompts and compare variants                         |

## Killer Highlights

- **Consistency** – Templates reference every required field. Forget to pass a
  tone, token limit, or nested path? TypeScript blocks the build.
- **Refactoring immunity** – Change `analysis.outputFormatContract` and you see
  every broken prompt at compile time.
- **Team guardrails** – New engineers can’t accidentally ship a prompt without
  the customer sentiment or code snippet.
- **Version control** – Prompt changes are normal TypeScript diffs; review them
  like code.
- **Testing** – Templates are just functions. Feed mock data in unit tests or
  snapshot the output.

## Shared Building Blocks

- `typelitTokenCount` – Formats token limits as `900 tokens`.
- `typelitTemperature` – Validates and formats model temperatures.
- `typelitMarkdown` – Guarantees fenced code blocks (no more broken snippets).
- `typelitJSON` – Alias for Typelit's JSON helper, showcased for output
  contracts.
- `toneInstruction`, `outputFormatInstruction`, `modelSettingsInstruction` –
  Composable directives reused across every prompt.

## Prompt Composition in Action

- **System vs. User prompts** – Every scenario builds them separately, so you
  can mix and match for OpenAI/Anthropic chat APIs.
- **Reusable components** – Tone/output/model instructions live in one place and
  automatically require shared context (`preferences`, `model`).
- **Multi-turn conversations** – Customer support returns a full
  system/developer/user array typed end-to-end.
- **Prompt chaining** – Data analysis accepts previous summaries and tickets,
  feeding downstream analysis safely.

## Before / After

```typescript
// String concatenation hell 🙃
const raw =
  'Summarize "' + title + '" by ' + author + ' in a ' + tone + ' tone.'; // forget detail level, combust later.

// Typelit
const template = typelit`
Summarize "${typelit.string('article', 'title')}" by ${typelit.string('article', 'author')}
with a ${typelit.string('preferences', 'tone')} tone and ${typelit.string('preferences', 'detailLevel')} detail.
`;
template({
  article: { title, author },
  preferences: { tone, detailLevel },
}); // Miss anything? TypeScript screams.
```

## SDK Integration Example

```typescript
import OpenAI from 'openai';
import { buildSummarizationPrompt } from './content-summarization';

const client = new OpenAI();
const prompt = buildSummarizationPrompt(sampleSummarizationInput);

await client.chat.completions.create({
  model: 'gpt-4.1',
  messages: [
    { role: 'system', content: prompt.system },
    { role: 'user', content: prompt.user },
  ],
  temperature: sampleSummarizationInput.model.temperature,
  max_tokens: sampleSummarizationInput.model.maxTokens,
});
```

Anthropic works the same way—feed the `system` and `user` strings straight into
`client.messages.create`.

## Testing Ideas

- Snapshot the generated prompt functions.
- Provide partial context in tests and assert TypeScript errors.
- Mock optional sections (`referenceExamples`, `knowledgeBase`) to ensure
  fallbacks render correctly.

## Bonus: Simple CLI

The `index.ts` CLI lets you eyeball prompts locally and compare variants (e.g.
junior vs. intermediate code review instructions). Extend it to accept JSON
payloads from disk and you have a lightweight prompt playground.
