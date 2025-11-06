# Email Template Examples for Typelit

This directory contains comprehensive examples demonstrating Typelit's type-safe email templating capabilities. These examples showcase real-world email scenarios with nested data structures and highlight the type safety benefits.

## Overview

Typelit provides compile-time type safety for string templates, ensuring that:
- All required fields are present in your context objects
- Field types match what the template expects
- Nested paths are correctly typed
- You get autocomplete and IntelliSense support

## Structure

```
/examples/email-templates/
├── index.ts        # Main demo file with examples and type safety demonstrations
├── templates.ts    # Email template definitions and custom type creators
├── types.ts        # TypeScript type definitions for context objects
└── README.md       # This file
```

## Email Templates Included

### 1. Welcome Email (`welcomeEmail`)
**Purpose:** New user onboarding  
**Features demonstrated:**
- Nested paths (`user.firstName`, `user.lastName`)
- Multiple string variables
- Simple template structure

**Example usage:**
```typescript
const context = {
  user: {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
  },
  companyName: 'Acme Corp',
  dashboardUrl: 'https://example.com/dashboard',
  recipientEmail: 'alice@example.com',
  unsubscribeUrl: 'https://example.com/unsubscribe',
};

const html = welcomeEmail(context);
```

### 2. Order Confirmation Email (`orderConfirmationEmail`)
**Purpose:** E-commerce order confirmation  
**Features demonstrated:**
- Deeply nested structures (`order.shippingAddress.city`)
- Currency formatting (custom type)
- Date formatting (custom type)
- JSON formatting for arrays
- Complex nested data

**Example usage:**
```typescript
const context = {
  user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
  order: {
    id: 'ORD-2024-001234',
    orderDate: new Date('2024-01-15'),
    items: [
      { name: 'Product A', quantity: 1, price: 1999, sku: 'PROD-A' },
    ],
    subtotal: 1999,
    tax: 160,
    shipping: 599,
    total: 2758,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  },
  companyName: 'Acme Corp',
  orderTrackingUrl: 'https://example.com/track/ORD-2024-001234',
  recipientEmail: 'alice@example.com',
  unsubscribeUrl: 'https://example.com/unsubscribe',
};

const html = orderConfirmationEmail(context);
```

### 3. Password Reset Email (`passwordResetEmail`)
**Purpose:** Password reset notification  
**Features demonstrated:**
- Date formatting with custom formatter
- Security-related messaging
- Multiple date fields

**Example usage:**
```typescript
const context = {
  user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
  passwordReset: {
    token: 'reset-token-abc123',
    expiresAt: new Date('2024-01-16T14:30:00Z'),
    requestedAt: new Date('2024-01-15T14:30:00Z'),
  },
  companyName: 'Acme Corp',
  resetUrl: 'https://example.com/reset?token=reset-token-abc123',
  recipientEmail: 'alice@example.com',
  unsubscribeUrl: 'https://example.com/unsubscribe',
};

const html = passwordResetEmail(context);
```

### 4. Newsletter Email (`newsletterEmail`)
**Purpose:** Monthly report/newsletter  
**Features demonstrated:**
- Complex nested statistics
- Multiple number types
- JSON formatting for complex objects
- Mixed data types

**Example usage:**
```typescript
const context = {
  user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
  newsletter: {
    month: 'January',
    year: 2024,
    stats: {
      totalUsers: 12500,
      newUsers: 450,
      activeUsers: 8900,
      revenue: 12500000, // in cents
    },
    topProducts: [
      { name: 'Product A', sales: 234 },
      { name: 'Product B', sales: 189 },
    ],
  },
  companyName: 'Acme Corp',
  newsletterUrl: 'https://example.com/newsletter/january-2024',
  recipientEmail: 'alice@example.com',
  unsubscribeUrl: 'https://example.com/unsubscribe',
};

const html = newsletterEmail(context);
```

### 5. Appointment Reminder Email (`appointmentReminderEmail`)
**Purpose:** Appointment reminder notification  
**Features demonstrated:**
- Date/time formatting
- Optional fields handling
- Duration formatting

**Example usage:**
```typescript
const context = {
  user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
  appointment: {
    id: 'APT-2024-001',
    title: 'Product Demo Call',
    date: new Date('2024-01-20T15:00:00Z'),
    duration: 30,
    location: 'Conference Room A', // optional
    meetingUrl: 'https://meet.example.com/abc123', // optional
    description: 'Discussion about features', // optional
  },
  companyName: 'Acme Corp',
  recipientEmail: 'alice@example.com',
  unsubscribeUrl: 'https://example.com/unsubscribe',
};

const html = appointmentReminderEmail(context);
```

