/**
 * Email Templates Example for Typelit
 *
 * This example demonstrates type-safe email templating with nested data structures,
 * custom formatters, and compile-time type checking.
 *
 * Run this file with: npx tsx examples/email-templates/index.ts
 */

import {
  welcomeEmail,
  orderConfirmationEmail,
  passwordResetEmail,
  monthlyNewsletterEmail,
  appointmentReminderEmail,
  renderAppointmentEmail,
  type WelcomeEmailContext,
  type OrderConfirmationContext,
  type PasswordResetContext,
  type NewsletterContext,
  type AppointmentReminderContext,
} from './templates.js';

// ============================================================================
// EXAMPLE 1: Welcome Email
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 1: WELCOME EMAIL');
console.log('================================================================================');

const welcomeContext: WelcomeEmailContext = {
  user: {
    firstName: 'Sarah',
    email: 'sarah@example.com',
    accountType: 'Premium',
  },
  activation: {
    link: 'https://example.com/activate/abc123',
    expiresAt: new Date('2025-11-13T23:59:59Z'),
  },
  company: {
    name: 'CloudDocs',
    address: '123 Tech Street, San Francisco, CA 94102',
    supportEmail: 'support@clouddocs.com',
    unsubscribeUrl: 'https://example.com/unsubscribe',
  },
};

console.log(welcomeEmail(welcomeContext));
console.log('\n');

// ============================================================================
// EXAMPLE 2: Order Confirmation Email
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 2: ORDER CONFIRMATION EMAIL');
console.log('================================================================================');

const orderContext: OrderConfirmationContext = {
  user: {
    firstName: 'Michael',
    email: 'michael@example.com',
  },
  order: {
    id: 'ORD-2024-12345',
    date: new Date('2025-11-06'),
    total: 127.49,
    shipping: {
      address: '456 Main St, Austin, TX 78701',
      estimatedDelivery: new Date('2025-11-10'),
    },
    item1: {
      name: 'Wireless Keyboard',
      quantity: 1,
      price: 79.99,
    },
    item2: {
      name: 'USB-C Cable (3-pack)',
      quantity: 1,
      price: 24.99,
    },
  },
  company: {
    name: 'TechStore',
    address: '789 Commerce Blvd, Seattle, WA 98101',
    supportEmail: 'orders@techstore.com',
    unsubscribeUrl: 'https://techstore.com/unsubscribe',
  },
};

console.log(orderConfirmationEmail(orderContext));
console.log('\n');

// ============================================================================
// EXAMPLE 3: Password Reset Email
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 3: PASSWORD RESET EMAIL');
console.log('================================================================================');

const resetContext: PasswordResetContext = {
  user: {
    firstName: 'Jessica',
    email: 'jessica@example.com',
  },
  reset: {
    link: 'https://example.com/reset-password/xyz789',
    expiresAt: new Date('2025-11-06T18:30:00Z'),
    requestedAt: new Date('2025-11-06T16:30:00Z'),
  },
  company: {
    name: 'SecureApp',
    address: '321 Security Lane, Boston, MA 02101',
    supportEmail: 'security@secureapp.com',
    unsubscribeUrl: 'https://secureapp.com/unsubscribe',
  },
};

console.log(passwordResetEmail(resetContext));
console.log('\n');

// ============================================================================
// EXAMPLE 4: Monthly Newsletter Email
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 4: MONTHLY NEWSLETTER EMAIL');
console.log('================================================================================');

const newsletterContext: NewsletterContext = {
  user: {
    firstName: 'David',
    stats: {
      loginCount: 47,
      documentsCreated: 23,
      storageUsed: 3.2,
    },
  },
  newsletter: {
    month: 'October',
    year: 2025,
    highlight: {
      title: 'New AI-Powered Document Assistant',
      description:
        'We just launched our new AI assistant that helps you write better documents faster. Try asking it to summarize, rewrite, or expand your content!',
      link: 'https://example.com/features/ai-assistant',
    },
  },
  company: {
    name: 'CloudDocs',
    address: '123 Tech Street, San Francisco, CA 94102',
    supportEmail: 'support@clouddocs.com',
    unsubscribeUrl: 'https://example.com/unsubscribe',
  },
};

console.log(monthlyNewsletterEmail(newsletterContext));
console.log('\n');

// ============================================================================
// EXAMPLE 5: Appointment Reminder Email
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 5: APPOINTMENT REMINDER EMAIL');
console.log('================================================================================');

const appointmentContext: AppointmentReminderContext = {
  user: {
    firstName: 'Emily',
    lastName: 'Chen',
  },
  appointment: {
    type: 'Annual Physical Examination',
    dateTime: new Date('2025-11-12T10:30:00Z'),
    duration: 45,
    location: 'Medical Center East, Suite 302',
    provider: {
      name: 'Dr. Amanda Johnson',
      title: 'Internal Medicine',
    },
    notes: 'Please bring your insurance card and a list of current medications.',
  },
  company: {
    name: 'HealthFirst Medical',
    address: '555 Hospital Drive, Chicago, IL 60601',
    supportEmail: 'appointments@healthfirst.com',
    unsubscribeUrl: 'https://healthfirst.com/unsubscribe',
  },
};

console.log(renderAppointmentEmail(appointmentContext));
console.log('\n');

// ============================================================================
// EXAMPLE 6: Demonstrating Type Safety
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 6: TYPE SAFETY DEMONSTRATION');
console.log('================================================================================');
console.log('The following examples would cause TypeScript compilation errors:\n');

