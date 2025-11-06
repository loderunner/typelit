import typelit, { createType } from '../../src/index.js';

/**
 * Custom type creator for currency formatting.
 * Formats numbers as USD currency with proper formatting.
 */
export const typelitCurrency = createType<number>({
  stringify: (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount),
});

/**
 * Custom type creator for human-readable dates.
 * Formats dates in a friendly, readable format.
 */
export const typelitDate = createType<Date>({
  stringify: (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
});

/**
 * Custom type creator for time formatting.
 * Formats dates to show only time in 12-hour format.
 */
export const typelitTime = createType<Date>({
  stringify: (date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
});

// ============================================================================
// REUSABLE TEMPLATE COMPONENTS
// ============================================================================

/**
 * Helper function that generates a reusable footer string.
 * This is called with context and returns a formatted footer.
 * 
 * Note: We can't use template composition by embedding typelit templates
 * inside other templates, so we create helper functions instead.
 */
const createFooter = (company: { name: string; address: string; supportEmail: string; unsubscribeUrl: string }) => `

---
${company.name} | ${company.address}

Need help? Contact us at ${company.supportEmail}

Unsubscribe: ${company.unsubscribeUrl}
`;

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Context type for welcome email.
 * Used when a new user signs up for the service.
 */
export type WelcomeEmailContext = {
  user: {
    firstName: string;
    email: string;
    accountType: string;
  };
  activation: {
    link: string;
    expiresAt: Date;
  };
  company: {
    name: string;
    address: string;
    supportEmail: string;
    unsubscribeUrl: string;
  };
};

/**
 * Welcome email template for new user onboarding.
 * Includes activation link and account details.
 */
export const welcomeEmail = typelit`Subject: Welcome to ${typelit.string('company', 'name')}!

Hello ${typelit.string('user', 'firstName')}!

Thank you for signing up! We're excited to have you on board.

Your account details:
- Email: ${typelit.string('user', 'email')}
- Account Type: ${typelit.string('user', 'accountType')}

To get started, please activate your account by clicking the link below:
${typelit.string('activation', 'link')}

This link will expire on ${typelitDate('activation', 'expiresAt')}.

Looking forward to seeing you!

---
${typelit.string('company', 'name')} | ${typelit.string('company', 'address')}

Need help? Contact us at ${typelit.string('company', 'supportEmail')}

Unsubscribe: ${typelit.string('company', 'unsubscribeUrl')}
`;

// ============================================================================

/**
 * Context type for order confirmation email.
 * Demonstrates nested structures and arrays.
 */
export type OrderConfirmationContext = {
  user: {
    firstName: string;
    email: string;
  };
  order: {
    id: string;
    date: Date;
    total: number;
    shipping: {
      address: string;
      estimatedDelivery: Date;
    };
    // In a real app, you'd iterate over items. For this example,
    // we'll show the first few items explicitly.
    item1: {
      name: string;
      quantity: number;
      price: number;
    };
    item2?: {
      name: string;
      quantity: number;
      price: number;
    };
  };
  company: {
    name: string;
    address: string;
    supportEmail: string;
    unsubscribeUrl: string;
  };
};

/**
 * Order confirmation email template for e-commerce.
 * Shows order details, items, and shipping information.
 */
export const orderConfirmationEmail = typelit`Subject: Order Confirmation #${typelit.string('order', 'id')}

Hello ${typelit.string('user', 'firstName')}!

Thank you for your order! We've received your payment and are processing your order.

Order Details:
- Order Number: ${typelit.string('order', 'id')}
- Order Date: ${typelitDate('order', 'date')}
- Total: ${typelitCurrency('order', 'total')}

Items Ordered:
- ${typelit.string('order', 'item1', 'name')} (Qty: ${typelit.number('order', 'item1', 'quantity')}) - ${typelitCurrency('order', 'item1', 'price')}

Shipping Information:
${typelit.string('order', 'shipping', 'address')}
Estimated Delivery: ${typelitDate('order', 'shipping', 'estimatedDelivery')}

Track your order at ${typelit.string('company', 'name')}.com using order #${typelit.string('order', 'id')}

---
${typelit.string('company', 'name')} | ${typelit.string('company', 'address')}

Need help? Contact us at ${typelit.string('company', 'supportEmail')}

Unsubscribe: ${typelit.string('company', 'unsubscribeUrl')}
`;

// ============================================================================

/**
 * Context type for password reset email.
 * Simple, focused template for security-critical action.
 */
export type PasswordResetContext = {
  user: {
    firstName: string;
    email: string;
  };
  reset: {
    link: string;
    expiresAt: Date;
    requestedAt: Date;
  };
  company: {
    name: string;
    address: string;
    supportEmail: string;
    unsubscribeUrl: string;
  };
};

/**
 * Password reset notification email.
 * Security-focused with clear expiration time.
 */
export const passwordResetEmail = typelit`Subject: Password Reset Request

Hello ${typelit.string('user', 'firstName')}!

We received a request to reset your password for ${typelit.string('user', 'email')}.

If you made this request, click the link below to reset your password:
${typelit.string('reset', 'link')}

This link will expire on ${typelitDate('reset', 'expiresAt')} at ${typelitTime('reset', 'expiresAt')}.

Request details:
- Request time: ${typelitDate('reset', 'requestedAt')} at ${typelitTime('reset', 'requestedAt')}
- Account: ${typelit.string('user', 'email')}

If you didn't request a password reset, you can safely ignore this email.
Your password will remain unchanged.

---
${typelit.string('company', 'name')} | ${typelit.string('company', 'address')}

Need help? Contact us at ${typelit.string('company', 'supportEmail')}

Unsubscribe: ${typelit.string('company', 'unsubscribeUrl')}
`;

// ============================================================================

/**
 * Context type for monthly newsletter.
 * Demonstrates multiple data points and statistics.
 */
export type NewsletterContext = {
  user: {
    firstName: string;
    stats: {
      loginCount: number;
      documentsCreated: number;
      storageUsed: number; // in GB
    };
  };
  newsletter: {
    month: string;
    year: number;
    highlight: {
      title: string;
      description: string;
      link: string;
    };
  };
  company: {
    name: string;
    address: string;
    supportEmail: string;
    unsubscribeUrl: string;
  };
};

/**
 * Monthly newsletter/report email template.
 * Shows user activity stats and highlights.
 */
export const monthlyNewsletterEmail = typelit`Subject: Your ${typelit.string('newsletter', 'month')} ${typelit.number('newsletter', 'year')} Activity Report

Hello ${typelit.string('user', 'firstName')}!

Here's your monthly summary for ${typelit.string('newsletter', 'month')} ${typelit.number('newsletter', 'year')}:

Your Activity:
- Logins: ${typelit.number('user', 'stats', 'loginCount')} times
- Documents Created: ${typelit.number('user', 'stats', 'documentsCreated')}
- Storage Used: ${typelit.number('user', 'stats', 'storageUsed')} GB

This Month's Highlight:
${typelit.string('newsletter', 'highlight', 'title')}

${typelit.string('newsletter', 'highlight', 'description')}

Learn more: ${typelit.string('newsletter', 'highlight', 'link')}

Thank you for being a valued member of ${typelit.string('company', 'name')}!

---
${typelit.string('company', 'name')} | ${typelit.string('company', 'address')}

Need help? Contact us at ${typelit.string('company', 'supportEmail')}

Unsubscribe: ${typelit.string('company', 'unsubscribeUrl')}
`;

// ============================================================================

/**
 * Context type for appointment reminder.
 * Demonstrates date/time handling and optional notes.
 */
export type AppointmentReminderContext = {
  user: {
    firstName: string;
    lastName: string;
  };
  appointment: {
    type: string;
    dateTime: Date;
    duration: number; // in minutes
    location: string;
    provider: {
      name: string;
      title: string;
    };
    notes?: string; // Optional field
  };
  company: {
    name: string;
    address: string;
    supportEmail: string;
    unsubscribeUrl: string;
  };
};

/**
 * Appointment reminder email template.
 * Includes date, time, location, and provider details.
 */
export const appointmentReminderEmail = typelit`Subject: Reminder: ${typelit.string('appointment', 'type')} on ${typelitDate('appointment', 'dateTime')}

Dear ${typelit.string('user', 'firstName')} ${typelit.string('user', 'lastName')},

This is a friendly reminder about your upcoming appointment:

Appointment Details:
- Type: ${typelit.string('appointment', 'type')}
- Date: ${typelitDate('appointment', 'dateTime')}
- Time: ${typelitTime('appointment', 'dateTime')}
- Duration: ${typelit.number('appointment', 'duration')} minutes
- Location: ${typelit.string('appointment', 'location')}

Provider:
${typelit.string('appointment', 'provider', 'name')}, ${typelit.string('appointment', 'provider', 'title')}

Please arrive 10 minutes early for check-in.

Need to reschedule? Contact us at ${typelit.string('company', 'supportEmail')}

---
${typelit.string('company', 'name')} | ${typelit.string('company', 'address')}

Need help? Contact us at ${typelit.string('company', 'supportEmail')}

Unsubscribe: ${typelit.string('company', 'unsubscribeUrl')}
`;

// ============================================================================
// ADVANCED: Template with optional field handling
// ============================================================================

/**
 * Appointment reminder with optional notes field.
 * Demonstrates how to handle optional fields in templates.
 */
const appointmentReminderWithNotes = typelit`Subject: Reminder: ${typelit.string('appointment', 'type')} on ${typelitDate('appointment', 'dateTime')}

Dear ${typelit.string('user', 'firstName')} ${typelit.string('user', 'lastName')},

This is a friendly reminder about your upcoming appointment:

Appointment Details:
- Type: ${typelit.string('appointment', 'type')}
- Date: ${typelitDate('appointment', 'dateTime')}
- Time: ${typelitTime('appointment', 'dateTime')}
- Duration: ${typelit.number('appointment', 'duration')} minutes
- Location: ${typelit.string('appointment', 'location')}

Provider:
${typelit.string('appointment', 'provider', 'name')}, ${typelit.string('appointment', 'provider', 'title')}

Please arrive 10 minutes early for check-in.

Need to reschedule? Contact us at ${typelit.string('company', 'supportEmail')}

---
${typelit.string('company', 'name')} | ${typelit.string('company', 'address')}

Need help? Contact us at ${typelit.string('company', 'supportEmail')}

Unsubscribe: ${typelit.string('company', 'unsubscribeUrl')}
`;

/**
 * Helper function to render appointment email with optional notes.
 * Shows how to handle optional fields in real usage.
 */
export function renderAppointmentEmail(
  ctx: AppointmentReminderContext,
): string {
  const baseEmail = appointmentReminderWithNotes(ctx);

  // If notes are provided, add them to the email
  if (ctx.appointment.notes) {
    const notesSection = `\n\nSpecial Instructions:\n${ctx.appointment.notes}\n`;
    // Insert notes before the footer
    return baseEmail.replace(
      'Need to reschedule?',
      `${notesSection}\nNeed to reschedule?`,
    );
  }

  return baseEmail;
}
