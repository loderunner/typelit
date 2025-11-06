import typelit from '../../src';
import { createType } from '../../src/typelit';
import type {
  AppointmentReminderContext,
  MonthlyReportContext,
  OrderConfirmationContext,
  PasswordResetContext,
  WelcomeEmailContext,
} from './types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);

/**
 * Custom Typelit variable creator that formats numbers as USD currency strings.
 *
 * @example
 * const totalVar = typelitCurrency('invoice', 'total');
 * const render = typelit`Amount due: ${totalVar}`;
 * render({ invoice: { total: 249.5 } });
 */
export const typelitCurrency = createType<number>({
  stringify: formatCurrency,
});

/**
 * Custom Typelit variable creator that renders dates using a short, human-friendly format.
 *
 * @example
 * const createdAtVar = typelitDate('record', 'createdAt');
 * const render = typelit`Created: ${createdAtVar}`;
 * render({ record: { createdAt: new Date('2025-01-01T10:00:00Z') } });
 */
export const typelitDate = createType<Date>({
  stringify: (value) =>
    value.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
});

/**
 * Optional string helper that normalises falsy values to an empty string.
 *
 * @example
 * const dialInVar = typelitOptionalString('meeting', 'dialIn');
 * const render = typelit`Dial in: ${dialInVar}`;
 * render({ meeting: { dialIn: null } });
 * // "Dial in: "
 */
export const typelitOptionalString = createType<string | null>({
  stringify: (value) => (value == null ? '' : value),
});

/**
 * Formats integer values with locale-aware separators.
 *
 * @example
 * const activeUsersVar = typelitInteger('metrics', 'activeUsers');
 * const render = typelit`Active users: ${activeUsersVar}`;
 * render({ metrics: { activeUsers: 14250 } });
 */
export const typelitInteger = createType<number>({
  stringify: (value) => value.toLocaleString('en-US'),
});

const brandDisplayNameVar = typelit.string('brand', 'displayName');
const brandTaglineVar = typelit.string('brand', 'tagline');
const brandSupportEmailVar = typelit.string('brand', 'support', 'email');
const brandSupportPhoneVar = typelit.string('brand', 'support', 'phone');
const brandUnsubscribeUrlVar = typelit.string('brand', 'support', 'unsubscribeUrl');
const brandMailingAddressVar = typelit.string('brand', 'address');

const userFirstNameVar = typelit.string('user', 'profile', 'firstName');
const userLastNameVar = typelit.string('user', 'profile', 'lastName');
const userEmailVar = typelit.string('user', 'contact', 'email');

const userPlanNameVar = typelit.string('user', 'plan', 'name');
const userTrialEndsVar = typelitDate('user', 'plan', 'trialEndsAt');
const userSignupDateVar = typelitDate('user', 'meta', 'signupDate');
const onboardingStepsRemainingVar = typelit.number('user', 'onboarding', 'stepsRemaining');

const orderIdVar = typelit.string('order', 'id');
const orderCreatedAtVar = typelitDate('order', 'createdAt');
const orderItem0NameVar = typelit.string('order', 'items', '0', 'name');
const orderItem0QuantityVar = typelit.number('order', 'items', '0', 'quantity');
const orderItem0PriceVar = typelitCurrency('order', 'items', '0', 'price');
const orderSubtotalVar = typelitCurrency('order', 'financials', 'subtotal');
const orderTaxVar = typelitCurrency('order', 'financials', 'tax');
const orderShippingVar = typelitCurrency('order', 'financials', 'shipping');
const orderTotalVar = typelitCurrency('order', 'financials', 'total');

const resetLinkVar = typelit.string('security', 'reset', 'url');
const resetTokenVar = typelit.string('security', 'reset', 'token');
const resetExpiresVar = typelitDate('security', 'reset', 'expiresAt');

