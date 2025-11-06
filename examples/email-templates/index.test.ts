import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  appointmentReminderEmail,
  monthlyReportEmail,
  orderConfirmationEmail,
  passwordResetEmail,
  welcomeEmail,
} from './templates';
import {
  DemoVarsContext,
  RenderedEmails,
  demoVars,
  exampleContexts,
  renderAllEmails,
} from './index';
import type {
  AppointmentReminderContext,
  MonthlyReportContext,
  OrderConfirmationContext,
  PasswordResetContext,
  WelcomeEmailContext,
} from './types';

describe('email template examples', () => {
  it('derive context types from demo vars', () => {
    type Expected = {
      user: { profile: { firstName: string } };
      order: {
        createdAt: Date;
        financials: { total: number };
      };
      report: { metrics: { activeUsers: number } };
      appointment: { location: { dialIn: string | null } };
    };

    expectTypeOf<DemoVarsContext>().toMatchTypeOf<Expected>();
  });

  it('matches concrete context shapes for the shared examples', () => {
    expectTypeOf(exampleContexts.welcome).toMatchTypeOf<WelcomeEmailContext>();
    expectTypeOf(exampleContexts.orderConfirmation).toMatchTypeOf<OrderConfirmationContext>();
    expectTypeOf(exampleContexts.passwordReset).toMatchTypeOf<PasswordResetContext>();
    expectTypeOf(exampleContexts.monthlyReport).toMatchTypeOf<MonthlyReportContext>();
    expectTypeOf(exampleContexts.appointmentReminder).toMatchTypeOf<AppointmentReminderContext>();
  });

  it('renders the composed templates successfully', () => {
    const outputs: RenderedEmails = renderAllEmails();
    expect(outputs.welcome).toContain('Welcome to');
    expect(outputs.orderConfirmation).toContain('#PO-');
    expect(outputs.passwordReset).toContain('Reset Password');
    expect(outputs.monthlyReport).toContain('Highlights');
    expect(outputs.appointmentReminder).toContain('appointment');
  });

  it('keeps header and footer reusable', () => {
    const welcome = welcomeEmail(exampleContexts.welcome);
    const order = orderConfirmationEmail(exampleContexts.orderConfirmation);
    const reset = passwordResetEmail(exampleContexts.passwordReset);
    const report = monthlyReportEmail(exampleContexts.monthlyReport);
    const reminder = appointmentReminderEmail(exampleContexts.appointmentReminder);

    expect(welcome).toContain(exampleContexts.welcome.brand.displayName);
    expect(order).toContain(exampleContexts.orderConfirmation.brand.support.email);
    expect(reset).toContain(exampleContexts.passwordReset.security.reset.token);
    expect(report).toContain(exampleContexts.monthlyReport.report.meta.monthLabel);
    expect(reminder).toContain(exampleContexts.appointmentReminder.user.preferences.timezone);
  });

  it('allows using custom Typelit factories', () => {
    const [firstNameVar, totalVar, createdAtVar, activeUsersVar, dialInVar] = demoVars;
    const template = welcomeEmail;
    expect(firstNameVar.stringify('Ava')).toBe('Ava');
    expect(totalVar.stringify(400)).toBe('$400.00');
    expect(createdAtVar.stringify(new Date('2025-01-01T00:00:00Z'))).toContain('2025');
    expect(activeUsersVar.stringify(12000)).toBe('12,000');
    expect(dialInVar.stringify(null)).toBe('');
    expect(typeof template(exampleContexts.welcome)).toBe('string');
  });
});
