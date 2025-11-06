# Email Templates Example

A comprehensive demonstration of Typelit's type-safe email templating capabilities for real-world scenarios.

## Overview

This example showcases how to use Typelit to build production-ready, type-safe email templates with:

- **Nested data structures** (user.profile.firstName, order.shipping.address)
- **Multiple variable types** (strings, numbers, dates, currency)
- **Custom formatters** (currency, human-readable dates, time formatting)
- **Template composition** (reusable headers, footers, and components)
- **Type safety** (compile-time checking of all data structures)
- **Optional fields** (safe handling of optional data)

## Running the Example

```bash
# From the repository root
npm install
npx tsx examples/email-templates/index.ts
```

This will output rendered examples of all email templates to the console.

## What's Included

### Email Templates

1. **Welcome Email** - New user onboarding with activation link
2. **Order Confirmation** - E-commerce order details with items and shipping
3. **Password Reset** - Security-focused password reset notification
4. **Monthly Newsletter** - User activity report with statistics
5. **Appointment Reminder** - Medical appointment with date, time, and provider

### Custom Type Creators

```typescript
// Currency formatting: 127.49 → $127.49
const typelitCurrency = createType<number>({
  stringify: (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount),
});

// Human-readable dates: Date → "Wednesday, November 6, 2025"
const typelitDate = createType<Date>({
  stringify: (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
});

// Time formatting: Date → "10:30 AM"
const typelitTime = createType<Date>({
  stringify: (date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
});
```

### Reusable Components

The example demonstrates reusability through custom type creators (like `typelitCurrency` and `typelitDate`) that can be used across multiple templates. Each email template includes consistent formatting for footers and greetings by inlining the common parts.

```typescript
// Custom type creators are reusable across all templates
const typelitCurrency = createType<number>({
  stringify: (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount),
});

// Used consistently in multiple templates
const welcomeEmail = typelit`... ${typelitCurrency('price')} ...`;
const orderEmail = typelit`... ${typelitCurrency('total')} ...`;
```

**Note on Template Composition:** Typelit templates are functions, not values, so you cannot directly embed one template function inside another template literal. Instead, use custom type creators for reusability, or compose templates by calling them separately and concatenating the results.

## Key Features Demonstrated

### 1. Nested Paths with Type Safety

```typescript
const template = typelit`
  Hello ${typelit.string('user', 'profile', 'firstName')}!
  Your order #${typelit.string('order', 'id')} will ship to:
  ${typelit.string('order', 'shipping', 'address')}
`;

// TypeScript knows the exact structure required:
template({
  user: {
    profile: {
      firstName: 'Alice', // ✅ Correct
    },
  },
  order: {
    id: 'ORD-123',
    shipping: {
      address: '123 Main St',
    },
  },
});
```

### 2. Custom Formatting

The example includes production-ready formatters for common needs:

- **Currency**: Formats numbers as locale-aware currency ($127.49)
- **Dates**: Human-readable date formatting (Wednesday, November 6, 2025)
- **Time**: 12-hour time formatting with AM/PM (10:30 AM)

### 3. Type Safety in Action

```typescript
// ❌ This will NOT compile - TypeScript catches the error:
const invalid = orderConfirmationEmail({
  order: {
    total: '$99.99', // ❌ Error: Type 'string' is not assignable to type 'number'
    // ... other fields
  },
});

// ✅ This compiles correctly:
const valid = orderConfirmationEmail({
  order: {
    total: 99.99, // ✅ Correct type
    // ... other fields
  },
});
```

### 4. Reusable Custom Types

Build reusable formatters that can be used across all templates:

```typescript
// Define once, use everywhere
const typelitCurrency = createType<number>({
  stringify: (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount),
});

// Use in multiple templates
const orderEmail = typelit`Total: ${typelitCurrency('order', 'total')}`;
const invoiceEmail = typelit`Amount: ${typelitCurrency('invoice', 'amount')}`;
```

### 5. Optional Fields

Handle optional data safely:

```typescript
type AppointmentContext = {
  appointment: {
    notes?: string; // Optional field
    // ... other required fields
  };
};

// Helper function handles optional fields
function renderAppointment(ctx: AppointmentContext): string {
  const baseEmail = appointmentTemplate(ctx);

  if (ctx.appointment.notes) {
    // Conditionally add notes section
    return baseEmail + `\nNotes: ${ctx.appointment.notes}`;
  }

  return baseEmail;
}
```

## Real-World Usage

### In Your Application

