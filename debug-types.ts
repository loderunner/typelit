import { Context, Var, VarType, VarName, UnionToIntersection, Nested } from './src/typelit';

// Test the individual type components

// Test 1: VarType for individual vars
type Var1 = Var<['session', 'user', 'name'], string>;
type Var2 = Var<['session', 'user', 'age'], number>;
type Var3 = Var<['session', 'token'], string>;

type VarType1 = VarType<Var1>;  // Should be { user: { name: string } }
type VarType2 = VarType<Var2>;  // Should be { user: { age: number } }
type VarType3 = VarType<Var3>;  // Should be { token: string }

// Test 2: Union of VarTypes
type UnionOfVarTypes = VarType1 | VarType2 | VarType3;

// Test 3: UnionToIntersection
type IntersectedVarTypes = UnionToIntersection<UnionOfVarTypes>;

// Test 4: Full Context type
type TestContext = Context<[Var1, Var2, Var3]>;

// Test 5: What TypeScript thinks the context should be
const testValue: TestContext = {
  session: {
    user: {
      name: 'Toto',
      age: 23,
    },
    token: 'asdgfhjkasdgfjk',
  },
};

// Let's also test simpler cases
type SimpleVar1 = Var<['user', 'name'], string>;
type SimpleVar2 = Var<['user', 'age'], number>;
type SimpleContext = Context<[SimpleVar1, SimpleVar2]>;

const simpleValue: SimpleContext = {
  user: {
    name: 'Alice',
    age: 30
  }
};
