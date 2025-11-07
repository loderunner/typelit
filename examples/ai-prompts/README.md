# AI Prompt Generation with Typelit

**The Problem:** Building AI features with LLMs means constantly generating prompts with user data, context, and preferences. String concatenation is fragile, error-prone, and breaks when you refactor. One missing field or typo in a variable name, and your AI integration fails at runtime.

**The Solution:** Type-safe prompt templates that catch errors at compile time, enable confident refactoring, and make your AI integrations bulletproof.

## Why This Matters

Every AI-powered application needs to:
- Inject user data into prompts safely
- Maintain consistent prompt structures
- Handle optional context gracefully  
- Refactor prompts without breaking production
- Test prompt generation with mock data
- Ensure team members can't create broken prompts

Typelit solves all of these problems with TypeScript's type system.

## Quick Start

```bash
npx tsx examples/ai-prompts/index.ts
```

## The Killer Use Cases

### 1. Content Summarization 📄
Generate article summaries with configurable length, style, and audience targeting.

**Type-Safe Context:**
```typescript
type Article = {
  title: string;
  content: string;
  author: string;
  publicationDate: Date;
};

type SummaryPreferences = {
  length: 'brief' | 'detailed' | 'comprehensive';
  style: 'bullet-points' | 'paragraph' | 'executive';
  audience?: 'general' | 'technical' | 'business';
};
```

**The Template:**
```typescript
const summarizationPrompt = typelit`You are a professional content summarizer.

Title: ${typelit.string('article', 'title')}
Author: ${typelit.string('article', 'author')}

Content:
${typelit.string('article', 'content')}

Requirements:
- Length: ${typelit.string('preferences', 'length')}
- Style: ${typelit.string('preferences', 'style')}
- Audience: ${typelit.string('preferences', 'audience')}

${typelit.string('additionalInstructions')}`;
```

**Type Safety in Action:**
TypeScript ensures you provide all required fields:
```typescript
// ✅ Correct - TypeScript is happy
const prompt = summarizationPrompt({
  article: myArticle,
  preferences: myPreferences,
  additionalInstructions: "Focus on technical details"
});

// ❌ Compile error - missing preferences
const prompt = summarizationPrompt({
  article: myArticle,
  additionalInstructions: "Focus on technical details"
});
```

### 2. Code Review Assistant 👨‍💻
Adjust review depth based on developer experience level with type-safe configuration.

**Rich Nested Context:**
```typescript
type User = {
  experienceLevel: 'junior' | 'mid' | 'senior' | 'principal';
  preferences: {
    verbosity: 'concise' | 'detailed';
    includeExamples: boolean;
  };
};

type ReviewCriteria = {
  focusAreas: string[];
  checkForIssues: string[];
  styleGuide?: string;
};
```

**Different Configs, Same Template:**
```typescript
// Junior developer - detailed explanations
const juniorReview = codeReviewPrompt({
  code: { language: 'typescript', snippet: codeToReview },
  user: { 
    experienceLevel: 'junior',
    preferences: { verbosity: 'detailed', includeExamples: true }
  },
  review: { focusAreas: ['Type safety', 'Best practices'] }
});

// Senior developer - concise, focused on architecture  
const seniorReview = codeReviewPrompt({
  code: { language: 'typescript', snippet: codeToReview },
  user: {
    experienceLevel: 'senior', 
    preferences: { verbosity: 'concise', includeExamples: false }
  },
  review: { focusAreas: ['Performance', 'API design'] }
});
```

**The Magic:** Same template, different contexts, zero runtime errors.

### 3. Data Analysis 📊
Structure complex analysis requests with dataset descriptions, goals, and output preferences.

**Handles Optional Fields Gracefully:**
```typescript
type Dataset = {
  name: string;
  size: { rows: number; columns: number };
  timeRange?: { start: Date; end: Date };
};

type AnalysisGoals = {
  primaryQuestion: string;
  secondaryQuestions: string[];
  hypotheses?: string[];  // Optional
};
```

**Helper Functions for Optional Content:**
```typescript
const formatTimeRange = (timeRange?: { start: Date; end: Date }) =>
  timeRange 
    ? `Time Range: ${timeRange.start} to ${timeRange.end}`
    : '';

const prompt = dataAnalysisPrompt({
  dataset: myData,
  goals: myGoals,
  timeRangeInfo: formatTimeRange(myData.timeRange),  // Handles undefined
  hypothesesInfo: formatHypotheses(myGoals.hypotheses)
});
```

### 4. Customer Support 🎧
Consistent brand voice with priority handling and product context.

**Multi-Level Context:**
```typescript
type CustomerTicket = {
  id: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerHistory: {
    accountAge: string;
    previousTickets: number;
    lifetimeValue: number;
  };
};

type CompanyGuidelines = {
  tone: 'professional' | 'friendly' | 'empathetic';
  brandVoice: string[];
  doNotSay: string[];
  alwaysInclude: string[];
};
```

