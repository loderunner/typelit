# prmpt

A type-safe string templating library for TypeScript that provides
strongly-typed variable references with support for nested paths. Create
template strings with compile-time type checking and automatic context type
inference.

`prmpt` allows you to write template strings that are both type-safe and easy to
read. Variables are referenced using a familiar template literal syntax while
maintaining full type information about the required context object structure.

## Getting Started

### Installation

Install using npm:

```shell
npm install prmpt
```

Or using yarn:

```shell
yarn add prmpt
```

### Basic Usage

First, import the library:

```typescript
import prmpt from 'prmpt';
```

Let's start with a simple greeting template:

```typescript
// Create a simple template with one variable
const greeting = prmpt`Hello ${prmpt.string('name')}!`;

// Use the template with a context object
const result = greeting({ name: 'Alice' }); // "Hello Alice!"
```

### Nested Context Objects

You can also create templates with nested variable paths:

```typescript
// Create a template with nested variables
const template = prmpt`Hello ${prmpt.string('user', 'name')}! You are ${prmpt.number('user', 'age')} years old.`;

// TypeScript knows exactly what shape the context object needs to have
const result = template({
  user: {
    name: 'Alice',
    age: 30,
  },
}); // "Hello Alice! You are 30 years old."

// This would cause a type error:
template({
  user: {
    name: 'Bob',
    // Error: missing required property 'age'
  },
});
```

## Variable Creators

`prmpt` provides built-in variable creators for common data types. These are
used to define variables in your templates with type-safe paths.

### String Variables

Use `prmpt.string()` to create string variables in your templates:

```typescript
// Simple string variable
const greeting = prmpt`Hello ${prmpt.string('name')}!`;
greeting({ name: 'Alice' }); // "Hello Alice!"

// Nested string variable
const userEmail = prmpt`Contact: ${prmpt.string('user', 'email')}`;
userEmail({ user: { email: 'alice@example.com' } }); // "Contact: alice@example.com"
```

### Number Variables

Use `prmpt.number()` to create number variables:

```typescript
// Simple number variable
const age = prmpt`Age: ${prmpt.number('age')} years old`;
age({ age: 25 }); // "Age: 25 years old"

// Nested number variable
const score = prmpt`Score: ${prmpt.number('game', 'score')} points`;
score({ game: { score: 100 } }); // "Score: 100 points"
```

### Boolean Variables

Use `prmpt.boolean()` to create boolean variables:

```typescript
// Simple boolean variable
const status = prmpt`Status: ${prmpt.boolean('isActive')}`;
status({ isActive: true }); // "Status: true"

// Nested boolean variable
const accountStatus = prmpt`Account active: ${prmpt.boolean('user', 'account', 'enabled')}`;
accountStatus({ user: { account: { enabled: false } } }); // "Account active: false"
```

### BigInt Variables

Use `prmpt.bigint()` to create bigint variables:

```typescript
// Simple bigint variable
const id = prmpt`ID: ${prmpt.bigint('userId')}`;
id({ userId: 9007199254740991n }); // "ID: 9007199254740991"

// Nested bigint variable
const transactionId = prmpt`Transaction: ${prmpt.bigint('payment', 'transactionId')}`;
transactionId({ payment: { transactionId: 123456789n } }); // "Transaction: 123456789"
```
