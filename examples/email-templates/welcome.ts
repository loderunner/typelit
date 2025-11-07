import { typelit } from '../../src/typelit';

/**
 * Welcome Email Example
 * 
 * Demonstrates:
 * - Nested paths (user.firstName, user.email)
 * - Basic string interpolation
 */

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export const welcomeEmail = typelit`
Welcome, ${typelit.string('user', 'firstName')}!

Your account has been created. Email: ${typelit.string('user', 'email')}

Visit your dashboard: ${typelit.string('dashboardUrl')}
`;
export const sampleUser: User = {
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@example.com',
};