```typescript
import {
  orderConfirmationEmail,
  type OrderConfirmationContext,
} from './templates.js';

async function sendOrderConfirmation(orderId: string) {
  // Fetch order data from your database
  const order = await db.orders.findById(orderId);

  // Build context object with proper types
  const context: OrderConfirmationContext = {
    user: {
      firstName: order.customer.firstName,
      email: order.customer.email,
    },
    order: {
      id: order.id,
      date: order.createdAt,
      total: order.total,
      shipping: {
        address: order.shippingAddress,
        estimatedDelivery: order.estimatedDelivery,
      },
      item1: {
        name: order.items[0].name,
        quantity: order.items[0].quantity,
        price: order.items[0].price,
      },
    },
    company: {
      name: 'Your Company',
      address: 'Your Address',
      supportEmail: 'support@yourcompany.com',
      unsubscribeUrl: 'https://yourcompany.com/unsubscribe',
    },
  };

  // Generate the email body (type-safe!)
  const emailBody = orderConfirmationEmail(context);

  // Send via your email service
  await emailService.send({
    to: order.customer.email,
    subject: `Order Confirmation #${order.id}`,
    body: emailBody,
  });
}
```

### Benefits in Production

1. **No Runtime Errors**: TypeScript catches all data structure mismatches at compile time
2. **Refactoring Safety**: Rename a field? TypeScript shows all places that need updates
3. **Auto-Complete**: Get full IDE support for nested paths
4. **Documentation**: Types serve as documentation for required data
5. **Testing**: Easy to test with properly-typed mock data

## File Structure

```
examples/email-templates/
├── index.ts          # Demo file with example usage
├── templates.ts      # Email templates and custom types
└── README.md         # This file
```

## Extending the Example

### Adding a New Email Template

1. **Define the context type** in `templates.ts`:

```typescript
export type NewEmailContext = {
  user: {
    name: string;
  };
  // ... other fields
  company: {
    name: string;
    address: string;
    supportEmail: string;
    unsubscribeUrl: string;
  };
};
```

2. **Create the template** using Typelit:

```typescript
export const newEmail = typelit`Subject: New Email

Hello ${typelit.string('user', 'name')}!

Your custom content here...

${emailFooter}`;
```

3. **Use it** with type-safe context:

```typescript
const context: NewEmailContext = {
  user: { name: 'Alice' },
  company: {
    /* ... */
  },
};

const result = newEmail(context);
```

### Creating Custom Formatters

```typescript
// Phone number formatting
const typelitPhone = createType<string>({
  stringify: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  },
});

// Percentage formatting
const typelitPercent = createType<number>({
  stringify: (value) => `${(value * 100).toFixed(1)}%`,
});

// Use in templates
const template = typelit`
  Call us: ${typelitPhone('contact', 'phone')}
  Discount: ${typelitPercent('offer', 'discount')}
`;
```

## Type Safety Examples

The example includes commented-out code that demonstrates TypeScript errors:

```typescript
// ❌ Missing required field
// const invalid = welcomeEmail({
//   user: {
//     firstName: 'John',
//     // email: 'john@example.com', // Missing!
//   },
//   // ...
// });

// ❌ Wrong type
// const invalid = orderConfirmationEmail({
//   order: {
//     total: '$99.99', // Should be number, not string!
//   },
// });

// ❌ Nested path type mismatch
// const invalid = monthlyNewsletterEmail({
//   user: {
//     stats: {
//       loginCount: '47', // Should be number, not string!
//     },
//   },
// });
```

All of these would cause TypeScript compilation errors, catching bugs before runtime!

## Why This Matters

Traditional string templating approaches like this:

```javascript
// ⚠️ No type safety
const email = `Hello ${user.firstName}! Total: $${order.total}`;
```

Have problems:

- Typos aren't caught (`user.fristName`)
- Missing fields cause runtime errors
- Wrong types aren't detected (`order.total` could be a string)
- Refactoring is dangerous

With Typelit:

```typescript
// ✅ Fully type-safe
const email = typelit`Hello ${typelit.string('user', 'firstName')}! Total: ${typelitCurrency('order', 'total')}`;
```

You get:

- **Compile-time errors** for typos and missing fields
- **Type checking** ensures correct data types
- **IDE support** with autocomplete for nested paths
- **Refactoring safety** - TypeScript finds all usages
- **Documentation** - types describe required structure

## Learn More

- [Typelit Documentation](../../README.md)
- [Typelit Source Code](../../src/typelit.ts)

## License

This example is part of the Typelit project and is licensed under the Apache License 2.0.
