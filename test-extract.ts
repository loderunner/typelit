import { Var, VarName, VarType } from './src/typelit';

// Define test vars
type Var1 = Var<readonly ['session', 'user', 'name'], string>;
type Var2 = Var<readonly ['session', 'user', 'age'], number>;
type Var3 = Var<readonly ['session', 'token'], string>;

// Union of vars
type VarUnion = Var1 | Var2 | Var3;

// Test VarName extraction
type Name1 = VarName<Var1>; // should be 'session'
type Name2 = VarName<Var2>; // should be 'session'
type Name3 = VarName<Var3>; // should be 'session'
type NameUnion = VarName<VarUnion>; // should be 'session'

// Test the ExtractVarTypesForKey type manually
type ExtractVarTypesForKey<
  V extends Var<readonly string[], any>,
  Key extends string,
> = V extends any ? (VarName<V> extends Key ? VarType<V> : never) : never;

// Test extraction
type Extracted = ExtractVarTypesForKey<VarUnion, 'session'>;

// What should this be?
// { user: { name: string } } | { user: { age: number } } | { token: string }

export type { Extracted, Name1, Name2, Name3, NameUnion };
