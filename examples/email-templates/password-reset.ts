import { createType, typelit } from '../../src/typelit';

/**
 * Password Reset Email Example
 *
 * Demonstrates:
 * - Custom date formatter
 * - Multiple date fields
 */

const typelitDate = createType<Date>({
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

type User = {
  firstName: string;
};

type PasswordReset = {
  expiresAt: Date;
};

export const passwordResetEmail = typelit`
Hi ${typelit.string('user', 'firstName')},

Reset your password: ${typelit.string('resetUrl')}

This link expires on ${typelitDate('passwordReset', 'expiresAt')}.
`;

export const sampleUser: User = {
  firstName: 'Alice',
};

export const samplePasswordReset: PasswordReset = {
  expiresAt: new Date('2024-01-16T14:30:00Z'),
};
