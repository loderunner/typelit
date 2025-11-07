# AI Prompt Generation Examples

Type-safe, customizable AI prompt generation using Typelit. This example demonstrates how Typelit eliminates the classic "oops, forgot to pass the user's preferred tone" bugs that break AI interactions.

## The Problem

Building AI prompts with string concatenation is error-prone:

- Easy to miss variables
- No type safety - runtime errors if context is wrong
- Hard to refactor - change a property name? Good luck finding all usages
- Hard to see what variables are needed
- Optional fields? Hope you remember to check for them

## The Solution

Typelit provides compile-time type safety for prompt templates. TypeScript catches errors before your code runs, and refactoring is safe - the compiler tells you exactly what breaks.

## Structure

Each example is self-contained in its own file:

- `prompt-utils.ts` - Custom formatters (tokenCount, markdown, temperature) and reusable components
- `content-summarization.ts` - Article summarization with length/style/tone customization
- `code-review.ts` - Code review prompts with experience-level-based guidance
- `creative-writing.ts` - Rich creative writing prompts with nested character/world/plot details
- `data-analysis.ts` - Data analysis prompts with dataset descriptions and output format specs
- `customer-support.ts` - Customer support response generation with ticket details and company tone
- `prompt-composition.ts` - Shows how to compose system/user prompts and reusable components
- `before-after.ts` - Side-by-side comparison of string concatenation vs Typelit
- `index.ts` - Runs all examples

## Quick Start

```bash
npx tsx examples/ai-prompts/index.ts
```

## What Each Example Shows

### Content Summarization (`content-summarization.ts`)

- Token count formatting for length constraints
- Markdown formatting for article content
- Tone customization (professional/casual/technical/friendly)
- Optional context fields (focusAreas)

**Key Feature:** Type safety ensures you can't forget to pass the article or target length.

### Code Review (`code-review.ts`)

- Deeply nested context (`code.language`, `user.experienceLevel`, `review.focusAreas`)
- Experience-level-based prompt customization (beginner/intermediate/advanced get different guidance)
- Multiple code snippets with proper formatting
- Structured review criteria

**Key Feature:** Change the `CodeReviewRequest` type? TypeScript tells you everywhere that breaks. Try adding a new required field and watch the compiler guide you.

### Creative Writing (`creative-writing.ts`)

- **Rich nested character details** - `character.appearance.physical.age`, `character.background.motivations`
- Complex world-building context with optional magic systems
- Plot element composition
- Genre-specific instructions
- POV, tone, and pacing customization

**Key Feature:** This example really flexes Typelit's nested path capabilities. Character details go 3-4 levels deep, and TypeScript ensures you can't miss any required fields.

### Data Analysis (`data-analysis.ts`)

- Dataset description formatting
- Analysis goals and questions specification
- Output format requirements (JSON/markdown/plain)
- Optional context (domain, previous findings)

**Key Feature:** Shows how to handle optional fields gracefully - TypeScript ensures you handle the `undefined` case.

### Customer Support (`customer-support.ts`)

- Ticket details with nested information
- Company tone and brand voice
- Product context integration
- Escalation handling
- Customer history (optional)

**Key Feature:** Demonstrates building prompts from multiple data sources (ticket, company, product) with type safety ensuring all pieces fit together.

### Prompt Composition (`prompt-composition.ts`)

- Separating system prompts from user prompts
- Reusable prompt components
- Multi-turn conversation templates
- Model parameter configuration

**Key Feature:** Shows how to build complex prompts by composing smaller, reusable templates. Each component is type-safe.

### Before/After Comparison (`before-after.ts`)

Side-by-side comparison showing:

**❌ Before:** String concatenation hell
- Easy to miss variables
- No type safety
- Hard to refactor
- Runtime errors

**✅ After:** Typelit type-safe approach
- TypeScript catches missing variables at compile time
- Refactoring is safe - TypeScript tells you what breaks
- Clear what variables are needed from the template
- Impossible to miss a variable - types enforce it

## Key Selling Points

### Consistency

Same prompt structure every time, no missed variables. The template defines exactly what's needed, and TypeScript enforces it.

### Refactoring Safety

Change your context structure? TypeScript tells you everywhere that breaks. No more "hope I found all the places" - the compiler does it for you.

### Team Collaboration

New devs can't mess up prompts - types guide them. The template signature shows exactly what data is needed.

### Version Control

Track prompt changes with confidence. Type changes are explicit and reviewable.

### Testing

Easy to test prompt generation with mock data. Type-safe mocks ensure your test data matches production.

## Custom Types

The examples demonstrate custom formatters:

- `typelitTokenCount` - Formats token limits nicely ("1,500 tokens")
- `typelitMarkdown` - Proper markdown formatting for code blocks
- `typelitTemperature` - Formats model parameters (clamps 0-2, 1 decimal place)

See `prompt-utils.ts` for implementations.

## Real-World Edge Cases

The examples handle:

- **Optional context fields** - User might not always provide examples (see `focusAreas?` in summarization)
- **Different prompt styles** - Concise vs. detailed, technical vs. conversational
- **Type safety prevents missing context** - Try commenting out a required field and watch TypeScript catch it

## Integration with AI SDKs

Here's how you'd use these prompts with OpenAI or Anthropic:

```typescript
import { buildCodeReviewPrompt, sampleCodeReviewRequest } from './code-review';
import OpenAI from 'openai';

const openai = new OpenAI();

const prompt = buildCodeReviewPrompt(sampleCodeReviewRequest);

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are an expert code reviewer.' },
    { role: 'user', content: prompt },
  ],
});
```

The type safety ensures your prompt context matches what the template expects, preventing runtime errors.

## Prompt Chaining

You can chain prompts where output from one becomes input to another:

```typescript
// First prompt: Generate analysis
const analysisPrompt = buildDataAnalysisPrompt(dataRequest);
const analysis = await callAI(analysisPrompt);

// Second prompt: Summarize the analysis
const summaryPrompt = buildSummarizationPrompt({
  article: analysis,
  targetLength: 500,
  style: 'concise',
  tone: 'professional',
});
```

Type safety ensures the chained data structures match.

## Type Safety in Action

Try these to see TypeScript catch errors:

1. **Missing required field:**
   ```typescript
   // This won't compile - missing 'article'
   buildSummarizationPrompt({
     targetLength: 200,
     style: 'concise',
     tone: 'professional',
   });
   ```

2. **Wrong type:**
   ```typescript
   // This won't compile - targetLength should be number
   buildSummarizationPrompt({
     article: '...',
     targetLength: '200', // ❌ string, not number
     style: 'concise',
     tone: 'professional',
   });
   ```

3. **Typo in property name:**
   ```typescript
   // This won't compile - 'tone' not 'tonee'
   buildSummarizationPrompt({
     article: '...',
     targetLength: 200,
     style: 'concise',
     tonee: 'professional', // ❌ typo
   });
   ```

## Why This Matters

Anyone building AI features has dealt with prompt bugs:
- "Why is the AI response missing the user's preferred tone?"
- "Oops, I forgot to include the code snippet"
- "The prompt works in dev but fails in prod because I'm missing a field"

Typelit eliminates that whole class of errors. The compiler catches them before your code runs.

## Next Steps

1. Run the examples: `npx tsx examples/ai-prompts/index.ts`
2. Modify a template and see TypeScript catch errors
3. Add a new required field to a type and watch the compiler guide you
4. Integrate with your AI SDK of choice

The type safety isn't just nice-to-have - it's essential for building reliable AI features at scale.
