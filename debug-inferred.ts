import { typelit } from './src/typelit';

// Let TypeScript infer everything
const template = typelit`Hi ${typelit.string('session', 'user', 'name')}, you are ${typelit.number('session', 'user', 'age')}. Your session token is ${typelit.string('session', 'token')}.`;

// Extract the inferred Vars type
type InferredVars = Parameters<typeof template> extends [(infer Ctx)] ? Ctx : never;

// What does TypeScript think this should be?
// Let's try to hover over or export this to see
type SessionType = InferredVars extends { session: infer S } ? S : never;
type SessionUserType = SessionType extends { user: infer U } ? U : never;
type SessionUserNameType = SessionUserType extends { name: infer N } ? N : never;
type SessionUserAgeType = SessionUserType extends { age: infer A } ? A : never;

export type { 
  InferredVars, 
  SessionType, 
  SessionUserType,
  SessionUserNameType,
  SessionUserAgeType 
};
