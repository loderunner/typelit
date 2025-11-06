/**
 * Type definitions for email template context objects.
 * These types ensure type safety when creating email templates with Typelit.
 */

/**
 * User profile information
 */
export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  profile?: {
    avatarUrl?: string;
    timezone?: string;
  };
};

/**
 * Order item in an e-commerce order
 */
export type OrderItem = {
  name: string;
  quantity: number;
  price: number; // in cents
  sku: string;
};

/**
 * E-commerce order information
 */
export type Order = {
  id: string;
  orderDate: Date;
  items: OrderItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  shipping: number; // in cents
  total: number; // in cents
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

/**
 * Password reset token information
 */
export type PasswordReset = {
  token: string;
  expiresAt: Date;
  requestedAt: Date;
};

/**
 * Newsletter report data
 */
export type NewsletterData = {
  month: string;
  year: number;
  stats: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    revenue: number; // in cents
  };
  topProducts: Array<{
    name: string;
    sales: number;
  }>;
};

/**
 * Appointment information
 */
export type Appointment = {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
  meetingUrl?: string;
  description?: string;
};
