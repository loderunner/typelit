import { typelit, Var } from './src/typelit';

// Create variables explicitly
const var1 = typelit.string('session', 'user', 'name');
const var2 = typelit.number('session', 'user', 'age');
const var3 = typelit.string('session', 'token');

// What types are these?
type TypeOfVar1 = typeof var1;
type TypeOfVar2 = typeof var2;
type TypeOfVar3 = typeof var3;

// Create the template by passing them explicitly
const template1 = typelit`Hi ${var1}, you are ${var2}. Your session token is ${var3}.`;

// What is the inferred type of template1?
type ParamsOf1 = Parameters<typeof template1>[0];

// Now create the template inline (like the test does)
const template2 = typelit`Hi ${typelit.string('session', 'user', 'name')}, you are ${typelit.number('session', 'user', 'age')}. Your session token is ${typelit.string('session', 'token')}.`;

// What is the inferred type of template2?
type ParamsOf2 = Parameters<typeof template2>[0];

// Are they the same?
type Same = ParamsOf1 extends ParamsOf2 ? (ParamsOf2 extends ParamsOf1 ? true : false) : false;

// Test with both
const ctx = {
  session: {
    user: {
      name: 'Toto',
      age: 23,
    },
    token: 'asdgfhjkasdgfjk',
  },
};

const result1 = template1(ctx);
const result2 = template2(ctx);

export { result1, result2 };
export type { ParamsOf1, ParamsOf2, Same, TypeOfVar1, TypeOfVar2, TypeOfVar3 };