**Enforces Consistency:**
Every support response includes required elements. TypeScript won't let you forget the company guidelines or customer context.

## Before & After: String Concatenation Hell

### ❌ The Old Way (Fragile, Error-Prone)

```typescript
function generateCodeReview(code: any, user: any, review: any) {
  let prompt = "You are a code reviewer.\n\n";
  prompt += "Code Language: " + code.lang + "\n";  // Typo: should be 'language'
  prompt += code.snippet + "\n\n";
  
  prompt += "Experience: " + user.level + "\n";  // Typo: should be 'experienceLevel'
  
  // Forgot to include focusAreas - runtime error or wrong results
  // No way to know until it breaks in production
  
  if (review.styleGuide) {  // Might be undefined, might crash
    prompt += "Style Guide: " + review.styleGuide;
  }
  
  return prompt;
}

// This compiles fine but breaks at runtime:
generateCodeReview(
  { language: 'typescript', snippet: '...' },  // 'language' not 'lang'
  { experienceLevel: 'senior' },  // 'experienceLevel' not 'level'  
  { focusAreas: [...] }  // focusAreas never used!
);
```

**Problems:**
- ❌ Typos in property names cause runtime errors
- ❌ Easy to forget required fields
- ❌ No autocomplete for data structure
- ❌ Refactoring breaks things silently  
- ❌ New team members guess at data shape
- ❌ Testing requires running actual code

### ✅ The Typelit Way (Type-Safe, Bulletproof)

```typescript
const codeReviewPrompt = typelit`You are a code reviewer.

Code Language: ${typelit.string('code', 'language')}
${typelit.string('code', 'snippet')}

Experience: ${typelit.string('user', 'experienceLevel')}

Focus Areas: ${typelit.json('review', 'focusAreas')}

${typelit.string('styleGuideNote')}`;

// TypeScript enforces correct structure at compile time:
const prompt = codeReviewPrompt({
  code: { language: 'typescript', snippet: '...' },
  user: { experienceLevel: 'senior' },
  review: { focusAreas: [...] },
  styleGuideNote: formatStyleGuide(...)
});
```

**Benefits:**
- ✅ TypeScript catches typos at compile time
- ✅ Autocomplete shows required fields
- ✅ Refactoring updates all templates automatically
- ✅ Impossible to forget required data
- ✅ Self-documenting data structures  
- ✅ Test with mock data trivially

## Custom Formatters for AI

Typelit includes built-in formatters (`typelit.json`, `typelit.date`, etc.), but you can create AI-specific ones:

```typescript
import { createType } from 'typelit';

// Format token counts with appropriate scale
export const typelitTokenCount = createType<number>({
  stringify: (tokens) => {
    if (tokens < 1000) return `${tokens} tokens`;
    if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K tokens`;
    return `${(tokens / 1000000).toFixed(2)}M tokens`;
  }
});

// Format temperature with description
export const typelitTemperature = createType<number>({
  stringify: (temp) => {
    if (temp <= 0.3) return `${temp} (very focused)`;
    if (temp <= 0.7) return `${temp} (balanced)`;
    if (temp <= 1.2) return `${temp} (creative)`;
    return `${temp} (highly creative)`;
  }
});

// Usage
const systemPrompt = typelit`
Model Configuration:
- Max Tokens: ${typelitTokenCount('config', 'maxTokens')}
- Temperature: ${typelitTemperature('config', 'temperature')}
`;
```

## Integrating with LLM SDKs

### OpenAI

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate the prompt with Typelit
const userPrompt = codeReviewPrompt({
  code: userCode,
  user: currentUser,
  review: reviewCriteria,
  styleGuideNote: formatStyleGuide(...)
});

// Send to OpenAI
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are an expert code reviewer.' },
    { role: 'user', content: userPrompt }
  ],
  temperature: 0.7
});

console.log(completion.choices[0].message.content);
```

### Anthropic Claude

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Generate the prompt with Typelit
const analysisPrompt = dataAnalysisPrompt({
  dataset: userData,
  goals: analysisGoals,
  preferences: userPreferences,
  // ... helper fields
});

// Send to Claude
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  messages: [
    { role: 'user', content: analysisPrompt }
  ]
});

console.log(message.content);
```

## Prompt Composition: Building Reusable Components

Create reusable prompt fragments and compose them:

```typescript
// Reusable system prompt component
const systemInstructions = typelit`You are a ${typelit.string('role')} assistant.
Tone: ${typelit.string('tone')}
Output format: ${typelit.string('format')}`;

// Reusable output format specification
const jsonOutputSpec = typelit`
Respond in valid JSON with this structure:
${typelit.json('schema')}`;

// Compose them in your final prompt
const fullPrompt = (context: PromptContext) => {
  const system = systemInstructions({
    role: context.role,
    tone: context.tone,
    format: 'JSON'
  });
  
  const output = jsonOutputSpec({
    schema: context.outputSchema
  });
  
  return `${system}\n\n${context.userQuery}\n\n${output}`;
};
```

## Testing Your Prompts

Type safety makes testing trivial:

```typescript
import { describe, it, expect } from 'vitest';