const reportMonthVar = typelit.string('report', 'meta', 'monthLabel');
const reportActiveUsersVar = typelitInteger('report', 'metrics', 'activeUsers');
const reportConversionRateVar = typelit.number('report', 'metrics', 'conversionRate');
const reportRevenueVar = typelitCurrency('report', 'metrics', 'revenue');
const reportTopStoryVar = typelit.string('report', 'highlights', '0', 'title');

const appointmentDateVar = typelitDate('appointment', 'scheduledAt');
const appointmentLocationVar = typelit.string('appointment', 'location', 'label');
const appointmentDialInVar = typelitOptionalString('appointment', 'location', 'dialIn');
const appointmentAgendaVar = typelit.string('appointment', 'agenda');

const timezoneVar = typelit.string('user', 'preferences', 'timezone');

/**
 * Shared preheader used across all emails. Reinforces branding and personalisation.
 *
 * @example
 * const preheader = emailPreheader;
 * preheader({
 *   brand: { displayName: 'Acme', tagline: '', support: { email: '', phone: '', unsubscribeUrl: '' }, address: '' },
 *   user: { profile: { firstName: 'Ava' } },
 * });
 */
export const emailPreheader = typelit`
  <div class="preheader">${userFirstNameVar}, updates from ${brandDisplayNameVar}</div>
`;

/**
 * Reusable header with brand identity elements.
 *
 * @example
 * emailHeader({
 *   brand: {
 *     displayName: 'Acme',
 *     tagline: 'We build rockets',
 *     support: { email: 'help@acme.com', phone: '', unsubscribeUrl: '' },
 *     address: '',
 *   },
 *   user: { profile: { firstName: 'Ava' } },
 * });
 */
export const emailHeader = typelit`
  <header class="email-header">
    <h1>${brandDisplayNameVar}</h1>
    <p>${brandTaglineVar}</p>
  </header>
`;

/**
 * Reusable footer with support and compliance details.
 *
 * @example
 * emailFooter({
 *   brand: {
 *     displayName: 'Acme',
 *     tagline: '',
 *     support: {
 *       email: 'support@acme.com',
 *       phone: '+1-555-0100',
 *       unsubscribeUrl: 'https://acme.com/unsubscribe',
 *     },
 *     address: '123 Demo St',
 *   },
 *   user: { profile: { firstName: 'Ava' } },
 * });
 */
export const emailFooter = typelit`
  <footer class="email-footer">
    <p>Need help? Email <a href="mailto:${brandSupportEmailVar}">${brandSupportEmailVar}</a> or call ${brandSupportPhoneVar}.</p>
    <p><a href="${brandUnsubscribeUrlVar}">Unsubscribe</a> • ${brandMailingAddressVar}</p>
  </footer>
`;

const welcomeBody = typelit`
  <main>
    <p>Hi ${userFirstNameVar} ${userLastNameVar},</p>
    <p>Welcome to ${brandDisplayNameVar}! You signed up on ${userSignupDateVar}.</p>
    <p>Your current plan is <strong>${userPlanNameVar}</strong>. The trial ends on ${userTrialEndsVar}.</p>
    <p>You still have ${onboardingStepsRemainingVar} onboarding tasks left. Knock them out to unlock everything.</p>
  </main>
`;

/**
 * Variables required by the welcome email template.
 *
 * @example
 * type WelcomeContext = Context<typeof welcomeEmailVars>;
 */
export const welcomeEmailVars = [
  brandDisplayNameVar,
  brandTaglineVar,
  brandSupportEmailVar,
  brandSupportPhoneVar,
  brandUnsubscribeUrlVar,
  brandMailingAddressVar,
  userFirstNameVar,
  userLastNameVar,
  userPlanNameVar,
  userTrialEndsVar,
  userSignupDateVar,
  onboardingStepsRemainingVar,
] as const;

