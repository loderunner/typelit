/**
 * Creates a nested object type based on an array of property names and a value type.
 * Each level of nesting corresponds to one name in the array.
 *
 * ```ts
 * type User = Nested<['user'], string>                  // { user: string }
 * type UserWithName = Nested<['user', 'name'], string>  // { user: { name: string } }
 * type SessionWithUserWithId = Nested<['session', 'user', 'id'], number>
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

/**
 * Core prompt variable type that can extract a value from a nested context.
 */
export type Var<Names extends string[], T> = {
  _extract: (ctx: Nested<Names, T>) => T;
};

/**
 * Creates a type factory function for creating strongly-typed variable references.
 * Used to create type-specific variable creators (e.g., `string`, `number`, `boolean`).
 *
 * Returns a function that creates variable references with nested paths.
 *
 * ```ts
 * const stringVar = createType<string>();
 * const myVar = stringVar("user", "name");   // Var<["user", "name"], string>
 * ```
 */
export function createType<T>() {
  return function <Names extends string[]>(...names: Names): Var<Names, T> {
    return { _extract: (ctx) => names.reduce((obj, n) => obj[n], ctx as any) };
  };
}

/**
 * Extracts the first name in the path of a variable type.
 * Used for creating context object keys.
 *
 * ```ts
 * type Name = VarName<Var<["user", "name"], string>>; // "user"
 * ```
 */
export type VarName<T> = T extends Var<infer VN, infer VT> ? VN[0] : never;

/**
 * Extracts the type structure of a variable, maintaining the nested path except for the first name.
 *
 * ```ts
 * type Structure = VarType<Var<["user", "name"], string>>;
 * // { name: string }
 * ```
 */
export type VarType<T extends Var<string[], any>> =
  T extends Var<infer VN, infer VT>
    ? VN extends [infer Head extends string]
      ? VT
      : VN extends [infer Head extends string, ...infer Rest extends string[]]
        ? Nested<Rest, VT>
        : never
    : never;

/** Base type that all arrays of Var extend */
type VarList = Var<string[], any>[];

/**
 * Converts a union type to an intersection type.
 * Used internally to combine multiple variable types in a context.
 *
 * ```ts
 * type Union = { a: string } | { b: number };
 * type Intersection = UnionToIntersection<Union>; // { a: string } & { b: number }
 * ```
 */
export type UnionToIntersection<U> = (
  U extends object ? (k: U) => void : U
) extends (k: infer I) => void
  ? I
  : U;

/**
 * Helper type to "prettify" complex Context types
 */
type Prettify<T> = {
  [K in keyof T]: T[K] extends Context<infer Vars> ? Prettify<T[K]> : T[K];
} & {};

/**
 * Represents a context object that contains all variables needed for a prompt template.
 * Variables with the same first path segment are grouped together under a single property.
 *
 * ```ts
 * type Ctx = Context<[Var<["user", "name"], string>, Var<["user", "age"], number>]>;
 * // { user: { name: string; age: number } }
 * ```
 */
export type Context<Vars extends VarList> = Prettify<{
  [K in Vars[number] as VarName<K>]: UnionToIntersection<VarType<K>>;
}>;

/**
 * Represents a function that takes a context object and returns a string.
 * Used as the type for compiled prompt templates.
 */
export type PrmptFn<Vars extends VarList> = (ctx: Context<Vars>) => string;

/**
 * Creates a type-safe prompt template function from a template literal and variables.
 * The resulting function accepts a context object and returns the formatted string.
 *
 * ```ts
 * const template = prmpt`Hello ${prmpt.string("user", "name")}!`;
 * const result = template({ user: { name: "Alice" } }); // "Hello Alice!"
 * ```
 */
export function prmpt<Vars extends VarList>(
  strings: TemplateStringsArray,
  ...vars: Vars
): PrmptFn<Vars> {
  return (ctx: Context<Vars>) =>
    vars.reduce<string>(
      // @ts-expect-error type of `v` loses specificity during iteration
      (acc, v, i) => acc + String(v._extract(ctx)) + strings[i + 1],
      strings[0],
    );
}

/**
 * Built-in variable type creator for boolean values.
 * ```ts
 * const template = prmpt`The switch is ${prmpt.boolean("enabled")}`
 * template({ enabled: true }) // "The switch is true"
 * ```
 */
prmpt.boolean = createType<boolean>();

/**
 * Built-in variable type creator for string values.
 * ```ts
 * const template = prmpt`Hello ${prmpt.string("name")}!`
 * template({ name: "Alice" }) // "Hello Alice!"
 * ```
 */
prmpt.string = createType<string>();

/**
 * Built-in variable type creator for number values.
 * ```ts
 * const template = prmpt`You are number ${prmpt.number("position")} in line`
 * template({ position: 3 }) // "You are number 3 in line"
 * ```
 */
prmpt.number = createType<number>();

/**
 * Built-in variable type creator for bigint values.
 * ```ts
 * const template = prmpt`Transaction ID: ${prmpt.bigint("id")}`
 * template({ id: 123456789n }) // "Transaction ID: 123456789"
 * ```
 */
prmpt.bigint = createType<bigint>();