describe('Code Review Prompt', () => {
  it('generates correct prompt for junior developer', () => {
    const prompt = codeReviewPrompt({
      code: {
        language: 'typescript',
        snippet: 'const x = 1;',
        filePath: 'test.ts'
      },
      user: {
        experienceLevel: 'junior',
        preferences: { verbosity: 'detailed', includeExamples: true }
      },
      review: {
        focusAreas: ['Type safety'],
        checkForIssues: ['Missing types']
      },
      styleGuideNote: ''
    });

    expect(prompt).toContain('Experience level: junior');
    expect(prompt).toContain('Preferred verbosity: detailed');
    expect(prompt).toContain('Include examples: true');
  });

  it('generates correct prompt for senior developer', () => {
    const prompt = codeReviewPrompt({
      code: {
        language: 'typescript',
        snippet: 'const x = 1;',
        filePath: 'test.ts'
      },
      user: {
        experienceLevel: 'senior',
        preferences: { verbosity: 'concise', includeExamples: false }
      },
      review: {
        focusAreas: ['Performance'],
        checkForIssues: ['Optimization']
      },
      styleGuideNote: ''
    });

    expect(prompt).toContain('Experience level: senior');
    expect(prompt).toContain('Preferred verbosity: concise');
  });
});
```

Mock data is type-checked too. If your data structure changes, your tests will fail at compile time.

## Prompt Chaining

Output from one prompt becomes input to another:

```typescript
// Step 1: Analyze code
const analysisPrompt = codeAnalysisTemplate({
  code: userCode,
  language: 'typescript'
});
const analysis = await llm.generate(analysisPrompt);

// Step 2: Use analysis to generate fixes
const fixPrompt = codeFixTemplate({
  code: userCode,
  issues: JSON.parse(analysis),  // Structured output
  priorities: ['security', 'performance']
});
const fixes = await llm.generate(fixPrompt);

// Type safety throughout the chain!
```

## Real-World Edge Cases Handled

### Missing Optional Context
```typescript
// Some users provide examples, others don't
type PromptContext = {
  task: string;
  examples?: Example[];
};

const formatExamples = (examples?: Example[]) =>
  examples && examples.length > 0
    ? `\nExamples:\n${JSON.stringify(examples, null, 2)}`
    : '';

const prompt = taskPrompt({
  task: userTask,
  examplesSection: formatExamples(userContext.examples)
});
```

### Different Prompt Styles
```typescript
// Same template, different configurations
type PromptStyle = 'concise' | 'detailed' | 'conversational';

const styleInstructions = {
  concise: 'Be brief and direct.',
  detailed: 'Provide comprehensive explanations.',
  conversational: 'Use a friendly, approachable tone.'
};

const prompt = myTemplate({
  ...context,
  styleNote: styleInstructions[user.preferredStyle]
});
```

### Preventing Critical Missing Context
```typescript
// TypeScript enforces required fields
type CriticalContext = {
  userId: string;           // Must provide
  apiKey: string;           // Must provide
  permissions: string[];    // Must provide
  metadata?: Record<string, any>;  // Optional
};

// Won't compile without userId, apiKey, permissions
const prompt = securePrompt({
  userId: currentUser.id,
  apiKey: process.env.API_KEY,
  permissions: currentUser.permissions
});
```

## Key Selling Points

### 🎯 Consistency
Same prompt structure every time. No "oops, forgot to include the user's timezone" bugs.

### 🔒 Type Safety
Catch errors at compile time, not when your users are trying to use your AI feature.

### ♻️ Refactor Fearlessly
Change your data structure once, TypeScript updates everywhere. No silent breakage.

### 👥 Team Collaboration  
New developers can't mess up prompts. Types guide them to provide correct data.

### 📝 Self-Documenting
The template shows exactly what data it needs. No guessing, no outdated comments.

### 🧪 Testable
Mock data is type-checked. Write tests with confidence.

### 🚀 Ship Faster
Spend less time debugging prompt bugs, more time building features.

## Structure

Each example is self-contained:

- `content-summarization.ts` - Article summarization with preferences
- `code-review.ts` - Code review with experience-based configuration  
- `data-analysis.ts` - Complex dataset analysis with goals
- `customer-support.ts` - Support responses with company guidelines
- `index.ts` - Runs all examples with custom formatters

## Try It Now

```bash
# Run all examples
npx tsx examples/ai-prompts/index.ts

# Examine individual templates
cat examples/ai-prompts/code-review.ts
```

## The Bottom Line

If you're building AI features, you need type-safe prompts. One typo, one missing field, one refactoring mistake, and your AI integration breaks for users.

Typelit eliminates that entire class of bugs. Your prompts become as reliable as your code.

**Build AI features with confidence. Use Typelit.**
