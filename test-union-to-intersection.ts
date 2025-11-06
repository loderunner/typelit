import { UnionToIntersection, Nested } from './src/typelit';

// Simulate the VarTypes
type VType1 = { user: { name: string } };
type VType2 = { user: { age: number } };
type VType3 = { token: string };

// Test what UnionToIntersection does to individual types
type Inter1 = UnionToIntersection<VType1>;  // Should be { user: { name: string } }
type Inter2 = UnionToIntersection<VType2>;  // Should be { user: { age: number } }
type Inter3 = UnionToIntersection<VType3>;  // Should be { token: string }

// Now union those results
type UnionOfIntersections = Inter1 | Inter2 | Inter3;

// Compare to intersecting the union
type IntersectionOfUnion = UnionToIntersection<VType1 | VType2 | VType3>;

// Test assignability
const test1: UnionOfIntersections = {
  user: { name: 'Toto', age: 23 },
  token: 'asdgfhjkasdgfjk'
};

const test2: IntersectionOfUnion = {
  user: { name: 'Toto', age: 23 },
  token: 'asdgfhjkasdgfjk'
};

// Are they the same?
type Test1 = UnionOfIntersections extends IntersectionOfUnion ? true : false;
type Test2 = IntersectionOfUnion extends UnionOfIntersections ? true : false;

export type { UnionOfIntersections, IntersectionOfUnion, Test1, Test2 };
