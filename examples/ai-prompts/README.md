# AI Prompt Generation Examples

Type-safe AI prompt templates that prevent runtime errors and make refactoring safe.

## The Problem

Building LLM features with string concatenation:
- Typos in property names break at runtime
- Easy to forget required context fields
- Refactoring silently breaks prompts in production
- No autocomplete or type checking

## Quick Start

```bash
npx tsx examples/ai-prompts/index.ts
```

## What Each Example Shows

**Content Summarization** - Article summaries with configurable length, style, and audience

**Code Review (Junior & Senior)** - Same template adapts to developer experience level with different verbosity and focus areas

**Data Analysis** - Complex dataset analysis with optional fields handled gracefully

**Customer Support** - Consistent brand voice with company guidelines enforced by types

## Before & After

### ❌ String Concatenation Hell

```typescript
function generatePrompt(code: any, user: any) {
  let prompt = "Review this code.\n";
  prompt += "Language: " + code.lang + "\n";  // Typo: should be 'language'
  prompt += "Experience: " + user.level;       // Typo: should be 'experienceLevel'
  // Forgot to include focusAreas - breaks in production!
  return prompt;
}
```

### ✅ Type-Safe with Typelit

```typescript
const codeReviewPrompt = typelit`Review this code.
Language: ${typelit.string('code', 'language')}
Experience: ${typelit.string('user', 'experienceLevel')}
Focus Areas: ${typelit.json('review', 'focusAreas')}`;

// TypeScript enforces correct structure:
const prompt = codeReviewPrompt({
  code: { language: 'typescript', snippet: '...' },
  user: { experienceLevel: 'senior' },
  review: { focusAreas: ['Performance', 'Security'] }
});
```

TypeScript catches typos, missing fields, and wrong types at compile time.

## Custom Formatters

Create AI-specific formatters for better prompt generation:

```typescript
import { createType } from 'typelit';

// Token counts with scale
const typelitTokenCount = createType<number>({
  stringify: (tokens) => 
    tokens < 1000 ? `${tokens} tokens` : `${(tokens/1000).toFixed(1)}K tokens`
});

// Temperature with description
const typelitTemperature = createType<number>({
  stringify: (temp) => {
    if (temp <= 0.3) return `${temp} (focused)`;
    if (temp <= 0.7) return `${temp} (balanced)`;
    return `${temp} (creative)`;
  }
});
```

## Integration with LLM SDKs

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();
const userPrompt = codeReviewPrompt({ code, user, review });

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: userPrompt }]
});
```

## Key Benefits

- **🎯 Consistency** - Same prompt structure every time
- **🔒 Type Safety** - Errors caught at compile time
- **♻️ Refactor Fearlessly** - TypeScript updates all usages
- **👥 Team-Friendly** - Types guide new developers
- **🧪 Testable** - Mock data is type-checked

## Structure

- `content-summarization.ts` - Article summarization with preferences
- `code-review.ts` - Code review with experience-based configuration  
- `data-analysis.ts` - Dataset analysis with optional fields
- `customer-support.ts` - Support responses with company guidelines
- `index.ts` - Runs all examples with custom formatters

## Try It

```bash
# Run all examples
npx tsx examples/ai-prompts/index.ts

# View a specific template
cat examples/ai-prompts/code-review.ts
```