const orderConfirmationBody = typelit`
  <main>
    <p>Hi ${userFirstNameVar},</p>
    <p>Thanks for your order <strong>#${orderIdVar}</strong>. We received it on ${orderCreatedAtVar}.</p>
    <p>Your first item: ${orderItem0NameVar} × ${orderItem0QuantityVar} for ${orderItem0PriceVar}.</p>
    <p>Subtotal: ${orderSubtotalVar} • Tax: ${orderTaxVar} • Shipping: ${orderShippingVar}</p>
    <p>Total charged: <strong>${orderTotalVar}</strong>.</p>
  </main>
`;

/**
 * Variables required by the order confirmation template.
 *
 * @example
 * type OrderContext = Context<typeof orderConfirmationVars>;
 */
export const orderConfirmationVars = [
  brandDisplayNameVar,
  brandTaglineVar,
  brandSupportEmailVar,
  brandSupportPhoneVar,
  brandUnsubscribeUrlVar,
  brandMailingAddressVar,
  userFirstNameVar,
  orderIdVar,
  orderCreatedAtVar,
  orderItem0NameVar,
  orderItem0QuantityVar,
  orderItem0PriceVar,
  orderSubtotalVar,
  orderTaxVar,
  orderShippingVar,
  orderTotalVar,
] as const;

const passwordResetBody = typelit`
  <main>
    <p>Hi ${userFirstNameVar},</p>
    <p>We received a request to reset the password for ${userEmailVar}.</p>
    <p>Use the token <code>${resetTokenVar}</code> or click <a href="${resetLinkVar}">Reset Password</a>.</p>
    <p>This link expires on ${resetExpiresVar}. If you did not request it, ignore this email.</p>
  </main>
`;

/**
 * Variables required by the password reset template.
 *
 * @example
 * type ResetContext = Context<typeof passwordResetVars>;
 */
export const passwordResetVars = [
  brandDisplayNameVar,
  brandTaglineVar,
  brandSupportEmailVar,
  brandSupportPhoneVar,
  brandUnsubscribeUrlVar,
  brandMailingAddressVar,
  userFirstNameVar,
  userEmailVar,
  resetTokenVar,
  resetLinkVar,
  resetExpiresVar,
] as const;

const monthlyReportBody = typelit`
  <main>
    <p>Hey ${userFirstNameVar}, here is your ${reportMonthVar} summary.</p>
    <ul>
      <li>Active users: ${reportActiveUsersVar}</li>
      <li>Conversion rate: ${reportConversionRateVar}%</li>
      <li>Revenue: ${reportRevenueVar}</li>
    </ul>
    <p>Top highlight: ${reportTopStoryVar}</p>
  </main>
`;

/**
 * Variables required by the monthly report template.
 *
 * @example
 * type ReportContext = Context<typeof monthlyReportVars>;
 */
export const monthlyReportVars = [
  brandDisplayNameVar,
  brandTaglineVar,
  brandSupportEmailVar,
  brandSupportPhoneVar,
  brandUnsubscribeUrlVar,
  brandMailingAddressVar,
  userFirstNameVar,
  reportMonthVar,
  reportActiveUsersVar,
  reportConversionRateVar,
  reportRevenueVar,
  reportTopStoryVar,
] as const;

const appointmentReminderBody = typelit`
  <main>
    <p>Hi ${userFirstNameVar},</p>
    <p>This is a reminder for your appointment on ${appointmentDateVar}.</p>
    <p>Location: ${appointmentLocationVar}</p>
    <p>Agenda: ${appointmentAgendaVar}</p>
  </main>
`;

/**
 * Variables required by the appointment reminder template.
 *
 * @example
 * type ReminderContext = Context<typeof appointmentReminderVars>;
 */
export const appointmentReminderVars = [
  brandDisplayNameVar,
  brandTaglineVar,
  brandSupportEmailVar,
  brandSupportPhoneVar,
  brandUnsubscribeUrlVar,
  brandMailingAddressVar,
  userFirstNameVar,
  timezoneVar,
  appointmentDateVar,
  appointmentLocationVar,
  appointmentDialInVar,
  appointmentAgendaVar,
] as const;

