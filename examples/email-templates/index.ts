import {
  orderConfirmationEmail,
  sampleOrder as orderSampleOrder,
  sampleUser as orderSampleUser,
} from './order-confirmation';
import {
  passwordResetEmail,
  samplePasswordReset,
  sampleUser as passwordResetSampleUser,
} from './password-reset';
import { sampleUser, welcomeEmail } from './welcome';

console.log(
  welcomeEmail({
    user: sampleUser,
    dashboardUrl: 'https://example.com/dashboard',
  }),
);
console.log('------------------------------------------------------------');
console.log(
  orderConfirmationEmail({
    user: orderSampleUser,
    order: orderSampleOrder,
  }),
);
console.log('------------------------------------------------------------');
console.log(
  passwordResetEmail({
    user: passwordResetSampleUser,
    passwordReset: samplePasswordReset,
    resetUrl: 'https://example.com/reset?token=abc123',
  }),
);
