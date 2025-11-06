import { runOrderConfirmationExample } from './order-confirmation';
import { runPasswordResetExample } from './password-reset';
import { runWelcomeExample } from './welcome';

/**
 * Main entry point - runs all email template examples
 */

runWelcomeExample();
runOrderConfirmationExample();
runPasswordResetExample();

console.log('\n=== All examples completed! ===');
