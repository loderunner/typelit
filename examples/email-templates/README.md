# Email Template Examples

Simple examples demonstrating Typelit's type-safe email templating.

## Quick Start

```typescript
import { welcomeEmail } from './templates';

const email = welcomeEmail({
  user: {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
  },
  dashboardUrl: 'https://example.com/dashboard',
});
```

## What's Included

- **Welcome Email** - Basic nested paths (`user.firstName`)
- **Order Confirmation** - Complex nested data, currency formatting, dates
- **Password Reset** - Date formatting

## Custom Types

The examples include custom formatters:

- `typelitCurrency` - Formats numbers (in cents) as currency: `1999` → `"$19.99"`
- `typelitDate` - Formats dates: `new Date()` → `"January 15, 2024 at 2:30 PM"`

## Type Safety

TypeScript catches errors at compile time:

```typescript
// ❌ Missing required field
welcomeEmail({ user: { firstName: 'Bob' } });

// ❌ Wrong type
welcomeEmail({ user: { firstName: 123, lastName: 'Smith', email: 'bob@example.com' } });
```

## Running

```bash
npx tsx examples/email-templates/index.ts
```
