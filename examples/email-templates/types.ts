import type { Context } from '../../src/typelit';

import type {
  appointmentReminderVars,
  monthlyReportVars,
  orderConfirmationVars,
  passwordResetVars,
  welcomeEmailVars,
} from './templates';

/**
 * Describes a single line item in the order confirmation email.
 *
 * @example
 * const item: OrderItem = { name: 'Seat', quantity: 2, price: 199 };
 */
export type OrderItem = {
  /** Display name for the line item. */
  name: string;
  /** Quantity purchased for the item. */
  quantity: number;
  /** Line item price before taxes and shipping. */
  price: number;
};

/**
 * Captures the metrics highlighted in the monthly report email.
 *
 * @example
 * const highlight: MonthlyReportHighlight = { title: 'New peak' };
 */
export type MonthlyReportHighlight = {
  /** Headline for the highlight. */
  title: string;
  /** Optional supporting copy that expands on the highlight. */
  summary?: string;
};

type InferredWelcomeEmailContext = Context<typeof welcomeEmailVars>;

/**
 * Context contract required to render the welcome email.
 *
 * @example
 * const ctx: WelcomeEmailContext = { brand: { ... }, user: { ... } };
 */
export type WelcomeEmailContext = InferredWelcomeEmailContext;

type InferredOrderConfirmationContext = Context<typeof orderConfirmationVars>;

/**
 * Context contract required to render the order confirmation email.
 *
 * @example
 * const ctx: OrderConfirmationContext = { brand: { ... }, user: { ... }, order: { ... } };
 */
export type OrderConfirmationContext = InferredOrderConfirmationContext & {
  order: InferredOrderConfirmationContext['order'] & {
    items: OrderItem[];
  };
};

type InferredPasswordResetContext = Context<typeof passwordResetVars>;

/**
 * Context contract required to render the password reset email.
 *
 * @example
 * const ctx: PasswordResetContext = { brand: { ... }, user: { ... }, security: { ... } };
 */
export type PasswordResetContext = InferredPasswordResetContext;

type InferredMonthlyReportContext = Context<typeof monthlyReportVars>;

/**
 * Context contract required to render the monthly report email.
 *
 * @example
 * const ctx: MonthlyReportContext = { brand: { ... }, user: { ... }, report: { ... } };
 */
export type MonthlyReportContext = InferredMonthlyReportContext & {
  report: InferredMonthlyReportContext['report'] & {
    highlights: MonthlyReportHighlight[];
  };
};

type InferredAppointmentReminderContext = Context<typeof appointmentReminderVars>;

/**
 * Context contract required to render the appointment reminder email.
 *
 * @example
 * const ctx: AppointmentReminderContext = { brand: { ... }, user: { ... }, appointment: { ... } };
 */
export type AppointmentReminderContext = InferredAppointmentReminderContext & {
  appointment: InferredAppointmentReminderContext['appointment'] & {
    location: InferredAppointmentReminderContext['appointment']['location'] & {
      dialIn: string | null;
    };
  };
};
