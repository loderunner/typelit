import { Var, VarName, VarType, UnionToIntersection, Context } from './src/typelit';

// Define the exact vars from the failing test
type Var1 = Var<['session', 'user', 'name'], string>;
type Var2 = Var<['session', 'user', 'age'], number>;
type Var3 = Var<['session', 'token'], string>;

// Create a tuple of vars (as typelit does)
type VarList = [Var1, Var2, Var3];

// Manually replicate what Context does
type ManualContext = {
  [K in VarList[number] as VarName<K>]: UnionToIntersection<VarType<K>>;
};

// What does the actual Context type produce?
type ActualContext = Context<VarList>;

// Test assignment
const test1: ManualContext = {
  session: {
    user: { name: 'Toto', age: 23 },
    token: 'asdgfhjkasdgfjk'
  }
};

const test2: ActualContext = {
  session: {
    user: { name: 'Toto', age: 23 },
    token: 'asdgfhjkasdgfjk'
  }
};

export type { ManualContext, ActualContext };
