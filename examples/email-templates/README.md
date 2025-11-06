# Typelit Email Template Examples

This example bundle shows how to build production-friendly, type-safe email templates with [Typelit](../../README.md). It covers common lifecycle messages (welcome, order confirmation, password reset, monthly report, and appointment reminder) while demonstrating nested variables, reusable components, custom formatters, and compile-time guarantees.

## Highlights

- Shared header/footer composition so each template reuses your brand copy once.
- Custom `typelitCurrency`, `typelitDate`, `typelitInteger`, and `typelitOptionalString` factories for smarter formatting.
- Optional field handling (dial-in links) without throwing away type safety.
- End-to-end contexts powered by `Context<typeof vars>` so TypeScript enforces every field.
- Bonus Vitest suite proving inferred context types and runtime behaviour.

## Files

- `templates.ts` – variable factories, shared components, and the five email renderers.
- `types.ts` – derived context types plus richer helper types (e.g. `OrderItem`).
- `index.ts` – sample contexts, rendered output demo, and inline type-safety snippets.
- `index.test.ts` – vitest checks for type inference and rendering.

## Running the demo

Install dependencies (once):

```bash
npm install
```

Render all emails to the console:

```bash
npx ts-node examples/email-templates/index.ts
```

Run the focused Vitest suite to watch the type inference in action:

```bash
npm test -- --run examples/email-templates/index.test.ts
```

> Tip: swap `npx ts-node` with your preferred runner (`tsx`, `bunx`, etc.) if you already have one in your toolbelt.

## Type-safety snapshots

The demo contexts use `satisfies` to keep type inference intact while guaranteeing the minimum data:

```startLine:endLine:examples/email-templates/index.ts
const welcomeContext = {
  brand: baseBrand,
  user: {
    profile: { firstName: 'Jules', lastName: 'Mercer' },
    plan: {
      name: 'Growth',
      trialEndsAt: new Date('2024-12-31T17:00:00-08:00'),
    },
    meta: { signupDate: new Date('2024-12-01T09:34:00-08:00') },
    onboarding: { stepsRemaining: 3 },
  },
} satisfies WelcomeEmailContext;
```

Intentional `@ts-expect-error` examples document what TypeScript rejects and why:

```startLine:endLine:examples/email-templates/index.ts
// @ts-expect-error - Missing trial end date and onboarding steps, so TypeScript flags the shape.
const invalidWelcomeContext: WelcomeEmailContext = {
  brand: baseBrand,
  user: {
    profile: { firstName: 'Jules', lastName: 'Mercer' },
    plan: { name: 'Growth' },
    meta: { signupDate: new Date('2024-12-01T09:34:00-08:00') },
    onboarding: { stepsRemaining: 3 },
  },
};
```

## Example output

Running `renderAllEmails()` prints clean HTML that you can drop into your ESP:

```text
--- welcome ---
<div class="preheader">Jules, updates from Acme Analytics</div>
<header class="email-header">
  <h1>Acme Analytics</h1>
  <p>Insights that actually move the needle</p>
</header>
<main>
  <p>Hi Jules Mercer,</p>
  <p>Welcome to Acme Analytics! You signed up on Dec 1, 2024, 9:34 AM.</p>
  <p>Your current plan is <strong>Growth</strong>. The trial ends on Dec 31, 2024, 5:00 PM.</p>
  <p>You still have 3 onboarding tasks left. Knock them out to unlock everything.</p>
</main>
<footer class="email-footer">
  <p>Need help? Email <a href="mailto:support@acme.com">support@acme.com</a> or call +1-555-0101.</p>
  <p><a href="https://acme.com/unsubscribe">Unsubscribe</a> • 100 Market Street, San Francisco, CA 94105</p>
</footer>
```

Want to tweak or extend these? Duplicate the `exampleContexts` entries, adjust the nested data, and the compiler will do the rest.
