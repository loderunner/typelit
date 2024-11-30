import { Context, Var } from './prmpt';

// Var tests
const v: Var<['hello'], string> = { _extract: (ctx) => ctx.hello };
const v2: Var<['hello', 'world'], string> = {
  _extract: (ctx) => ctx.hello.world,
};
const v3: Var<['hello', 'world', 'toto'], string> = {
  _extract: (ctx) => ctx.hello.world.toto,
};

// Context test
const ctx: Context<[Var<['hello'], string>]> = { hello: 'world' };
const ctx2: Context<[Var<['hello'], string>, Var<['world'], number>]> = {
  hello: 'world',
  world: 1138,
};
const ctx3: Context<
  [
    Var<['hello'], string>,
    Var<['world'], number>,
    Var<['user', 'name'], string>,
  ]
> = {
  hello: 'world',
  world: 1138,
  user: {
    name: 'Toto',
  },
};
const ctx4: Context<
  [Var<['user', 'name'], string>, Var<['user', 'age'], number>]
> = {
  user: {
    name: 'Toto',
    age: 42,
  },
};
const ctx5: Context<
  [
    Var<['session', 'user', 'name'], string>,
    Var<['session', 'user', 'age'], number>,
    Var<['session', 'token'], string>,
  ]
> = {
  session: {
    user: {
      name: 'Toto',
      age: 23,
    },
    token: 'asdgfhjkasdgfjk',
  },
};
