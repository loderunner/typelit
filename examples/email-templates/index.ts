import {
  appointmentReminderEmail,
  newsletterEmail,
  orderConfirmationEmail,
  passwordResetEmail,
  typelitCurrency,
  typelitDate,
  typelitShortDate,
  welcomeEmail,
  emailHeaderHtml,
  emailFooterHtml,
} from './templates';
import type {
  Appointment,
  NewsletterData,
  Order,
  PasswordReset,
  UserProfile,
} from './types';

/**
 * Main demo file showcasing Typelit email templates
 * 
 * This file demonstrates:
 * - Type-safe email template usage
 * - Nested data structures
 * - Custom type formatters (currency, dates)
 * - Template composition
 * - Type safety benefits
 */

// Sample data for demonstrations
const sampleUser: UserProfile = {
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice.johnson@example.com',
  profile: {
    timezone: 'America/New_York',
  },
};

const sampleOrder: Order = {
  id: 'ORD-2024-001234',
  orderDate: new Date('2024-01-15T14:30:00Z'),
  items: [
    {
      name: 'Wireless Headphones',
      quantity: 1,
      price: 7999, // $79.99 in cents
      sku: 'WH-2024',
    },
    {
      name: 'USB-C Cable',
      quantity: 2,
      price: 1299, // $12.99 in cents
      sku: 'USB-C-1M',
    },
  ],
  subtotal: 10597, // $105.97
  tax: 848, // $8.48 (8% tax)
  shipping: 599, // $5.99
  total: 12044, // $120.44
  shippingAddress: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
};

const samplePasswordReset: PasswordReset = {
  token: 'reset-token-abc123xyz789',
  expiresAt: new Date('2024-01-16T14:30:00Z'),
  requestedAt: new Date('2024-01-15T14:30:00Z'),
};

const sampleNewsletter: NewsletterData = {
  month: 'January',
  year: 2024,
  stats: {
    totalUsers: 12500,
    newUsers: 450,
    activeUsers: 8900,
    revenue: 12500000, // $125,000.00 in cents
  },
  topProducts: [
    { name: 'Wireless Headphones', sales: 234 },
    { name: 'Smart Watch', sales: 189 },
    { name: 'USB-C Cable', sales: 567 },
  ],
};

const sampleAppointment: Appointment = {
  id: 'APT-2024-001',
  title: 'Product Demo Call',
  date: new Date('2024-01-20T15:00:00Z'),
  duration: 30,
  location: 'Conference Room A',
  meetingUrl: 'https://meet.example.com/abc123',
  description: 'Discussion about our new product features and pricing plans.',
};

const companyName = 'Acme Corp';
const currentYear = new Date().getFullYear();
const baseUrl = 'https://acme.example.com';

/**
 * Example 1: Welcome Email
 * Demonstrates nested paths and basic string interpolation
 */
console.log('=== Welcome Email ===');
const welcomeContext = {
  user: sampleUser,
  companyName,
  dashboardUrl: `${baseUrl}/dashboard`,
  recipientEmail: sampleUser.email,
  unsubscribeUrl: `${baseUrl}/unsubscribe`,
};

const welcomeBody = welcomeEmail(welcomeContext);
const welcomeFull = emailHeaderHtml('Welcome to Acme Corp!', companyName) +
  welcomeBody +
  emailFooterHtml(currentYear, companyName, sampleUser.email, `${baseUrl}/unsubscribe`);

console.log(welcomeFull);
console.log('\n');

/**
 * Example 2: Order Confirmation Email
 * Demonstrates complex nested structures, currency formatting, and dates
 */
console.log('=== Order Confirmation Email ===');
const orderContext = {
  user: sampleUser,
  order: sampleOrder,
  companyName,
  orderTrackingUrl: `${baseUrl}/orders/${sampleOrder.id}`,
  recipientEmail: sampleUser.email,
  unsubscribeUrl: `${baseUrl}/unsubscribe`,
};

const orderBody = orderConfirmationEmail(orderContext);
const orderFull = emailHeaderHtml(`Order Confirmation #${sampleOrder.id}`, companyName) +
  orderBody +
  emailFooterHtml(currentYear, companyName, sampleUser.email, `${baseUrl}/unsubscribe`);

console.log(orderFull);
console.log('\n');

/**
 * Example 3: Password Reset Email
 * Demonstrates date formatting and security messaging
 */
console.log('=== Password Reset Email ===');
const resetContext = {
  user: sampleUser,
  passwordReset: samplePasswordReset,
  companyName,
  resetUrl: `${baseUrl}/reset-password?token=${samplePasswordReset.token}`,
  recipientEmail: sampleUser.email,
  unsubscribeUrl: `${baseUrl}/unsubscribe`,
};

const resetBody = passwordResetEmail(resetContext);
const resetFull = emailHeaderHtml('Password Reset Request', companyName) +
  resetBody +
  emailFooterHtml(currentYear, companyName, sampleUser.email, `${baseUrl}/unsubscribe`);

console.log(resetFull);
console.log('\n');

/**
 * Example 4: Newsletter Email
 * Demonstrates complex nested statistics and JSON formatting
 */
console.log('=== Newsletter Email ===');
const newsletterContext = {
  user: sampleUser,
  newsletter: sampleNewsletter,
  companyName,
  newsletterUrl: `${baseUrl}/newsletter/january-2024`,
  recipientEmail: sampleUser.email,
  unsubscribeUrl: `${baseUrl}/unsubscribe`,
};

