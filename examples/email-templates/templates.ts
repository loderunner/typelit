import { createType, typelit } from '../../src/typelit';

/**
 * Custom type creators for email-specific formatting
 */

/**
 * Currency formatter - formats numbers (in cents) as currency strings
 */
export const typelitCurrency = createType<number>({
  stringify: (cents) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars);
  },
});

/**
 * Human-readable date formatter
 */
export const typelitDate = createType<Date>({
  stringify: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  },
});

/**
 * Welcome email template
 */
export const welcomeEmail = typelit`
Welcome, ${typelit.string('user', 'firstName')}!

Your account has been created. Email: ${typelit.string('user', 'email')}

Visit your dashboard: ${typelit.string('dashboardUrl')}
`;

/**
 * Order confirmation email template
 */
export const orderConfirmationEmail = typelit`
Hi ${typelit.string('user', 'firstName')},

Order #${typelit.string('order', 'id')}
Date: ${typelitDate('order', 'date')}

Items: ${typelit.json('order', 'items')}

Subtotal: ${typelitCurrency('order', 'subtotal')}
Tax: ${typelitCurrency('order', 'tax')}
Total: ${typelitCurrency('order', 'total')}

Shipping to:
${typelit.string('order', 'shippingAddress', 'street')}
${typelit.string('order', 'shippingAddress', 'city')}, ${typelit.string('order', 'shippingAddress', 'state')} ${typelit.string('order', 'shippingAddress', 'zipCode')}
`;

/**
 * Password reset email template
 */
export const passwordResetEmail = typelit`
Hi ${typelit.string('user', 'firstName')},

Reset your password: ${typelit.string('resetUrl')}

This link expires on ${typelitDate('passwordReset', 'expiresAt')}.
`;
