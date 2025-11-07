import { createType, typelit } from '../../src/typelit';

/**
 * Order Confirmation Email Example
 * 
 * Demonstrates:
 * - Deeply nested paths (order.shippingAddress.city)
 * - Custom currency formatter
 * - Custom date formatter
 * - JSON formatting for arrays
 */

const typelitCurrency = createType<number>({
  stringify: (cents) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars);
  },
});

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

type OrderItem = {
  name: string;
  quantity: number;
  price: number; // in cents
  sku: string;
};

type Order = {
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

type User = {
  firstName: string;
};

export const orderConfirmationEmail = typelit`
Hi ${typelit.string('user', 'firstName')},

Order #${typelit.string('order', 'id')}
Date: ${typelitDate('order', 'orderDate')}

Items: ${typelit.json('order', 'items')}

Subtotal: ${typelitCurrency('order', 'subtotal')}
Tax: ${typelitCurrency('order', 'tax')}
Total: ${typelitCurrency('order', 'total')}

Shipping to:
${typelit.string('order', 'shippingAddress', 'street')}
${typelit.string('order', 'shippingAddress', 'city')}, ${typelit.string('order', 'shippingAddress', 'state')} ${typelit.string('order', 'shippingAddress', 'zipCode')}
`;

export const sampleUser: User = {
  firstName: 'Alice',
};

export const sampleOrder: Order = {
  id: 'ORD-2024-001234',
  orderDate: new Date('2024-01-15T14:30:00Z'),
  items: [
    { name: 'Wireless Headphones', quantity: 1, price: 7999, sku: 'WH-2024' },
    { name: 'USB-C Cable', quantity: 2, price: 1299, sku: 'USB-C-1M' },
  ],
  subtotal: 10597,
  tax: 848,
  total: 12044,
  shippingAddress: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
};
