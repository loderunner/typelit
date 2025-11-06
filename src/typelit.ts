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
export type Nested<Names extends readonly string[], T> = Names extends [
  infer Head extends string,
]
  ? { [K in Head]: T }
  : Names extends [infer Head extends string, ...infer Rest extends readonly string[]]
    ? { [K in Head]: Nested<Rest, T> }
    : never;

/**
 * Core prompt variable type that can extract a value from a nested context and
 * stringify it.
 */
export type Var<Names extends readonly string[], T> = {
  _extract: (ctx: Nested<Names, T>) => T;
  stringify: (value: T) => string;
};

/**
 * Options for creating a prompt variable factory function.
 */
export type CreateOptions<T> = {
  /**
   * Optional function to convert a value of type T to a string.
   * If not provided, the default `String` function will be used.
   */
  stringify?: (value: T) => string;
};

/**
 * Creates a prompt variable factory function for creating strongly-typed variable references.
 * Used to create type-specific variable creators (e.g., `string`, `number`, `boolean`).
 *
 * @param options - Configuration options for the variable type
 * @param options.stringify - Custom function to convert values to strings. Useful when the default
 * `String()` conversion isn't suitable (e.g., for formatting numbers or dates).
 * If not provided, the standard `String()` function is used.
 *
 * Returns a function that creates variable references with nested paths.
 *
 * ```ts
 * // Basic usage with default string conversion
 * const stringVar = createType<string>();
 * const myVar = stringVar("user", "name");   // Var<["user", "name"], string>
 *
 * // Custom string conversion for numbers
 * const numberVar = createType<number>({
 *   stringify: (n) => n.toFixed(2)  // Convert numbers to strings with 2 decimal places
 * });
 * const priceVar = numberVar("product", "price");  // Var<["product", "price"], number>
 * ```
 */
export function createType<T>(options: CreateOptions<T> = {}) {
  return function <const Names extends readonly string[]>(...names: Names): Var<Names, T> {
    return {
      _extract: (ctx) => names.reduce((obj, n) => obj[n], ctx as any),
      stringify: options.stringify ?? String,
    };
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
export type VarName<T> = T extends Var<infer VN, infer _VT> ? VN[0] : never;

/**
 * Extracts the type structure of a variable, maintaining the nested path except for the first name.
 *
 * ```ts
 * type Structure = VarType<Var<["user", "name"], string>>;
 * // { name: string }
 * ```
 */
export type VarType<T extends Var<readonly string[], any>> =
  T extends Var<infer VN, infer VT>
    ? VN extends [infer _Head extends string]
      ? VT
      : VN extends [infer _Head extends string, ...infer Rest extends readonly string[]]
        ? Nested<Rest, VT>
        : never
    : never;

/** Base type that all arrays of Var extend */
type VarList = Var<readonly string[], any>[];

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
  [K in keyof T]: T[K] extends Context<infer _Vars> ? Prettify<T[K]> : T[K];
} & {};

/**
 * Helper type that distributes over a union of Vars and extracts VarType for vars matching a specific key.
 */
type ExtractVarTypesForKey<
  V extends Var<readonly string[], any>,
  Key extends string,
> = V extends any ? (VarName<V> extends Key ? VarType<V> : never) : never;

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
  [Key in VarName<Vars[number]>]: UnionToIntersection<
    ExtractVarTypesForKey<Vars[number], Key>
  >;
}>;

/**
 * Represents a function that takes a context object and returns a string.
 * Used as the type for compiled prompt templates.
 */
export type TemplateFn<Vars extends VarList> = (ctx: Context<Vars>) => string;

/**
 * Creates a type-safe prompt template function from a template literal and variables.
 * The resulting function accepts a context object and returns the formatted string.
 *
 * ```ts
 * const template = typelit`Hello ${typelit.string("user", "name")}!`;
 * const result = template({ user: { name: "Alice" } }); // "Hello Alice!"
 * ```
 */
export function typelit<const Vars extends VarList>(
  strings: TemplateStringsArray,
  ...vars: Vars
): TemplateFn<Vars> {
  return (ctx: Context<Vars>) =>
    vars.reduce<string>(
      // @ts-expect-error type of `v` loses specificity during iteration
      (acc, v, i) => acc + v.stringify(v._extract(ctx)) + strings[i + 1],
      strings[0],
    );
}

/**
 * Variable creator for boolean values.
 * ```ts
 * const template = typelit`The switch is ${typelit.boolean("enabled")}`
 * template({ enabled: true }) // "The switch is true"
 * ```
 */
typelit.boolean = createType<boolean>();

/**
 * Variable creator for string values.
 * ```ts
 * const template = typelit`Hello ${typelit.string("name")}!`
 * template({ name: "Alice" }) // "Hello Alice!"
 * ```
 */
typelit.string = createType<string>();

/**
 * Variable creator for number values.
 * ```ts
 * const template = typelit`You are number ${typelit.number("position")} in line`
 * template({ position: 3 }) // "You are number 3 in line"
 * ```
 */
typelit.number = createType<number>();

/**
 * Variable creator for bigint values.
 * ```ts
 * const template = typelit`Transaction ID: ${typelit.bigint("id")}`
 * template({ id: 123456789n }) // "Transaction ID: 123456789"
 * ```
 */
typelit.bigint = createType<bigint>();

/**
 * Variable creator for Date values.
 *
 * ```ts
 * const template = typelit`Event date: ${typelit.date("eventDate")}`
 * template({ eventDate: new Date("2023-05-15") }) // "Event date: Mon May 15 2023 00:00:00 GMT+0000 (Coordinated Universal Time)"
 * ```
 */
typelit.date = createType<Date>();

/**
 * Variable creator for any value type.
 * Stringifies the value to JSON with 2-space indentation.
 *
 * ```ts
 * const template = typelit`Data: ${typelit.json("data")}`
 * template({ data: { name: "Alice", age: 30 } })
 * // "Data: {
 * //   "name": "Alice",
 * //   "age": 30
 * // }"
 * ```
 */
typelit.json = createType<any>({
  stringify: (obj) => JSON.stringify(obj, null, 2),
});
