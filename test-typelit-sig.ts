import { typelit, Var } from './src/typelit';

// Create vars
const var1 = typelit.string('session', 'user', 'name');
const var2 = typelit.number('session', 'user', 'age');
const var3 = typelit.string('session', 'token');

// Check their types
type Var1Type = typeof var1;
type Var2Type = typeof var2;
type Var3Type = typeof var3;

// Now pass them to typelit as a rest parameter
// What does TypeScript infer for the Vars type parameter?
const template = typelit`Hi ${var1}, you are ${var2}. Your session token is ${var3}.`;

type TemplateType = typeof template;
type ParamType = Parameters<TemplateType>[0];

// Can we create a value of this type?
const ctx: ParamType = {
  session: {
    user: {
      name: 'Toto',
      age: 23,
    },
    token: 'asdgfhjkasdgfjk',
  },
};

export { ctx };
export type { ParamType, Var1Type, Var2Type, Var3Type };
