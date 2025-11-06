import {
  orderConfirmationEmail,
  passwordResetEmail,
  welcomeEmail,
} from './templates';
import type { Order, PasswordReset, UserProfile } from './types';

// Sample data
const user: UserProfile = {
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@example.com',
};

const order: Order = {
  id: 'ORD-2024-001234',
  orderDate: new Date('2024-01-15T14:30:00Z'),
  items: [
    { name: 'Wireless Headphones', quantity: 1, price: 7999, sku: 'WH-2024' },
    { name: 'USB-C Cable', quantity: 2, price: 1299, sku: 'USB-C-1M' },
  ],
  subtotal: 10597,
  tax: 848,
  total: 12044,
  shippingAddress: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
};

const passwordReset: PasswordReset = {
  expiresAt: new Date('2024-01-16T14:30:00Z'),
};

// Example 1: Welcome email
console.log('=== Welcome Email ===');
console.log(
  welcomeEmail({
    user,
    dashboardUrl: 'https://example.com/dashboard',
  }),
);

// Example 2: Order confirmation
console.log('\n=== Order Confirmation ===');
console.log(
  orderConfirmationEmail({
    user,
    order,
  }),
);

// Example 3: Password reset
console.log('\n=== Password Reset ===');
console.log(
  passwordResetEmail({
    user,
    passwordReset,
    resetUrl: 'https://example.com/reset?token=abc123',
  }),
);

// Type safety demonstration - uncomment to see TypeScript errors:
// welcomeEmail({ user: { firstName: 'Bob' } }); // ❌ Missing lastName and email
// welcomeEmail({ user: { firstName: 123, lastName: 'Smith', email: 'bob@example.com' } }); // ❌ Wrong type
