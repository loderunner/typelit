import { createType, Var } from './src/typelit';

// Test if readonly helps with inference
const myString = createType<string>();

// When we call it, what type does TypeScript infer for Names?
const var1 = myString('session', 'user', 'name');

// Check the type
type TypeOfVar1 = typeof var1;

// Is it Var<['session', 'user', 'name'], string> or Var<string[], string>?
type Check1 = TypeOfVar1 extends Var<['session', 'user', 'name'], string> ? 'literal' : 'not-literal';
type Check2 = TypeOfVar1 extends Var<readonly ['session', 'user', 'name'], string> ? 'readonly-literal' : 'not-readonly-literal';
type Check3 = TypeOfVar1 extends Var<string[], string> ? 'array' : 'not-array';
type Check4 = TypeOfVar1 extends Var<readonly string[], string> ? 'readonly-array' : 'not-readonly-array';

export type { Check1, Check2, Check3, Check4 };
