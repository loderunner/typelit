import { createType, typelit } from '../../src/typelit';

/**
 * Custom type creators for email-specific formatting
 */

/**
 * Currency formatter - formats numbers (in cents) as currency strings
 * Example: 1999 -> "$19.99"
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
 * Example: new Date() -> "January 15, 2024 at 2:30 PM"
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
 * Short date formatter (date only, no time)
 * Example: new Date() -> "January 15, 2024"
 */
export const typelitShortDate = createType<Date>({
  stringify: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  },
});

/**
 * Reusable email component helpers
 * These generate HTML strings that can be composed with templates
 */

/**
 * Generates email header HTML
 */
export function emailHeaderHtml(subject: string, companyName: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${companyName}</h1>
  </div>
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">`;
}

/**
 * Generates email footer HTML
 */
export function emailFooterHtml(
  currentYear: number,
  companyName: string,
  recipientEmail: string,
  unsubscribeUrl: string,
): string {
  return `    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
      © ${currentYear} ${companyName}. All rights reserved.
    </p>
    <p style="color: #999; font-size: 12px; text-align: center; margin: 10px 0 0 0;">
      This email was sent to ${recipientEmail}. 
      <a href="${unsubscribeUrl}" style="color: #667eea;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

/**
 * Email Templates
 */

/**
 * Welcome email template for new user onboarding
 * Demonstrates nested paths and multiple variable types
 */
export const welcomeEmail = typelit`
    <h2 style="color: #333; margin-top: 0;">Welcome, ${typelit.string('user', 'firstName')}!</h2>
    
    <p>We're thrilled to have you join ${typelit.string('companyName')}! Your account has been successfully created.</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Your Account Details</h3>
      <p><strong>Name:</strong> ${typelit.string('user', 'firstName')} ${typelit.string('user', 'lastName')}</p>
      <p><strong>Email:</strong> ${typelit.string('user', 'email')}</p>
    </div>
    
    <p>Get started by exploring our features:</p>
    <ul>
      <li>Browse our product catalog</li>
      <li>Set up your profile preferences</li>
      <li>Connect with our community</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${typelit.string('dashboardUrl')}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
    </div>
    
    <p>If you have any questions, don't hesitate to reach out to our support team.</p>
    
    <p>Best regards,<br>The ${typelit.string('companyName')} Team</p>
`;

/**
 * Order confirmation email template
 * Demonstrates complex nested structures, arrays, and currency formatting
 */
export const orderConfirmationEmail = typelit`
    <h2 style="color: #333; margin-top: 0;">Order Confirmation #${typelit.string('order', 'id')}</h2>
    
    <p>Hi ${typelit.string('user', 'firstName')},</p>
    
    <p>Thank you for your order! We've received your order and are processing it now.</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Order Summary</h3>
      <p><strong>Order Date:</strong> ${typelitShortDate('order', 'orderDate')}</p>
      <p><strong>Order Number:</strong> ${typelit.string('order', 'id')}</p>
      
      <div style="margin-top: 20px;">
        <p><strong>Items:</strong></p>
        ${typelit.json('order', 'items')}
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="text-align: right; margin: 5px 0;"><strong>Subtotal:</strong> ${typelitCurrency('order', 'subtotal')}</p>
        <p style="text-align: right; margin: 5px 0;"><strong>Tax:</strong> ${typelitCurrency('order', 'tax')}</p>
        <p style="text-align: right; margin: 5px 0;"><strong>Shipping:</strong> ${typelitCurrency('order', 'shipping')}</p>
        <p style="text-align: right; margin: 5px 0; font-size: 18px; font-weight: bold; color: #667eea;">
          <strong>Total:</strong> ${typelitCurrency('order', 'total')}
        </p>
      </div>
    </div>
    
    <div style="background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Shipping Address</h3>
      <p style="margin: 5px 0;">
        ${typelit.string('order', 'shippingAddress', 'street')}<br>
        ${typelit.string('order', 'shippingAddress', 'city')}, ${typelit.string('order', 'shippingAddress', 'state')} ${typelit.string('order', 'shippingAddress', 'zipCode')}<br>
        ${typelit.string('order', 'shippingAddress', 'country')}
      </p>
    </div>
    
    <p>You'll receive a shipping confirmation email once your order ships.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${typelit.string('orderTrackingUrl')}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Track Your Order</a>
    </div>
    
    <p>Best regards,<br>The ${typelit.string('companyName')} Team</p>
`;

/**
 * Password reset email template
 * Demonstrates date formatting and security-related messaging
 */
export const passwordResetEmail = typelit`
    <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
    
    <p>Hi ${typelit.string('user', 'firstName')},</p>
    
    <p>We received a request to reset your password for your ${typelit.string('companyName')} account (${typelit.string('user', 'email')}).</p>
    
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; color: #856404;">
        <strong>⚠️ Security Notice:</strong> This link will expire on ${typelitDate('passwordReset', 'expiresAt')}.
        If you didn't request this, please ignore this email.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${typelit.string('resetUrl')}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Or copy and paste this link into your browser:<br>
      <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px; word-break: break-all;">${typelit.string('resetUrl')}</code>
    </p>
    
    <p>This password reset link was requested on ${typelitDate('passwordReset', 'requestedAt')}.</p>
    
    <p>If you didn't request a password reset, please contact our support team immediately.</p>
    
    <p>Best regards,<br>The ${typelit.string('companyName')} Security Team</p>
`;

/**
 * Monthly newsletter/report email template
 * Demonstrates complex nested data and statistics
 */
export const newsletterEmail = typelit`
    <h2 style="color: #333; margin-top: 0;">${typelit.string('newsletter', 'month')} ${typelit.number('newsletter', 'year')} Newsletter</h2>
    
    <p>Hi ${typelit.string('user', 'firstName')},</p>
    
    <p>Here's what happened at ${typelit.string('companyName')} this month!</p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: white;">Monthly Statistics</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
        <div>
          <div style="font-size: 32px; font-weight: bold;">${typelit.number('newsletter', 'stats', 'totalUsers')}</div>
          <div style="font-size: 14px; opacity: 0.9;">Total Users</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold;">${typelit.number('newsletter', 'stats', 'newUsers')}</div>
          <div style="font-size: 14px; opacity: 0.9;">New Users</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold;">${typelit.number('newsletter', 'stats', 'activeUsers')}</div>
          <div style="font-size: 14px; opacity: 0.9;">Active Users</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold;">${typelitCurrency('newsletter', 'stats', 'revenue')}</div>
          <div style="font-size: 14px; opacity: 0.9;">Revenue</div>
        </div>
      </div>
    </div>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Top Products This Month</h3>
      <div style="margin-top: 10px;">
        ${typelit.json('newsletter', 'topProducts')}
      </div>
    </div>
    
    <p>Thank you for being part of our community!</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${typelit.string('newsletterUrl')}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Read Full Newsletter</a>
    </div>
    
    <p>Best regards,<br>The ${typelit.string('companyName')} Team</p>
`;

/**
 * Appointment reminder email template
 * Demonstrates date/time formatting and optional fields
 * Note: Optional fields are handled by checking if they exist in the context object
 */
export const appointmentReminderEmail = typelit`
    <h2 style="color: #333; margin-top: 0;">Appointment Reminder</h2>
    
    <p>Hi ${typelit.string('user', 'firstName')},</p>
    
    <p>This is a friendly reminder about your upcoming appointment.</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">${typelit.string('appointment', 'title')}</h3>
      
      <p><strong>Date & Time:</strong> ${typelitDate('appointment', 'date')}</p>
      <p><strong>Duration:</strong> ${typelit.number('appointment', 'duration')} minutes</p>
    </div>
    
    <p>We look forward to seeing you!</p>
    
    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    
    <p>Best regards,<br>The ${typelit.string('companyName')} Team</p>
`;
