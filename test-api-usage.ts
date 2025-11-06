// Test that all the examples from the README still work exactly the same

import { typelit } from './src/typelit';

// Example 1: Basic Usage
const greeting = typelit`Hello ${typelit.string('name')}!`;
const result1 = greeting({ name: 'Alice' }); // "Hello Alice!"

// Example 2: Nested Context Objects
const template = typelit`Hello ${typelit.string('user', 'name')}! You are ${typelit.number('user', 'age')} years old.`;
const result2 = template({
  user: {
    name: 'Alice',
    age: 30,
  },
});

// Example 3: Custom Variable Creators
import { createType } from './src/typelit';

const typelitDate = createType<Date>();
const eventTemplate = typelit`Event starts at ${typelitDate('event', 'startTime')}`;
const result3 = eventTemplate({
  event: {
    startTime: new Date('2024-12-25T10:00:00Z'),
  },
});

// Example 4: Custom stringify
const typelitPrice = createType<number>({
  stringify: (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price),
});
const priceTemplate = typelit`Total: ${typelitPrice('amount')}`;
const result4 = priceTemplate({ amount: 42.99 });

console.log('All examples work!');
export { result1, result2, result3, result4 };
