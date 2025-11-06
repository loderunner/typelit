/**
 * Type definitions for email template context objects
 */

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
};

export type OrderItem = {
  name: string;
  quantity: number;
  price: number; // in cents
  sku: string;
};

export type Order = {
  id: string;
  orderDate: Date;
  items: OrderItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export type PasswordReset = {
  expiresAt: Date;
};
