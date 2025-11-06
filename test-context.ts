import { typelit, Var, VarType, UnionToIntersection } from './src/typelit';

// Define the vars explicitly
type Var1 = Var<['session', 'user', 'name'], string>;
type Var2 = Var<['session', 'user', 'age'], number>;
type Var3 = Var<['session', 'token'], string>;

// What are their VarTypes?
type VType1 = VarType<Var1>; // Should be { user: { name: string } }
type VType2 = VarType<Var2>; // Should be { user: { age: number } }
type VType3 = VarType<Var3>; // Should be { token: string }

// What is the union?
type UnionType = VType1 | VType2 | VType3;

// What is the intersection?
type IntersectionType = UnionToIntersection<UnionType>;

// What does the Context type ACTUALLY compute?
// The issue is that Context applies UnionToIntersection to EACH VarType individually
// before unioning them together, instead of to the union of all VarTypes

// What Context is currently doing:
type WrongWay = {
  session: UnionToIntersection<VType1> | UnionToIntersection<VType2> | UnionToIntersection<VType3>
};

// What Context SHOULD be doing:
type RightWay = {
  session: UnionToIntersection<VType1 | VType2 | VType3>
};

// Let's verify this is the issue
const testWrong: WrongWay = {
  session: {
    user: { name: 'Toto', age: 23 },
    token: 'asdgfhjkasdgfjk'
  }
};

const testRight: RightWay = {
  session: {
    user: { name: 'Toto', age: 23 },
    token: 'asdgfhjkasdgfjk'
  }
};

// Export to check the inferred types
export type { WrongWay, RightWay, IntersectionType, UnionType, VType1, VType2, VType3 };
