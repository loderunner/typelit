import {
  appointmentReminderEmail,
  monthlyReportEmail,
  orderConfirmationEmail,
  passwordResetEmail,
  typelit,
  typelitCurrency,
  typelitDate,
  typelitInteger,
  typelitOptionalString,
  welcomeEmail,
} from './templates';
import type {
  AppointmentReminderContext,
  MonthlyReportContext,
  OrderConfirmationContext,
  PasswordResetContext,
  WelcomeEmailContext,
} from './types';

const baseBrand = {
  displayName: 'Acme Analytics',
  tagline: 'Insights that actually move the needle',
  support: {
    email: 'support@acme.com',
    phone: '+1-555-0101',
    unsubscribeUrl: 'https://acme.com/unsubscribe',
  },
  address: '100 Market Street, San Francisco, CA 94105',
} as const;

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

const orderConfirmationContext = {
  brand: baseBrand,
  user: {
    profile: { firstName: 'Jules' },
  },
  order: {
    id: 'PO-493820',
    createdAt: new Date('2025-01-15T11:22:33-08:00'),
    items: [
      { name: 'Acme Pro Seat', quantity: 2, price: 199.99 },
      { name: 'Insights Add-on', quantity: 1, price: 49.5 },
    ],
    financials: {
      subtotal: 449.48,
      tax: 38.21,
      shipping: 0,
      total: 487.69,
    },
  },
} satisfies OrderConfirmationContext;

const passwordResetContext = {
  brand: baseBrand,
  user: {
    profile: { firstName: 'Jules' },
    contact: { email: 'jules@customer.io' },
  },
  security: {
    reset: {
      url: 'https://acme.com/security/reset?token=ABCD',
      token: 'ABCD-1234',
      expiresAt: new Date('2025-01-15T12:22:33-08:00'),
    },
  },
} satisfies PasswordResetContext;

const monthlyReportContext = {
  brand: baseBrand,
  user: { profile: { firstName: 'Jules' } },
  report: {
    meta: { monthLabel: 'January 2025' },
    metrics: {
      activeUsers: 14250,
      conversionRate: 4.82,
      revenue: 98754.21,
    },
    highlights: [
      { title: 'New usage peak on January 13', summary: 'Concurrent sessions up 23%' },
      { title: 'Churn dropped to 1.2%' },
    ],
  },
} satisfies MonthlyReportContext;

const appointmentReminderContext = {
  brand: baseBrand,
  user: {
    profile: { firstName: 'Jules' },
    preferences: { timezone: 'America/Los_Angeles' },
  },
  appointment: {
    scheduledAt: new Date('2025-01-21T10:00:00-08:00'),
    location: {
      label: 'ACME HQ — 3rd Floor Strategy Room',
      dialIn: 'zoom: https://acme.zoom.us/j/123456789',
    },
    agenda: 'Quarterly review of key growth initiatives',
  },
} satisfies AppointmentReminderContext;

/**
 * Collection of fully typed context objects for the demo templates.
 *
 * @example
 * exampleContexts.welcome.user.profile.firstName;
 */
export const exampleContexts = {
  welcome: welcomeContext,
  orderConfirmation: orderConfirmationContext,
  passwordReset: passwordResetContext,
  monthlyReport: monthlyReportContext,
  appointmentReminder: appointmentReminderContext,
} as const;

/**
 * Renders each email template with the sample context and prints the output.
 *
 * @returns Map of email keys to rendered HTML strings.
 * @example
 * renderAllEmails();
 */
export const renderAllEmails = () => {
  const outputs = {
    welcome: welcomeEmail(exampleContexts.welcome),
    orderConfirmation: orderConfirmationEmail(exampleContexts.orderConfirmation),
    passwordReset: passwordResetEmail(exampleContexts.passwordReset),
    monthlyReport: monthlyReportEmail(exampleContexts.monthlyReport),
    appointmentReminder: appointmentReminderEmail(exampleContexts.appointmentReminder),
  } as const;

  for (const [key, value] of Object.entries(outputs)) {
    // eslint-disable-next-line no-console -- Example code should print the rendered result.
    console.log(`\n--- ${key} ---\n${value}`);
  }

  return outputs;
};

if (import.meta.main) {
  renderAllEmails();
}

// Type safety demos --------------------------------------------------------

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

// @ts-expect-error - Dial-in must be string | null. Numbers are rejected.
const invalidAppointmentContext: AppointmentReminderContext = {
  ...appointmentReminderContext,
  appointment: {
    ...appointmentReminderContext.appointment,
    location: {
      ...appointmentReminderContext.appointment.location,
      dialIn: 12345,
    },
  },
};

void invalidWelcomeContext;
void invalidAppointmentContext;

/**
 * Standalone demonstration of Typelit variable factories. Useful for tests and docs.
 *
 * @example
 * demoVars[0]('user', 'profile', 'firstName');
 */
export const demoVars = [
  typelit.string('user', 'profile', 'firstName'),
  typelitCurrency('order', 'financials', 'total'),
  typelitDate('order', 'createdAt'),
  typelitInteger('report', 'metrics', 'activeUsers'),
  typelitOptionalString('appointment', 'location', 'dialIn'),
] as const;

/**
 * Type representing the context demanded by {@link demoVars}.
 *
 * @example
 * const ctx: DemoVarsContext = { user: { ... }, order: { ... }, report: { ... }, appointment: { ... } };
 */
export type DemoVarsContext = import('../../src/typelit').Context<typeof demoVars>;

/**
 * Shape of the rendered email outputs returned by {@link renderAllEmails}.
 */
export type RenderedEmails = ReturnType<typeof renderAllEmails>;

export { typelit };
