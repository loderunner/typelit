/**
 * Maps a type to an arbitrarily deep series of names, creating a nested object structure.
 *
 * ```ts
 * type T1 = Nested<['user'], string>          // { user: string }
 * type T2 = Nested<['user', 'name'], string>  // { user: { name: string } }
 * type T3 = Nested<['session', 'user', 'id'], number>
 * // {
 * //   session: {
 * //     user: {
 * //       id: number
 * //     }
 * //   }
 * // }
 * ```
 */
export type Nested<Names extends string[], T> = Names extends [
  infer Head extends string,
]
  ? { [K in Head]: T }
  : Names extends [infer Head extends string, ...infer Rest extends string[]]
    ? { [K in Head]: Nested<Rest, T> }
    : never;

/** Core prompt variable type that can extract a value from a nested context */
export type Var<Names extends string[], T> = {
  _extract: (ctx: Nested<Names, T>) => T;
};

/** Creates a function to generate typed prompt variables with nested path access */
export function createType<T>() {
  return function <Names extends string[]>(...names: Names): Var<Names, T> {
    return { _extract: (ctx) => names.reduce((obj, n) => obj[n], ctx as any) };
  };
}

/** Extracts the top-level name from a Var type */
type VarName<T> = T extends Var<infer VN, infer VT> ? VN[0] : never;

/** Extracts the leaf-level type from a nested Var structure */
type VarType<T extends Var<string[], any>> =
  T extends Var<infer VN, infer VT>
    ? VN extends [infer Head extends string]
      ? VT
      : VN extends [infer Head extends string, ...infer Rest extends string[]]
        ? Nested<Rest, VT>
        : never
    : never;

/** Base type that all arrays of Var extend */
export type VarList = Var<string[], any>[];

/** Converts a union type to an intersection type */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/** Helper type to "prettify" complex Context types */
type Prettify<T> = {
  [K in keyof T]: T[K] extends Context<infer Vars> ? Prettify<T[K]> : T[K];
} & {};

/** Maps an array of Vars to a merged object type, combining shared paths through intersection */
export type Context<Vars extends VarList> = Prettify<{
  [K in Vars[number] as VarName<K>]: UnionToIntersection<VarType<K>>;
}>;

/** Function that takes a context and returns a string */
export type PrmptFn<Vars extends VarList> = (ctx: Context<Vars>) => string;

/**
 * Tagged template that creates a function to interpolate Var values from a context into a string.
 *
 * ```ts
 * // Simple template with one variable
 * const hello = prmpt`Hello ${prmptString('name')}!`
 * hello({ name: 'Alice' }) // "Hello Alice!"
 *
 * // Multiple variables with nested paths
 * const contactInfo = prmpt`User ${prmptString('user', 'name')} (${prmptString('user', 'email')})`
 * contactInfo({ user: { name: 'Bob', email: 'bob@example.com' } }) // "User Bob (bob@example.com)"
 *
 * // Mixed variable types
 * const meeting = prmpt`Meeting in ${prmptString('location')} on ${prmptDate('date')}`
 * meeting({ location: 'Paris', date: new Date('2024-01-01') })
 * // "Meeting in Paris on Mon Jan 01 2024"
 * ```
 */
export function prmpt<Vars extends VarList>(
  strings: TemplateStringsArray,
  ...vars: Vars
): PrmptFn<Vars> {
  return (ctx: any) =>
    vars.reduce<string>(
      // @ts-expect-error
      (acc, v, i) => acc + String(v._extract(ctx)) + strings[i + 1],
      strings[0],
    );
}

prmpt.boolean = createType<boolean>();
prmpt.string = createType<string>();
prmpt.number = createType<number>();
prmpt.bigint = createType<bigint>();