const newsletterBody = newsletterEmail(newsletterContext);
const newsletterFull = emailHeaderHtml(`${sampleNewsletter.month} ${sampleNewsletter.year} Newsletter`, companyName) +
  newsletterBody +
  emailFooterHtml(currentYear, companyName, sampleUser.email, `${baseUrl}/unsubscribe`);

console.log(newsletterFull);
console.log('\n');

/**
 * Example 5: Appointment Reminder Email
 * Demonstrates date/time formatting
 */
console.log('=== Appointment Reminder Email ===');
const appointmentContext = {
  user: sampleUser,
  appointment: sampleAppointment,
  companyName,
  recipientEmail: sampleUser.email,
  unsubscribeUrl: `${baseUrl}/unsubscribe`,
};

const appointmentBody = appointmentReminderEmail(appointmentContext);
const appointmentFull = emailHeaderHtml(`Appointment Reminder: ${sampleAppointment.title}`, companyName) +
  appointmentBody +
  emailFooterHtml(currentYear, companyName, sampleUser.email, `${baseUrl}/unsubscribe`);

console.log(appointmentFull);
console.log('\n');

/**
 * TYPE SAFETY DEMONSTRATIONS
 * 
 * The following examples show what TypeScript catches at compile time.
 * Uncomment them to see the type errors.
 */

// ============================================
// Example: Missing required field
// ============================================
// This will cause a TypeScript error because 'firstName' is missing:
// const invalidWelcomeContext = {
//   user: {
//     lastName: 'Johnson',
//     email: 'alice@example.com',
//   },
//   companyName: 'Acme Corp',
//   dashboardUrl: 'https://example.com/dashboard',
// };
// welcomeEmail(invalidWelcomeContext); // ❌ TypeScript error!

// ============================================
// Example: Wrong type for a field
// ============================================
// This will cause a TypeScript error because 'firstName' should be a string:
// const wrongTypeContext = {
//   user: {
//     firstName: 12345, // ❌ Should be string, not number!
//     lastName: 'Johnson',
//     email: 'alice@example.com',
//   },
//   companyName: 'Acme Corp',
//   dashboardUrl: 'https://example.com/dashboard',
// };
// welcomeEmail(wrongTypeContext); // ❌ TypeScript error!

// ============================================
// Example: Missing nested field
// ============================================
// This will cause a TypeScript error because 'order.id' is missing:
// const invalidOrderContext = {
//   user: sampleUser,
//   order: {
//     orderDate: new Date(),
//     items: [],
//     subtotal: 0,
//     tax: 0,
//     shipping: 0,
//     total: 0,
//     shippingAddress: {
//       street: '123 Main St',
//       city: 'New York',
//       state: 'NY',
//       zipCode: '10001',
//       country: 'USA',
//     },
//     // ❌ Missing 'id' field!
//   },
//   companyName: 'Acme Corp',
//   orderTrackingUrl: 'https://example.com/track',
// };
// orderConfirmationEmail(invalidOrderContext); // ❌ TypeScript error!

// ============================================
// Example: Wrong type in nested path
// ============================================
// This will cause a TypeScript error because 'order.subtotal' should be a number:
// const wrongNestedTypeContext = {
//   user: sampleUser,
//   order: {
//     ...sampleOrder,
//     subtotal: '10597', // ❌ Should be number, not string!
//   },
//   companyName: 'Acme Corp',
//   orderTrackingUrl: 'https://example.com/track',
// };
// orderConfirmationEmail(wrongNestedTypeContext); // ❌ TypeScript error!

// ============================================
// Example: Type inference working correctly
// ============================================
// TypeScript correctly infers the context type from the template:
type WelcomeEmailContext = Parameters<typeof welcomeEmail>[0];
// WelcomeEmailContext is automatically inferred as:
// {
//   user: { firstName: string; lastName: string; email: string; profile?: { ... } };
//   companyName: string;
//   dashboardUrl: string;
//   recipientEmail: string;
//   unsubscribeUrl: string;
// }

// This means you get autocomplete and type checking:
const correctlyTypedContext: WelcomeEmailContext = {
  user: {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
  },
  companyName: 'Acme Corp',
  dashboardUrl: 'https://example.com/dashboard',
  recipientEmail: 'bob@example.com',
  unsubscribeUrl: 'https://example.com/unsubscribe',
};

// TypeScript knows this is correct:
welcomeEmail(correctlyTypedContext); // ✅ No errors!

/**
 * CUSTOM TYPE DEMONSTRATIONS
 * 
 * Show how custom types (currency, dates) work
 */
console.log('=== Custom Type Formatters ===');

// Currency formatting
const priceVar = typelitCurrency('product', 'price');
const priceContext = { product: { price: 1999 } }; // $19.99
console.log('Currency format:', priceVar.stringify(priceVar._extract(priceContext)));
// Output: "$19.99"

// Date formatting
const dateVar = typelitDate('event', 'date');
const dateContext = { event: { date: new Date('2024-01-15T14:30:00Z') } };
console.log('Date format:', dateVar.stringify(dateVar._extract(dateContext)));
// Output: "January 15, 2024 at 2:30 PM"

// Short date formatting
const shortDateVar = typelitShortDate('event', 'date');
console.log('Short date format:', shortDateVar.stringify(shortDateVar._extract(dateContext)));
// Output: "January 15, 2024"

console.log('\n=== All examples completed successfully! ===');