## Custom Type Creators

### Currency Formatter (`typelitCurrency`)
Formats numbers (in cents) as currency strings.

```typescript
const priceVar = typelitCurrency('product', 'price');
const context = { product: { price: 1999 } }; // $19.99
// Output: "$19.99"
```

### Date Formatter (`typelitDate`)
Formats dates in a human-readable format with time.

```typescript
const dateVar = typelitDate('event', 'date');
const context = { event: { date: new Date('2024-01-15T14:30:00Z') } };
// Output: "January 15, 2024 at 2:30 PM"
```

### Short Date Formatter (`typelitShortDate`)
Formats dates without time.

```typescript
const shortDateVar = typelitShortDate('event', 'date');
const context = { event: { date: new Date('2024-01-15T14:30:00Z') } };
// Output: "January 15, 2024"
```

## Type Safety Benefits

### 1. Compile-Time Error Detection

TypeScript will catch errors at compile time:

```typescript
// ❌ Missing required field
const invalidContext = {
  user: {
    lastName: 'Johnson', // Missing firstName!
    email: 'alice@example.com',
  },
  companyName: 'Acme Corp',
  dashboardUrl: 'https://example.com/dashboard',
};
welcomeEmail(invalidContext); // TypeScript error!

// ❌ Wrong type
const wrongTypeContext = {
  user: {
    firstName: 12345, // Should be string!
    lastName: 'Johnson',
    email: 'alice@example.com',
  },
  companyName: 'Acme Corp',
  dashboardUrl: 'https://example.com/dashboard',
};
welcomeEmail(wrongTypeContext); // TypeScript error!

// ❌ Missing nested field
const invalidOrderContext = {
  user: sampleUser,
  order: {
    orderDate: new Date(),
    // Missing 'id' field!
  },
  companyName: 'Acme Corp',
};
orderConfirmationEmail(invalidOrderContext); // TypeScript error!
```

### 2. Autocomplete and IntelliSense

When creating context objects, TypeScript provides autocomplete:

```typescript
const context: Parameters<typeof welcomeEmail>[0] = {
  user: {
    firstName: 'Alice', // ← Autocomplete suggests: firstName, lastName, email
    // ...
  },
  // ← Autocomplete suggests: companyName, dashboardUrl, etc.
};
```

### 3. Type Inference

TypeScript automatically infers the correct context type from the template:

```typescript
type WelcomeEmailContext = Parameters<typeof welcomeEmail>[0];
// Automatically inferred as the correct type structure
```

## Template Composition

Templates can be composed with helper functions for headers and footers:

```typescript
import { emailHeaderHtml, emailFooterHtml } from './templates';

const body = welcomeEmail(context);
const fullEmail = emailHeaderHtml('Welcome!', 'Acme Corp') +
  body +
  emailFooterHtml(2024, 'Acme Corp', 'user@example.com', 'https://example.com/unsubscribe');
```

## Running the Examples

To see the examples in action:

```bash
# From the project root
npm run build
node dist/esm/examples/email-templates/index.mjs
```

Or if using TypeScript directly:

```bash
npx tsx examples/email-templates/index.ts
```

## Key Takeaways

1. **Type Safety**: Typelit ensures all required fields are present and correctly typed at compile time
2. **Nested Paths**: Deeply nested data structures are fully supported with type safety
3. **Custom Types**: Create custom formatters for domain-specific types (currency, dates, etc.)
4. **Composition**: Templates can be composed with helper functions for reusable components
5. **Developer Experience**: Get autocomplete, type checking, and IntelliSense support

## Production Usage Tips

1. **Store templates separately**: Keep templates in their own files for maintainability
2. **Create reusable components**: Use helper functions for headers, footers, and common sections
3. **Define types explicitly**: Create TypeScript types for your context objects to ensure consistency
4. **Custom formatters**: Create domain-specific formatters (currency, dates, etc.) for consistent formatting
5. **Test templates**: Write tests to ensure templates render correctly with various data

## Next Steps

- Explore the `index.ts` file to see all examples in action
- Check the commented-out type error examples to understand what TypeScript catches
- Modify the templates to match your use case
- Create your own custom type formatters for your domain