const dialInHint = typelit`
  <p>Join remotely using ${appointmentDialInVar}. We will start on time (${timezoneVar}).</p>
`;

const joinSections = (...sections: string[]) => sections.filter(Boolean).join('\n\n');

/**
 * Builds the welcome email using shared header/footer components.
 *
 * @param ctx - Typed data required by the template.
 * @returns Complete HTML string for the welcome email.
 * @example
 * welcomeEmail({ brand: { ... }, user: { ... } });
 */
export const welcomeEmail = (ctx: WelcomeEmailContext): string =>
  joinSections(
    emailPreheader(ctx),
    emailHeader(ctx),
    welcomeBody(ctx),
    emailFooter(ctx),
  );

/**
 * Formats the line items for an order confirmation.
 *
 * @param ctx - Order confirmation context with strongly typed items.
 * @returns HTML unordered list string for the items.
 * @example
 * renderOrderItems(orderConfirmationContext);
 */
export const renderOrderItems = (ctx: OrderConfirmationContext): string => {
  const { order } = ctx;
  const { items } = order;
  let list = '<ul>';
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    list += `<li>${item.name} × ${item.quantity} — ${formatCurrency(item.price)}</li>`;
  }
  list += '</ul>';
  return list;
};

/**
 * Builds the order confirmation email with a dynamic items table.
 *
 * @param ctx - Typed data for the order confirmation email.
 * @returns Complete HTML string for the order confirmation email.
 * @example
 * orderConfirmationEmail(orderConfirmationContext);
 */
export const orderConfirmationEmail = (ctx: OrderConfirmationContext): string =>
  joinSections(
    emailPreheader(ctx),
    emailHeader(ctx),
    orderConfirmationBody(ctx) + '\n' + renderOrderItems(ctx),
    emailFooter(ctx),
  );

/**
 * Builds the password reset email.
 *
 * @param ctx - Typed data for the reset flow.
 * @returns Complete HTML string for the password reset email.
 * @example
 * passwordResetEmail(passwordResetContext);
 */
export const passwordResetEmail = (ctx: PasswordResetContext): string =>
  joinSections(emailPreheader(ctx), emailHeader(ctx), passwordResetBody(ctx), emailFooter(ctx));

/**
 * Builds the monthly report email and shows how to combine static Typelit output with manual rendering.
 *
 * @param ctx - Typed data for the monthly report email.
 * @returns Complete HTML string for the monthly report email.
 * @example
 * monthlyReportEmail(monthlyReportContext);
 */
export const monthlyReportEmail = (ctx: MonthlyReportContext): string => {
  const highlights = ctx.report.highlights.map((highlight, index) => `${index + 1}. ${highlight.title}`);
  const highlightsSection = highlights.length
    ? highlights.reduce((acc, line) => `${acc}\n${line}`, 'Highlights:\n')
    : 'No highlights recorded this month.';

  return joinSections(
    emailPreheader(ctx),
    emailHeader(ctx),
    monthlyReportBody(ctx),
    `<pre>${highlightsSection}</pre>`,
    emailFooter(ctx),
  );
};

/**
 * Builds the appointment reminder, demonstrating safe handling of optional fields.
 *
 * @param ctx - Typed data for the appointment reminder email.
 * @returns Complete HTML string for the appointment reminder email.
 * @example
 * appointmentReminderEmail(appointmentReminderContext);
 */
export const appointmentReminderEmail = (ctx: AppointmentReminderContext): string => {
  const dialInSection = ctx.appointment.location.dialIn
    ? dialInHint(ctx)
    : '<p>You will meet in person at the location above.</p>';

  return joinSections(
    emailPreheader(ctx),
    emailHeader(ctx),
    appointmentReminderBody(ctx),
    dialInSection,
    emailFooter(ctx),
  );
};

export { typelit };
