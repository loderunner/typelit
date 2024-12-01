# prmpt

A type-safe string templating library for TypeScript that provides
strongly-typed variable references with support for nested paths. Create
template strings with compile-time type checking and automatic context type
inference.

`prmpt` allows you to write template strings that are both type-safe and easy to
read. Variables are referenced using a familiar template literal syntax while
maintaining full type information about the required context object structure.

## Table of contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Nested Context Objects](#nested-context-objects)
- [Template Function](#template-function)
  - [Features](#features)
- [Variable Creators](#variable-creators)
  - [String](#string)
  - [Number](#number)
  - [Boolean](#boolean)
  - [BigInt](#bigint)
- [Custom Variable Creators](#custom-variable-creators)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Installation

Install using npm:

```bash
npm install prmpt
```

Or using yarn:

```bash
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

## Template Function

The `prmpt` tag function creates template functions that evaluate a string
template using values from a context object. The template function takes a
context object as input and returns the evaluated string with all variables
replaced by their values.

When creating a template, TypeScript infers the required shape of the context
object from the variables used in the template.

```typescript
// Example showing type inference
const welcome = prmpt`Welcome back, ${prmpt.string('username')}!`;

// TypeScript infers that the context must have a 'username' property
welcome({ username: 'alice' }); // OK
welcome({ user: 'bob' }); // Type error: missing username
welcome({ username: 123 }); // Type error: number is not assignable to string
```

### Features

The `prmpt` function serves a dual purpose:

1. As a template tag function that creates typed template functions
2. As a namespace that provides variable creators (`string`, `number`, etc.)

Template functions created with `prmpt` offer:

- **Type Safety**: All variables are fully typed, ensuring you can't pass the
  wrong type of value.
- **Path Inference**: TypeScript automatically infers the required structure of
  your context object.
- **Composition**: Templates can be composed to build more complex strings:

```typescript
const firstName = prmpt`${prmpt.string('user', 'firstName')}`;
const lastName = prmpt`${prmpt.string('user', 'lastName')}`;
const fullName = prmpt`${firstName} ${lastName}`;

// Both templates require the same context structure
firstName({ user: { firstName: 'John' } });
fullName({ user: { firstName: 'John', lastName: 'Doe' } });
```

- **Compile-Time Validation**: TypeScript catches errors before runtime:
  - Missing or misspelled variable paths
  - Incorrect value types
  - Missing context properties
  - Invalid template syntax

## Variable Creators

`prmpt` provides built-in variable creators for common data types. These are
used to define variables in your templates with type-safe paths.

### String

Use `prmpt.string()` to create string variables in your templates:

```typescript
// Simple string variable
const greeting = prmpt`Hello ${prmpt.string('name')}!`;
greeting({ name: 'Alice' }); // "Hello Alice!"

// Nested string variable
const userEmail = prmpt`Contact: ${prmpt.string('user', 'email')}`;
userEmail({ user: { email: 'alice@example.com' } }); // "Contact: alice@example.com"
```

### Number

Use `prmpt.number()` to create number variables:

```typescript
// Simple number variable
const age = prmpt`Age: ${prmpt.number('age')} years old`;
age({ age: 25 }); // "Age: 25 years old"

// Nested number variable
const score = prmpt`Score: ${prmpt.number('game', 'score')} points`;
score({ game: { score: 100 } }); // "Score: 100 points"
```

### Boolean

Use `prmpt.boolean()` to create boolean variables:

```typescript
// Simple boolean variable
const status = prmpt`Status: ${prmpt.boolean('isActive')}`;
status({ isActive: true }); // "Status: true"

// Nested boolean variable
const accountStatus = prmpt`Account active: ${prmpt.boolean('user', 'account', 'enabled')}`;
accountStatus({ user: { account: { enabled: false } } }); // "Account active: false"
```

### BigInt

Use `prmpt.bigint()` to create bigint variables:

```typescript
// Simple bigint variable
const id = prmpt`ID: ${prmpt.bigint('userId')}`;
id({ userId: 9007199254740991n }); // "ID: 9007199254740991"

// Nested bigint variable
const transactionId = prmpt`Transaction: ${prmpt.bigint('payment', 'transactionId')}`;
transactionId({ payment: { transactionId: 123456789n } }); // "Transaction: 123456789"
```

## Custom Variable Creators

You can create your own variable creators for any type using the `createType`
function. Here's an example creating a variable creator for JavaScript's `Date`
type:

```typescript
import { createType } from 'prmpt';

// Create a variable creator for Date
const prmptDate = createType<Date>();

// Use it in a template
const template = prmpt`Event starts at ${prmptDate('event', 'startTime')}`;

// The context object requires a Date instance
const result = template({
  event: {
    startTime: new Date('2024-12-25T10:00:00Z'),
  },
}); // "Event starts at Wed Dec 25 2024 10:00:00 GMT+0000"

// Type error: string is not assignable to Date
template({
  event: {
    startTime: '2024-12-25', // Error!
  },
});
```

Like built-in variable creators, custom ones:

- Support nested paths
- Provide full type inference for the context object
- Enforce the correct type at compile time

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md)
for details on how to set up the development environment and our contribution
process.

## License

Copyright 2024 Charles Francoise

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
