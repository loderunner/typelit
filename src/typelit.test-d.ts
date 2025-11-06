import { describe, expectTypeOf, it } from 'vitest';

import {
  Context,
  Nested,
  UnionToIntersection,
  Var,
  VarName,
  VarType,
  createType,
} from './typelit';

describe('typelit types', () => {
  it('Nested', () => {
    // No nested without an explicit list of keys
    expectTypeOf<Nested<string[], string>>().toBeNever();
    // No nested without at least one string key
    expectTypeOf<Nested<[], string>>().toBeNever();
    expectTypeOf<Nested<['hello'], string>>().toMatchTypeOf<{
      hello: string;
    }>();
    expectTypeOf<Nested<['hello', 'world'], string>>().toMatchTypeOf<{
      hello: { world: string };
    }>();
  });

  it('Var', () => {
    expectTypeOf<Var<['hello'], string>>()
      .toHaveProperty('_extract')
      .parameter(0)
      .toMatchTypeOf<{ hello: string }>();
  });

  it('createType', () => {
    expectTypeOf(createType()).toBeFunction();
    // With const type parameters, the parameter types are inferred at call-site
    // so we test the return type which is what matters for type safety
    expectTypeOf(createType()).returns.toEqualTypeOf<
      Var<readonly string[], unknown>
    >();
    expectTypeOf(createType<string>()).returns.toEqualTypeOf<
      Var<readonly string[], string>
    >();
    expectTypeOf(createType<string | number>()).returns.toEqualTypeOf<
      Var<readonly string[], string | number>
    >();
  });

  it('VarName', () => {
    expectTypeOf<VarName<Var<[], string>>>().toBeUndefined();
    expectTypeOf<VarName<Var<['hello'], string>>>().toEqualTypeOf<'hello'>();
    expectTypeOf<
      VarName<Var<['hello', 'world'], string>>
    >().toEqualTypeOf<'hello'>();
    expectTypeOf<
      VarName<Var<['hello', 'world', 'toto'], string>>
    >().toEqualTypeOf<'hello'>();
  });
  it('VarType', () => {
    expectTypeOf<VarType<Var<[], string>>>().toBeNever();
    expectTypeOf<VarType<Var<['hello'], string>>>().toBeString();
    expectTypeOf<VarType<Var<['hello', 'world'], string>>>().toMatchTypeOf<{
      world: string;
    }>();
    expectTypeOf<
      VarType<Var<['hello', 'world', 'toto'], string>>
    >().toEqualTypeOf<{ world: { toto: string } }>();
  });

  it('UnionToIntersection', () => {
    expectTypeOf<UnionToIntersection<true | false>>().toBeBoolean();
    expectTypeOf<UnionToIntersection<boolean>>().toBeBoolean();
    expectTypeOf<UnionToIntersection<string>>().toBeString();
    expectTypeOf<UnionToIntersection<string | number>>().toEqualTypeOf<
      string | number
    >();
    expectTypeOf<UnionToIntersection<string | undefined>>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<UnionToIntersection<{ a: string }>>().toMatchTypeOf<{
      a: string;
    }>();
    expectTypeOf<
      UnionToIntersection<{ a: string } | { b: number }>
    >().toMatchTypeOf<{ a: string; b: number }>();
  });

  it('Context', () => {
    expectTypeOf<Context<[Var<['hello'], string>]>>().toEqualTypeOf<{
      hello: string;
    }>();
    expectTypeOf<
      Context<
        [
          Var<['session', 'user', 'name'], string>,
          Var<['session', 'user', 'age'], number>,
          Var<['session', 'token'], string>,
        ]
      >
    >().toEqualTypeOf<{
      session: {
        user: {
          name: string;
          age: number;
        };
        token: string;
      };
    }>();
  });
});
