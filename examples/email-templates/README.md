# Email Template Examples

Simple examples demonstrating Typelit's type-safe email templating.

## Structure

Each example is self-contained in its own file:

- `welcome.ts` - Welcome email (nested paths)
- `order-confirmation.ts` - Order confirmation (currency, dates, complex nesting)
- `password-reset.ts` - Password reset (date formatting)
- `index.ts` - Runs all examples

## Quick Start

```bash
npx tsx examples/email-templates/index.ts
```

## What Each Example Shows

**Welcome Email** - Basic nested paths (`user.firstName`)

**Order Confirmation** - Custom currency formatter, date formatter, deeply nested data

**Password Reset** - Custom date formatter

## Type Safety

TypeScript catches errors at compile time. Try uncommenting the error examples in each file to see what TypeScript catches.