// ❌ COMPILE ERROR: Missing required field 'user.email'
// const invalidWelcome = welcomeEmail({
//   user: {
//     firstName: 'John',
//     // email: 'john@example.com', // Missing!
//     accountType: 'Free',
//   },
//   activation: {
//     link: 'https://example.com/activate',
//     expiresAt: new Date(),
//   },
//   company: {
//     name: 'Example',
//     address: '123 Street',
//     supportEmail: 'support@example.com',
//     unsubscribeUrl: 'https://example.com/unsub',
//   },
// });

// ❌ COMPILE ERROR: Wrong type for 'order.total' (should be number, not string)
// const invalidOrder = orderConfirmationEmail({
//   user: {
//     firstName: 'Jane',
//     email: 'jane@example.com',
//   },
//   order: {
//     id: 'ORD-123',
//     date: new Date(),
//     total: '$99.99', // ❌ Should be number!
//     shipping: {
//       address: '123 Street',
//       estimatedDelivery: new Date(),
//     },
//     item1: {
//       name: 'Product',
//       quantity: 1,
//       price: 99.99,
//     },
//   },
//   company: {
//     name: 'Store',
//     address: '456 Ave',
//     supportEmail: 'support@store.com',
//     unsubscribeUrl: 'https://store.com/unsub',
//   },
// });

// ❌ COMPILE ERROR: Wrong type for 'reset.expiresAt' (should be Date, not string)
// const invalidReset = passwordResetEmail({
//   user: {
//     firstName: 'Bob',
//     email: 'bob@example.com',
//   },
//   reset: {
//     link: 'https://example.com/reset',
//     expiresAt: '2025-11-06', // ❌ Should be Date object!
//     requestedAt: new Date(),
//   },
//   company: {
//     name: 'App',
//     address: '789 Blvd',
//     supportEmail: 'support@app.com',
//     unsubscribeUrl: 'https://app.com/unsub',
//   },
// });

// ❌ COMPILE ERROR: Nested path type mismatch
// const invalidNewsletter = monthlyNewsletterEmail({
//   user: {
//     firstName: 'Alice',
//     stats: {
//       loginCount: '47', // ❌ Should be number, not string!
//       documentsCreated: 23,
//       storageUsed: 3.2,
//     },
//   },
//   newsletter: {
//     month: 'October',
//     year: 2025,
//     highlight: {
//       title: 'New Feature',
//       description: 'Check it out!',
//       link: 'https://example.com',
//     },
//   },
//   company: {
//     name: 'Company',
//     address: '123 St',
//     supportEmail: 'support@company.com',
//     unsubscribeUrl: 'https://company.com/unsub',
//   },
// });

console.log('✅ All of the above examples are commented out because they would');
console.log('   cause TypeScript compile errors!');
console.log('\n✅ TypeScript catches these errors at compile time, not runtime.');
console.log('   This is the power of type-safe templates with Typelit!\n');

// ============================================================================
// EXAMPLE 7: Demonstrating Template Reusability
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 7: TEMPLATE COMPONENT REUSABILITY');
console.log('================================================================================');
console.log('All email templates share the same footer component!\n');
console.log('This demonstrates how Typelit enables template composition:');
console.log('- personalizedGreeting is reused across all templates');
console.log('- emailFooter is reused across all templates');
console.log('- Custom types (typelitCurrency, typelitDate) are reusable\n');

// ============================================================================
// EXAMPLE 8: Working with Optional Fields
// ============================================================================

console.log('================================================================================');
console.log('EXAMPLE 8: HANDLING OPTIONAL FIELDS');
console.log('================================================================================');

// Appointment without optional notes
const appointmentWithoutNotes: AppointmentReminderContext = {
  user: {
    firstName: 'Robert',
    lastName: 'Smith',
  },
  appointment: {
    type: 'Follow-up Consultation',
    dateTime: new Date('2025-11-15T14:00:00Z'),
    duration: 30,
    location: 'Clinic B, Room 201',
    provider: {
      name: 'Dr. Sarah Williams',
      title: 'Family Medicine',
    },
    // notes field is optional and omitted here
  },
  company: {
    name: 'HealthFirst Medical',
    address: '555 Hospital Drive, Chicago, IL 60601',
    supportEmail: 'appointments@healthfirst.com',
    unsubscribeUrl: 'https://healthfirst.com/unsubscribe',
  },
};

console.log('Without optional notes:');
console.log(appointmentReminderEmail(appointmentWithoutNotes));
console.log('\n');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('================================================================================');
console.log('SUMMARY: KEY TYPELIT FEATURES DEMONSTRATED');
console.log('================================================================================');
console.log(`
✅ Nested Paths:
   - user.profile.firstName
   - order.shipping.address
   - appointment.provider.name

✅ Multiple Variable Types:
   - typelit.string() for text
   - typelit.number() for quantities and counts
   - typelit.date() for timestamps

✅ Custom Types:
   - typelitCurrency for price formatting ($127.49)
   - typelitDate for readable dates (Wednesday, November 6, 2025)
   - typelitTime for time formatting (10:30 AM)

✅ Template Composition:
   - Reusable components (emailFooter, personalizedGreeting)
   - Build complex emails from smaller pieces
   - Maintain consistency across all templates

✅ Type Safety:
   - Compile-time checking of all fields
   - TypeScript catches missing or wrong-typed fields
   - No runtime errors from typos or incorrect data

✅ Optional Fields:
   - Support for optional properties in context
   - Safe handling with conditional logic
   - Full type inference maintained

✅ Real-World Scenarios:
   - Welcome emails
   - Order confirmations
   - Password resets
   - Monthly newsletters
   - Appointment reminders
`);
