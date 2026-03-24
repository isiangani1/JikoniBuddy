
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Helper
 * 
 */
export type Helper = $Result.DefaultSelection<Prisma.$HelperPayload>
/**
 * Model HelperSkill
 * 
 */
export type HelperSkill = $Result.DefaultSelection<Prisma.$HelperSkillPayload>
/**
 * Model HelperAvailability
 * 
 */
export type HelperAvailability = $Result.DefaultSelection<Prisma.$HelperAvailabilityPayload>
/**
 * Model BuddyRequest
 * 
 */
export type BuddyRequest = $Result.DefaultSelection<Prisma.$BuddyRequestPayload>
/**
 * Model BuddyApplication
 * 
 */
export type BuddyApplication = $Result.DefaultSelection<Prisma.$BuddyApplicationPayload>
/**
 * Model BuddyAssignment
 * 
 */
export type BuddyAssignment = $Result.DefaultSelection<Prisma.$BuddyAssignmentPayload>
/**
 * Model Rating
 * 
 */
export type Rating = $Result.DefaultSelection<Prisma.$RatingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const BuddyStatus: {
  pending: 'pending',
  approved: 'approved',
  active: 'active',
  suspended: 'suspended'
};

export type BuddyStatus = (typeof BuddyStatus)[keyof typeof BuddyStatus]


export const TaskType: {
  cooking: 'cooking',
  packaging: 'packaging',
  delivery: 'delivery'
};

export type TaskType = (typeof TaskType)[keyof typeof TaskType]


export const BuddyRequestStatus: {
  open: 'open',
  matched: 'matched',
  confirmed: 'confirmed',
  completed: 'completed'
};

export type BuddyRequestStatus = (typeof BuddyRequestStatus)[keyof typeof BuddyRequestStatus]


export const ApplicationStatus: {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected'
};

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]


export const AssignmentStatus: {
  confirmed: 'confirmed',
  completed: 'completed'
};

export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus]

}

export type BuddyStatus = $Enums.BuddyStatus

export const BuddyStatus: typeof $Enums.BuddyStatus

export type TaskType = $Enums.TaskType

export const TaskType: typeof $Enums.TaskType

export type BuddyRequestStatus = $Enums.BuddyRequestStatus

export const BuddyRequestStatus: typeof $Enums.BuddyRequestStatus

export type ApplicationStatus = $Enums.ApplicationStatus

export const ApplicationStatus: typeof $Enums.ApplicationStatus

export type AssignmentStatus = $Enums.AssignmentStatus

export const AssignmentStatus: typeof $Enums.AssignmentStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Helpers
 * const helpers = await prisma.helper.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Helpers
   * const helpers = await prisma.helper.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.helper`: Exposes CRUD operations for the **Helper** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Helpers
    * const helpers = await prisma.helper.findMany()
    * ```
    */
  get helper(): Prisma.HelperDelegate<ExtArgs>;

  /**
   * `prisma.helperSkill`: Exposes CRUD operations for the **HelperSkill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HelperSkills
    * const helperSkills = await prisma.helperSkill.findMany()
    * ```
    */
  get helperSkill(): Prisma.HelperSkillDelegate<ExtArgs>;

  /**
   * `prisma.helperAvailability`: Exposes CRUD operations for the **HelperAvailability** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HelperAvailabilities
    * const helperAvailabilities = await prisma.helperAvailability.findMany()
    * ```
    */
  get helperAvailability(): Prisma.HelperAvailabilityDelegate<ExtArgs>;

  /**
   * `prisma.buddyRequest`: Exposes CRUD operations for the **BuddyRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BuddyRequests
    * const buddyRequests = await prisma.buddyRequest.findMany()
    * ```
    */
  get buddyRequest(): Prisma.BuddyRequestDelegate<ExtArgs>;

  /**
   * `prisma.buddyApplication`: Exposes CRUD operations for the **BuddyApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BuddyApplications
    * const buddyApplications = await prisma.buddyApplication.findMany()
    * ```
    */
  get buddyApplication(): Prisma.BuddyApplicationDelegate<ExtArgs>;

  /**
   * `prisma.buddyAssignment`: Exposes CRUD operations for the **BuddyAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BuddyAssignments
    * const buddyAssignments = await prisma.buddyAssignment.findMany()
    * ```
    */
  get buddyAssignment(): Prisma.BuddyAssignmentDelegate<ExtArgs>;

  /**
   * `prisma.rating`: Exposes CRUD operations for the **Rating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ratings
    * const ratings = await prisma.rating.findMany()
    * ```
    */
  get rating(): Prisma.RatingDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Helper: 'Helper',
    HelperSkill: 'HelperSkill',
    HelperAvailability: 'HelperAvailability',
    BuddyRequest: 'BuddyRequest',
    BuddyApplication: 'BuddyApplication',
    BuddyAssignment: 'BuddyAssignment',
    Rating: 'Rating'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "helper" | "helperSkill" | "helperAvailability" | "buddyRequest" | "buddyApplication" | "buddyAssignment" | "rating"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Helper: {
        payload: Prisma.$HelperPayload<ExtArgs>
        fields: Prisma.HelperFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HelperFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HelperFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>
          }
          findFirst: {
            args: Prisma.HelperFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HelperFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>
          }
          findMany: {
            args: Prisma.HelperFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>[]
          }
          create: {
            args: Prisma.HelperCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>
          }
          createMany: {
            args: Prisma.HelperCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HelperCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>[]
          }
          delete: {
            args: Prisma.HelperDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>
          }
          update: {
            args: Prisma.HelperUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>
          }
          deleteMany: {
            args: Prisma.HelperDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HelperUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HelperUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperPayload>
          }
          aggregate: {
            args: Prisma.HelperAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHelper>
          }
          groupBy: {
            args: Prisma.HelperGroupByArgs<ExtArgs>
            result: $Utils.Optional<HelperGroupByOutputType>[]
          }
          count: {
            args: Prisma.HelperCountArgs<ExtArgs>
            result: $Utils.Optional<HelperCountAggregateOutputType> | number
          }
        }
      }
      HelperSkill: {
        payload: Prisma.$HelperSkillPayload<ExtArgs>
        fields: Prisma.HelperSkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HelperSkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HelperSkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>
          }
          findFirst: {
            args: Prisma.HelperSkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HelperSkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>
          }
          findMany: {
            args: Prisma.HelperSkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>[]
          }
          create: {
            args: Prisma.HelperSkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>
          }
          createMany: {
            args: Prisma.HelperSkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HelperSkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>[]
          }
          delete: {
            args: Prisma.HelperSkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>
          }
          update: {
            args: Prisma.HelperSkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>
          }
          deleteMany: {
            args: Prisma.HelperSkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HelperSkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HelperSkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperSkillPayload>
          }
          aggregate: {
            args: Prisma.HelperSkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHelperSkill>
          }
          groupBy: {
            args: Prisma.HelperSkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<HelperSkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.HelperSkillCountArgs<ExtArgs>
            result: $Utils.Optional<HelperSkillCountAggregateOutputType> | number
          }
        }
      }
      HelperAvailability: {
        payload: Prisma.$HelperAvailabilityPayload<ExtArgs>
        fields: Prisma.HelperAvailabilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HelperAvailabilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HelperAvailabilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>
          }
          findFirst: {
            args: Prisma.HelperAvailabilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HelperAvailabilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>
          }
          findMany: {
            args: Prisma.HelperAvailabilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>[]
          }
          create: {
            args: Prisma.HelperAvailabilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>
          }
          createMany: {
            args: Prisma.HelperAvailabilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HelperAvailabilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>[]
          }
          delete: {
            args: Prisma.HelperAvailabilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>
          }
          update: {
            args: Prisma.HelperAvailabilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>
          }
          deleteMany: {
            args: Prisma.HelperAvailabilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HelperAvailabilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HelperAvailabilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelperAvailabilityPayload>
          }
          aggregate: {
            args: Prisma.HelperAvailabilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHelperAvailability>
          }
          groupBy: {
            args: Prisma.HelperAvailabilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<HelperAvailabilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.HelperAvailabilityCountArgs<ExtArgs>
            result: $Utils.Optional<HelperAvailabilityCountAggregateOutputType> | number
          }
        }
      }
      BuddyRequest: {
        payload: Prisma.$BuddyRequestPayload<ExtArgs>
        fields: Prisma.BuddyRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BuddyRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BuddyRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>
          }
          findFirst: {
            args: Prisma.BuddyRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BuddyRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>
          }
          findMany: {
            args: Prisma.BuddyRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>[]
          }
          create: {
            args: Prisma.BuddyRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>
          }
          createMany: {
            args: Prisma.BuddyRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BuddyRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>[]
          }
          delete: {
            args: Prisma.BuddyRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>
          }
          update: {
            args: Prisma.BuddyRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>
          }
          deleteMany: {
            args: Prisma.BuddyRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BuddyRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BuddyRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyRequestPayload>
          }
          aggregate: {
            args: Prisma.BuddyRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBuddyRequest>
          }
          groupBy: {
            args: Prisma.BuddyRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<BuddyRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.BuddyRequestCountArgs<ExtArgs>
            result: $Utils.Optional<BuddyRequestCountAggregateOutputType> | number
          }
        }
      }
      BuddyApplication: {
        payload: Prisma.$BuddyApplicationPayload<ExtArgs>
        fields: Prisma.BuddyApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BuddyApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BuddyApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>
          }
          findFirst: {
            args: Prisma.BuddyApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BuddyApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>
          }
          findMany: {
            args: Prisma.BuddyApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>[]
          }
          create: {
            args: Prisma.BuddyApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>
          }
          createMany: {
            args: Prisma.BuddyApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BuddyApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>[]
          }
          delete: {
            args: Prisma.BuddyApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>
          }
          update: {
            args: Prisma.BuddyApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>
          }
          deleteMany: {
            args: Prisma.BuddyApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BuddyApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BuddyApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyApplicationPayload>
          }
          aggregate: {
            args: Prisma.BuddyApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBuddyApplication>
          }
          groupBy: {
            args: Prisma.BuddyApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<BuddyApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.BuddyApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<BuddyApplicationCountAggregateOutputType> | number
          }
        }
      }
      BuddyAssignment: {
        payload: Prisma.$BuddyAssignmentPayload<ExtArgs>
        fields: Prisma.BuddyAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BuddyAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BuddyAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>
          }
          findFirst: {
            args: Prisma.BuddyAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BuddyAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>
          }
          findMany: {
            args: Prisma.BuddyAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>[]
          }
          create: {
            args: Prisma.BuddyAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>
          }
          createMany: {
            args: Prisma.BuddyAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BuddyAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>[]
          }
          delete: {
            args: Prisma.BuddyAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>
          }
          update: {
            args: Prisma.BuddyAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.BuddyAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BuddyAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BuddyAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuddyAssignmentPayload>
          }
          aggregate: {
            args: Prisma.BuddyAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBuddyAssignment>
          }
          groupBy: {
            args: Prisma.BuddyAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<BuddyAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.BuddyAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<BuddyAssignmentCountAggregateOutputType> | number
          }
        }
      }
      Rating: {
        payload: Prisma.$RatingPayload<ExtArgs>
        fields: Prisma.RatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          findFirst: {
            args: Prisma.RatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          findMany: {
            args: Prisma.RatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          create: {
            args: Prisma.RatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          createMany: {
            args: Prisma.RatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RatingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          delete: {
            args: Prisma.RatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          update: {
            args: Prisma.RatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          deleteMany: {
            args: Prisma.RatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          aggregate: {
            args: Prisma.RatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRating>
          }
          groupBy: {
            args: Prisma.RatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<RatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.RatingCountArgs<ExtArgs>
            result: $Utils.Optional<RatingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type HelperCountOutputType
   */

  export type HelperCountOutputType = {
    skills: number
    availability: number
    applications: number
    assignments: number
    ratings: number
  }

  export type HelperCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skills?: boolean | HelperCountOutputTypeCountSkillsArgs
    availability?: boolean | HelperCountOutputTypeCountAvailabilityArgs
    applications?: boolean | HelperCountOutputTypeCountApplicationsArgs
    assignments?: boolean | HelperCountOutputTypeCountAssignmentsArgs
    ratings?: boolean | HelperCountOutputTypeCountRatingsArgs
  }

  // Custom InputTypes
  /**
   * HelperCountOutputType without action
   */
  export type HelperCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperCountOutputType
     */
    select?: HelperCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HelperCountOutputType without action
   */
  export type HelperCountOutputTypeCountSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelperSkillWhereInput
  }

  /**
   * HelperCountOutputType without action
   */
  export type HelperCountOutputTypeCountAvailabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelperAvailabilityWhereInput
  }

  /**
   * HelperCountOutputType without action
   */
  export type HelperCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyApplicationWhereInput
  }

  /**
   * HelperCountOutputType without action
   */
  export type HelperCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyAssignmentWhereInput
  }

  /**
   * HelperCountOutputType without action
   */
  export type HelperCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
  }


  /**
   * Count Type BuddyRequestCountOutputType
   */

  export type BuddyRequestCountOutputType = {
    applications: number
    assignments: number
    ratings: number
  }

  export type BuddyRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | BuddyRequestCountOutputTypeCountApplicationsArgs
    assignments?: boolean | BuddyRequestCountOutputTypeCountAssignmentsArgs
    ratings?: boolean | BuddyRequestCountOutputTypeCountRatingsArgs
  }

  // Custom InputTypes
  /**
   * BuddyRequestCountOutputType without action
   */
  export type BuddyRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequestCountOutputType
     */
    select?: BuddyRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BuddyRequestCountOutputType without action
   */
  export type BuddyRequestCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyApplicationWhereInput
  }

  /**
   * BuddyRequestCountOutputType without action
   */
  export type BuddyRequestCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyAssignmentWhereInput
  }

  /**
   * BuddyRequestCountOutputType without action
   */
  export type BuddyRequestCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Helper
   */

  export type AggregateHelper = {
    _count: HelperCountAggregateOutputType | null
    _avg: HelperAvgAggregateOutputType | null
    _sum: HelperSumAggregateOutputType | null
    _min: HelperMinAggregateOutputType | null
    _max: HelperMaxAggregateOutputType | null
  }

  export type HelperAvgAggregateOutputType = {
    rating: number | null
    lat: number | null
    lng: number | null
    radiusKm: number | null
  }

  export type HelperSumAggregateOutputType = {
    rating: number | null
    lat: number | null
    lng: number | null
    radiusKm: number | null
  }

  export type HelperMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    status: $Enums.BuddyStatus | null
    rating: number | null
    isAvailable: boolean | null
    lat: number | null
    lng: number | null
    locationLabel: string | null
    radiusKm: number | null
    profilePhotoUrl: string | null
    idNumber: string | null
    createdAt: Date | null
  }

  export type HelperMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    status: $Enums.BuddyStatus | null
    rating: number | null
    isAvailable: boolean | null
    lat: number | null
    lng: number | null
    locationLabel: string | null
    radiusKm: number | null
    profilePhotoUrl: string | null
    idNumber: string | null
    createdAt: Date | null
  }

  export type HelperCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    passwordHash: number
    status: number
    rating: number
    isAvailable: number
    lat: number
    lng: number
    locationLabel: number
    radiusKm: number
    profilePhotoUrl: number
    idNumber: number
    createdAt: number
    _all: number
  }


  export type HelperAvgAggregateInputType = {
    rating?: true
    lat?: true
    lng?: true
    radiusKm?: true
  }

  export type HelperSumAggregateInputType = {
    rating?: true
    lat?: true
    lng?: true
    radiusKm?: true
  }

  export type HelperMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    status?: true
    rating?: true
    isAvailable?: true
    lat?: true
    lng?: true
    locationLabel?: true
    radiusKm?: true
    profilePhotoUrl?: true
    idNumber?: true
    createdAt?: true
  }

  export type HelperMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    status?: true
    rating?: true
    isAvailable?: true
    lat?: true
    lng?: true
    locationLabel?: true
    radiusKm?: true
    profilePhotoUrl?: true
    idNumber?: true
    createdAt?: true
  }

  export type HelperCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    status?: true
    rating?: true
    isAvailable?: true
    lat?: true
    lng?: true
    locationLabel?: true
    radiusKm?: true
    profilePhotoUrl?: true
    idNumber?: true
    createdAt?: true
    _all?: true
  }

  export type HelperAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Helper to aggregate.
     */
    where?: HelperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Helpers to fetch.
     */
    orderBy?: HelperOrderByWithRelationInput | HelperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HelperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Helpers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Helpers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Helpers
    **/
    _count?: true | HelperCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HelperAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HelperSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HelperMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HelperMaxAggregateInputType
  }

  export type GetHelperAggregateType<T extends HelperAggregateArgs> = {
        [P in keyof T & keyof AggregateHelper]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHelper[P]>
      : GetScalarType<T[P], AggregateHelper[P]>
  }




  export type HelperGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelperWhereInput
    orderBy?: HelperOrderByWithAggregationInput | HelperOrderByWithAggregationInput[]
    by: HelperScalarFieldEnum[] | HelperScalarFieldEnum
    having?: HelperScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HelperCountAggregateInputType | true
    _avg?: HelperAvgAggregateInputType
    _sum?: HelperSumAggregateInputType
    _min?: HelperMinAggregateInputType
    _max?: HelperMaxAggregateInputType
  }

  export type HelperGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status: $Enums.BuddyStatus
    rating: number
    isAvailable: boolean
    lat: number
    lng: number
    locationLabel: string | null
    radiusKm: number | null
    profilePhotoUrl: string | null
    idNumber: string | null
    createdAt: Date
    _count: HelperCountAggregateOutputType | null
    _avg: HelperAvgAggregateOutputType | null
    _sum: HelperSumAggregateOutputType | null
    _min: HelperMinAggregateOutputType | null
    _max: HelperMaxAggregateOutputType | null
  }

  type GetHelperGroupByPayload<T extends HelperGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HelperGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HelperGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HelperGroupByOutputType[P]>
            : GetScalarType<T[P], HelperGroupByOutputType[P]>
        }
      >
    >


  export type HelperSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    status?: boolean
    rating?: boolean
    isAvailable?: boolean
    lat?: boolean
    lng?: boolean
    locationLabel?: boolean
    radiusKm?: boolean
    profilePhotoUrl?: boolean
    idNumber?: boolean
    createdAt?: boolean
    skills?: boolean | Helper$skillsArgs<ExtArgs>
    availability?: boolean | Helper$availabilityArgs<ExtArgs>
    applications?: boolean | Helper$applicationsArgs<ExtArgs>
    assignments?: boolean | Helper$assignmentsArgs<ExtArgs>
    ratings?: boolean | Helper$ratingsArgs<ExtArgs>
    _count?: boolean | HelperCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helper"]>

  export type HelperSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    status?: boolean
    rating?: boolean
    isAvailable?: boolean
    lat?: boolean
    lng?: boolean
    locationLabel?: boolean
    radiusKm?: boolean
    profilePhotoUrl?: boolean
    idNumber?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["helper"]>

  export type HelperSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    status?: boolean
    rating?: boolean
    isAvailable?: boolean
    lat?: boolean
    lng?: boolean
    locationLabel?: boolean
    radiusKm?: boolean
    profilePhotoUrl?: boolean
    idNumber?: boolean
    createdAt?: boolean
  }

  export type HelperInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skills?: boolean | Helper$skillsArgs<ExtArgs>
    availability?: boolean | Helper$availabilityArgs<ExtArgs>
    applications?: boolean | Helper$applicationsArgs<ExtArgs>
    assignments?: boolean | Helper$assignmentsArgs<ExtArgs>
    ratings?: boolean | Helper$ratingsArgs<ExtArgs>
    _count?: boolean | HelperCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HelperIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $HelperPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Helper"
    objects: {
      skills: Prisma.$HelperSkillPayload<ExtArgs>[]
      availability: Prisma.$HelperAvailabilityPayload<ExtArgs>[]
      applications: Prisma.$BuddyApplicationPayload<ExtArgs>[]
      assignments: Prisma.$BuddyAssignmentPayload<ExtArgs>[]
      ratings: Prisma.$RatingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string
      passwordHash: string
      status: $Enums.BuddyStatus
      rating: number
      isAvailable: boolean
      lat: number
      lng: number
      locationLabel: string | null
      radiusKm: number | null
      profilePhotoUrl: string | null
      idNumber: string | null
      createdAt: Date
    }, ExtArgs["result"]["helper"]>
    composites: {}
  }

  type HelperGetPayload<S extends boolean | null | undefined | HelperDefaultArgs> = $Result.GetResult<Prisma.$HelperPayload, S>

  type HelperCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HelperFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HelperCountAggregateInputType | true
    }

  export interface HelperDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Helper'], meta: { name: 'Helper' } }
    /**
     * Find zero or one Helper that matches the filter.
     * @param {HelperFindUniqueArgs} args - Arguments to find a Helper
     * @example
     * // Get one Helper
     * const helper = await prisma.helper.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HelperFindUniqueArgs>(args: SelectSubset<T, HelperFindUniqueArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Helper that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HelperFindUniqueOrThrowArgs} args - Arguments to find a Helper
     * @example
     * // Get one Helper
     * const helper = await prisma.helper.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HelperFindUniqueOrThrowArgs>(args: SelectSubset<T, HelperFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Helper that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperFindFirstArgs} args - Arguments to find a Helper
     * @example
     * // Get one Helper
     * const helper = await prisma.helper.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HelperFindFirstArgs>(args?: SelectSubset<T, HelperFindFirstArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Helper that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperFindFirstOrThrowArgs} args - Arguments to find a Helper
     * @example
     * // Get one Helper
     * const helper = await prisma.helper.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HelperFindFirstOrThrowArgs>(args?: SelectSubset<T, HelperFindFirstOrThrowArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Helpers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Helpers
     * const helpers = await prisma.helper.findMany()
     * 
     * // Get first 10 Helpers
     * const helpers = await prisma.helper.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const helperWithIdOnly = await prisma.helper.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HelperFindManyArgs>(args?: SelectSubset<T, HelperFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Helper.
     * @param {HelperCreateArgs} args - Arguments to create a Helper.
     * @example
     * // Create one Helper
     * const Helper = await prisma.helper.create({
     *   data: {
     *     // ... data to create a Helper
     *   }
     * })
     * 
     */
    create<T extends HelperCreateArgs>(args: SelectSubset<T, HelperCreateArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Helpers.
     * @param {HelperCreateManyArgs} args - Arguments to create many Helpers.
     * @example
     * // Create many Helpers
     * const helper = await prisma.helper.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HelperCreateManyArgs>(args?: SelectSubset<T, HelperCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Helpers and returns the data saved in the database.
     * @param {HelperCreateManyAndReturnArgs} args - Arguments to create many Helpers.
     * @example
     * // Create many Helpers
     * const helper = await prisma.helper.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Helpers and only return the `id`
     * const helperWithIdOnly = await prisma.helper.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HelperCreateManyAndReturnArgs>(args?: SelectSubset<T, HelperCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Helper.
     * @param {HelperDeleteArgs} args - Arguments to delete one Helper.
     * @example
     * // Delete one Helper
     * const Helper = await prisma.helper.delete({
     *   where: {
     *     // ... filter to delete one Helper
     *   }
     * })
     * 
     */
    delete<T extends HelperDeleteArgs>(args: SelectSubset<T, HelperDeleteArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Helper.
     * @param {HelperUpdateArgs} args - Arguments to update one Helper.
     * @example
     * // Update one Helper
     * const helper = await prisma.helper.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HelperUpdateArgs>(args: SelectSubset<T, HelperUpdateArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Helpers.
     * @param {HelperDeleteManyArgs} args - Arguments to filter Helpers to delete.
     * @example
     * // Delete a few Helpers
     * const { count } = await prisma.helper.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HelperDeleteManyArgs>(args?: SelectSubset<T, HelperDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Helpers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Helpers
     * const helper = await prisma.helper.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HelperUpdateManyArgs>(args: SelectSubset<T, HelperUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Helper.
     * @param {HelperUpsertArgs} args - Arguments to update or create a Helper.
     * @example
     * // Update or create a Helper
     * const helper = await prisma.helper.upsert({
     *   create: {
     *     // ... data to create a Helper
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Helper we want to update
     *   }
     * })
     */
    upsert<T extends HelperUpsertArgs>(args: SelectSubset<T, HelperUpsertArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Helpers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperCountArgs} args - Arguments to filter Helpers to count.
     * @example
     * // Count the number of Helpers
     * const count = await prisma.helper.count({
     *   where: {
     *     // ... the filter for the Helpers we want to count
     *   }
     * })
    **/
    count<T extends HelperCountArgs>(
      args?: Subset<T, HelperCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HelperCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Helper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HelperAggregateArgs>(args: Subset<T, HelperAggregateArgs>): Prisma.PrismaPromise<GetHelperAggregateType<T>>

    /**
     * Group by Helper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HelperGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HelperGroupByArgs['orderBy'] }
        : { orderBy?: HelperGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HelperGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHelperGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Helper model
   */
  readonly fields: HelperFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Helper.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HelperClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skills<T extends Helper$skillsArgs<ExtArgs> = {}>(args?: Subset<T, Helper$skillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "findMany"> | Null>
    availability<T extends Helper$availabilityArgs<ExtArgs> = {}>(args?: Subset<T, Helper$availabilityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "findMany"> | Null>
    applications<T extends Helper$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Helper$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    assignments<T extends Helper$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Helper$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
    ratings<T extends Helper$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, Helper$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Helper model
   */ 
  interface HelperFieldRefs {
    readonly id: FieldRef<"Helper", 'String'>
    readonly name: FieldRef<"Helper", 'String'>
    readonly email: FieldRef<"Helper", 'String'>
    readonly phone: FieldRef<"Helper", 'String'>
    readonly passwordHash: FieldRef<"Helper", 'String'>
    readonly status: FieldRef<"Helper", 'BuddyStatus'>
    readonly rating: FieldRef<"Helper", 'Float'>
    readonly isAvailable: FieldRef<"Helper", 'Boolean'>
    readonly lat: FieldRef<"Helper", 'Float'>
    readonly lng: FieldRef<"Helper", 'Float'>
    readonly locationLabel: FieldRef<"Helper", 'String'>
    readonly radiusKm: FieldRef<"Helper", 'Float'>
    readonly profilePhotoUrl: FieldRef<"Helper", 'String'>
    readonly idNumber: FieldRef<"Helper", 'String'>
    readonly createdAt: FieldRef<"Helper", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Helper findUnique
   */
  export type HelperFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * Filter, which Helper to fetch.
     */
    where: HelperWhereUniqueInput
  }

  /**
   * Helper findUniqueOrThrow
   */
  export type HelperFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * Filter, which Helper to fetch.
     */
    where: HelperWhereUniqueInput
  }

  /**
   * Helper findFirst
   */
  export type HelperFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * Filter, which Helper to fetch.
     */
    where?: HelperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Helpers to fetch.
     */
    orderBy?: HelperOrderByWithRelationInput | HelperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Helpers.
     */
    cursor?: HelperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Helpers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Helpers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Helpers.
     */
    distinct?: HelperScalarFieldEnum | HelperScalarFieldEnum[]
  }

  /**
   * Helper findFirstOrThrow
   */
  export type HelperFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * Filter, which Helper to fetch.
     */
    where?: HelperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Helpers to fetch.
     */
    orderBy?: HelperOrderByWithRelationInput | HelperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Helpers.
     */
    cursor?: HelperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Helpers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Helpers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Helpers.
     */
    distinct?: HelperScalarFieldEnum | HelperScalarFieldEnum[]
  }

  /**
   * Helper findMany
   */
  export type HelperFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * Filter, which Helpers to fetch.
     */
    where?: HelperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Helpers to fetch.
     */
    orderBy?: HelperOrderByWithRelationInput | HelperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Helpers.
     */
    cursor?: HelperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Helpers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Helpers.
     */
    skip?: number
    distinct?: HelperScalarFieldEnum | HelperScalarFieldEnum[]
  }

  /**
   * Helper create
   */
  export type HelperCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * The data needed to create a Helper.
     */
    data: XOR<HelperCreateInput, HelperUncheckedCreateInput>
  }

  /**
   * Helper createMany
   */
  export type HelperCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Helpers.
     */
    data: HelperCreateManyInput | HelperCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Helper createManyAndReturn
   */
  export type HelperCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Helpers.
     */
    data: HelperCreateManyInput | HelperCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Helper update
   */
  export type HelperUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * The data needed to update a Helper.
     */
    data: XOR<HelperUpdateInput, HelperUncheckedUpdateInput>
    /**
     * Choose, which Helper to update.
     */
    where: HelperWhereUniqueInput
  }

  /**
   * Helper updateMany
   */
  export type HelperUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Helpers.
     */
    data: XOR<HelperUpdateManyMutationInput, HelperUncheckedUpdateManyInput>
    /**
     * Filter which Helpers to update
     */
    where?: HelperWhereInput
  }

  /**
   * Helper upsert
   */
  export type HelperUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * The filter to search for the Helper to update in case it exists.
     */
    where: HelperWhereUniqueInput
    /**
     * In case the Helper found by the `where` argument doesn't exist, create a new Helper with this data.
     */
    create: XOR<HelperCreateInput, HelperUncheckedCreateInput>
    /**
     * In case the Helper was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HelperUpdateInput, HelperUncheckedUpdateInput>
  }

  /**
   * Helper delete
   */
  export type HelperDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
    /**
     * Filter which Helper to delete.
     */
    where: HelperWhereUniqueInput
  }

  /**
   * Helper deleteMany
   */
  export type HelperDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Helpers to delete
     */
    where?: HelperWhereInput
  }

  /**
   * Helper.skills
   */
  export type Helper$skillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    where?: HelperSkillWhereInput
    orderBy?: HelperSkillOrderByWithRelationInput | HelperSkillOrderByWithRelationInput[]
    cursor?: HelperSkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HelperSkillScalarFieldEnum | HelperSkillScalarFieldEnum[]
  }

  /**
   * Helper.availability
   */
  export type Helper$availabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    where?: HelperAvailabilityWhereInput
    orderBy?: HelperAvailabilityOrderByWithRelationInput | HelperAvailabilityOrderByWithRelationInput[]
    cursor?: HelperAvailabilityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HelperAvailabilityScalarFieldEnum | HelperAvailabilityScalarFieldEnum[]
  }

  /**
   * Helper.applications
   */
  export type Helper$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    where?: BuddyApplicationWhereInput
    orderBy?: BuddyApplicationOrderByWithRelationInput | BuddyApplicationOrderByWithRelationInput[]
    cursor?: BuddyApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuddyApplicationScalarFieldEnum | BuddyApplicationScalarFieldEnum[]
  }

  /**
   * Helper.assignments
   */
  export type Helper$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    where?: BuddyAssignmentWhereInput
    orderBy?: BuddyAssignmentOrderByWithRelationInput | BuddyAssignmentOrderByWithRelationInput[]
    cursor?: BuddyAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuddyAssignmentScalarFieldEnum | BuddyAssignmentScalarFieldEnum[]
  }

  /**
   * Helper.ratings
   */
  export type Helper$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    cursor?: RatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Helper without action
   */
  export type HelperDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Helper
     */
    select?: HelperSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperInclude<ExtArgs> | null
  }


  /**
   * Model HelperSkill
   */

  export type AggregateHelperSkill = {
    _count: HelperSkillCountAggregateOutputType | null
    _min: HelperSkillMinAggregateOutputType | null
    _max: HelperSkillMaxAggregateOutputType | null
  }

  export type HelperSkillMinAggregateOutputType = {
    id: string | null
    helperId: string | null
    taskType: $Enums.TaskType | null
  }

  export type HelperSkillMaxAggregateOutputType = {
    id: string | null
    helperId: string | null
    taskType: $Enums.TaskType | null
  }

  export type HelperSkillCountAggregateOutputType = {
    id: number
    helperId: number
    taskType: number
    _all: number
  }


  export type HelperSkillMinAggregateInputType = {
    id?: true
    helperId?: true
    taskType?: true
  }

  export type HelperSkillMaxAggregateInputType = {
    id?: true
    helperId?: true
    taskType?: true
  }

  export type HelperSkillCountAggregateInputType = {
    id?: true
    helperId?: true
    taskType?: true
    _all?: true
  }

  export type HelperSkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelperSkill to aggregate.
     */
    where?: HelperSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperSkills to fetch.
     */
    orderBy?: HelperSkillOrderByWithRelationInput | HelperSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HelperSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HelperSkills
    **/
    _count?: true | HelperSkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HelperSkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HelperSkillMaxAggregateInputType
  }

  export type GetHelperSkillAggregateType<T extends HelperSkillAggregateArgs> = {
        [P in keyof T & keyof AggregateHelperSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHelperSkill[P]>
      : GetScalarType<T[P], AggregateHelperSkill[P]>
  }




  export type HelperSkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelperSkillWhereInput
    orderBy?: HelperSkillOrderByWithAggregationInput | HelperSkillOrderByWithAggregationInput[]
    by: HelperSkillScalarFieldEnum[] | HelperSkillScalarFieldEnum
    having?: HelperSkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HelperSkillCountAggregateInputType | true
    _min?: HelperSkillMinAggregateInputType
    _max?: HelperSkillMaxAggregateInputType
  }

  export type HelperSkillGroupByOutputType = {
    id: string
    helperId: string
    taskType: $Enums.TaskType
    _count: HelperSkillCountAggregateOutputType | null
    _min: HelperSkillMinAggregateOutputType | null
    _max: HelperSkillMaxAggregateOutputType | null
  }

  type GetHelperSkillGroupByPayload<T extends HelperSkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HelperSkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HelperSkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HelperSkillGroupByOutputType[P]>
            : GetScalarType<T[P], HelperSkillGroupByOutputType[P]>
        }
      >
    >


  export type HelperSkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helperId?: boolean
    taskType?: boolean
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helperSkill"]>

  export type HelperSkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helperId?: boolean
    taskType?: boolean
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helperSkill"]>

  export type HelperSkillSelectScalar = {
    id?: boolean
    helperId?: boolean
    taskType?: boolean
  }

  export type HelperSkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }
  export type HelperSkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }

  export type $HelperSkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HelperSkill"
    objects: {
      helper: Prisma.$HelperPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      helperId: string
      taskType: $Enums.TaskType
    }, ExtArgs["result"]["helperSkill"]>
    composites: {}
  }

  type HelperSkillGetPayload<S extends boolean | null | undefined | HelperSkillDefaultArgs> = $Result.GetResult<Prisma.$HelperSkillPayload, S>

  type HelperSkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HelperSkillFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HelperSkillCountAggregateInputType | true
    }

  export interface HelperSkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HelperSkill'], meta: { name: 'HelperSkill' } }
    /**
     * Find zero or one HelperSkill that matches the filter.
     * @param {HelperSkillFindUniqueArgs} args - Arguments to find a HelperSkill
     * @example
     * // Get one HelperSkill
     * const helperSkill = await prisma.helperSkill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HelperSkillFindUniqueArgs>(args: SelectSubset<T, HelperSkillFindUniqueArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HelperSkill that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HelperSkillFindUniqueOrThrowArgs} args - Arguments to find a HelperSkill
     * @example
     * // Get one HelperSkill
     * const helperSkill = await prisma.helperSkill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HelperSkillFindUniqueOrThrowArgs>(args: SelectSubset<T, HelperSkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HelperSkill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillFindFirstArgs} args - Arguments to find a HelperSkill
     * @example
     * // Get one HelperSkill
     * const helperSkill = await prisma.helperSkill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HelperSkillFindFirstArgs>(args?: SelectSubset<T, HelperSkillFindFirstArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HelperSkill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillFindFirstOrThrowArgs} args - Arguments to find a HelperSkill
     * @example
     * // Get one HelperSkill
     * const helperSkill = await prisma.helperSkill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HelperSkillFindFirstOrThrowArgs>(args?: SelectSubset<T, HelperSkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HelperSkills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HelperSkills
     * const helperSkills = await prisma.helperSkill.findMany()
     * 
     * // Get first 10 HelperSkills
     * const helperSkills = await prisma.helperSkill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const helperSkillWithIdOnly = await prisma.helperSkill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HelperSkillFindManyArgs>(args?: SelectSubset<T, HelperSkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HelperSkill.
     * @param {HelperSkillCreateArgs} args - Arguments to create a HelperSkill.
     * @example
     * // Create one HelperSkill
     * const HelperSkill = await prisma.helperSkill.create({
     *   data: {
     *     // ... data to create a HelperSkill
     *   }
     * })
     * 
     */
    create<T extends HelperSkillCreateArgs>(args: SelectSubset<T, HelperSkillCreateArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HelperSkills.
     * @param {HelperSkillCreateManyArgs} args - Arguments to create many HelperSkills.
     * @example
     * // Create many HelperSkills
     * const helperSkill = await prisma.helperSkill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HelperSkillCreateManyArgs>(args?: SelectSubset<T, HelperSkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HelperSkills and returns the data saved in the database.
     * @param {HelperSkillCreateManyAndReturnArgs} args - Arguments to create many HelperSkills.
     * @example
     * // Create many HelperSkills
     * const helperSkill = await prisma.helperSkill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HelperSkills and only return the `id`
     * const helperSkillWithIdOnly = await prisma.helperSkill.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HelperSkillCreateManyAndReturnArgs>(args?: SelectSubset<T, HelperSkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HelperSkill.
     * @param {HelperSkillDeleteArgs} args - Arguments to delete one HelperSkill.
     * @example
     * // Delete one HelperSkill
     * const HelperSkill = await prisma.helperSkill.delete({
     *   where: {
     *     // ... filter to delete one HelperSkill
     *   }
     * })
     * 
     */
    delete<T extends HelperSkillDeleteArgs>(args: SelectSubset<T, HelperSkillDeleteArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HelperSkill.
     * @param {HelperSkillUpdateArgs} args - Arguments to update one HelperSkill.
     * @example
     * // Update one HelperSkill
     * const helperSkill = await prisma.helperSkill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HelperSkillUpdateArgs>(args: SelectSubset<T, HelperSkillUpdateArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HelperSkills.
     * @param {HelperSkillDeleteManyArgs} args - Arguments to filter HelperSkills to delete.
     * @example
     * // Delete a few HelperSkills
     * const { count } = await prisma.helperSkill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HelperSkillDeleteManyArgs>(args?: SelectSubset<T, HelperSkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HelperSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HelperSkills
     * const helperSkill = await prisma.helperSkill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HelperSkillUpdateManyArgs>(args: SelectSubset<T, HelperSkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HelperSkill.
     * @param {HelperSkillUpsertArgs} args - Arguments to update or create a HelperSkill.
     * @example
     * // Update or create a HelperSkill
     * const helperSkill = await prisma.helperSkill.upsert({
     *   create: {
     *     // ... data to create a HelperSkill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HelperSkill we want to update
     *   }
     * })
     */
    upsert<T extends HelperSkillUpsertArgs>(args: SelectSubset<T, HelperSkillUpsertArgs<ExtArgs>>): Prisma__HelperSkillClient<$Result.GetResult<Prisma.$HelperSkillPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HelperSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillCountArgs} args - Arguments to filter HelperSkills to count.
     * @example
     * // Count the number of HelperSkills
     * const count = await prisma.helperSkill.count({
     *   where: {
     *     // ... the filter for the HelperSkills we want to count
     *   }
     * })
    **/
    count<T extends HelperSkillCountArgs>(
      args?: Subset<T, HelperSkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HelperSkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HelperSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HelperSkillAggregateArgs>(args: Subset<T, HelperSkillAggregateArgs>): Prisma.PrismaPromise<GetHelperSkillAggregateType<T>>

    /**
     * Group by HelperSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperSkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HelperSkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HelperSkillGroupByArgs['orderBy'] }
        : { orderBy?: HelperSkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HelperSkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHelperSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HelperSkill model
   */
  readonly fields: HelperSkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HelperSkill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HelperSkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    helper<T extends HelperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HelperDefaultArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HelperSkill model
   */ 
  interface HelperSkillFieldRefs {
    readonly id: FieldRef<"HelperSkill", 'String'>
    readonly helperId: FieldRef<"HelperSkill", 'String'>
    readonly taskType: FieldRef<"HelperSkill", 'TaskType'>
  }
    

  // Custom InputTypes
  /**
   * HelperSkill findUnique
   */
  export type HelperSkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * Filter, which HelperSkill to fetch.
     */
    where: HelperSkillWhereUniqueInput
  }

  /**
   * HelperSkill findUniqueOrThrow
   */
  export type HelperSkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * Filter, which HelperSkill to fetch.
     */
    where: HelperSkillWhereUniqueInput
  }

  /**
   * HelperSkill findFirst
   */
  export type HelperSkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * Filter, which HelperSkill to fetch.
     */
    where?: HelperSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperSkills to fetch.
     */
    orderBy?: HelperSkillOrderByWithRelationInput | HelperSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelperSkills.
     */
    cursor?: HelperSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelperSkills.
     */
    distinct?: HelperSkillScalarFieldEnum | HelperSkillScalarFieldEnum[]
  }

  /**
   * HelperSkill findFirstOrThrow
   */
  export type HelperSkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * Filter, which HelperSkill to fetch.
     */
    where?: HelperSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperSkills to fetch.
     */
    orderBy?: HelperSkillOrderByWithRelationInput | HelperSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelperSkills.
     */
    cursor?: HelperSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelperSkills.
     */
    distinct?: HelperSkillScalarFieldEnum | HelperSkillScalarFieldEnum[]
  }

  /**
   * HelperSkill findMany
   */
  export type HelperSkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * Filter, which HelperSkills to fetch.
     */
    where?: HelperSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperSkills to fetch.
     */
    orderBy?: HelperSkillOrderByWithRelationInput | HelperSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HelperSkills.
     */
    cursor?: HelperSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperSkills.
     */
    skip?: number
    distinct?: HelperSkillScalarFieldEnum | HelperSkillScalarFieldEnum[]
  }

  /**
   * HelperSkill create
   */
  export type HelperSkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * The data needed to create a HelperSkill.
     */
    data: XOR<HelperSkillCreateInput, HelperSkillUncheckedCreateInput>
  }

  /**
   * HelperSkill createMany
   */
  export type HelperSkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HelperSkills.
     */
    data: HelperSkillCreateManyInput | HelperSkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HelperSkill createManyAndReturn
   */
  export type HelperSkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HelperSkills.
     */
    data: HelperSkillCreateManyInput | HelperSkillCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HelperSkill update
   */
  export type HelperSkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * The data needed to update a HelperSkill.
     */
    data: XOR<HelperSkillUpdateInput, HelperSkillUncheckedUpdateInput>
    /**
     * Choose, which HelperSkill to update.
     */
    where: HelperSkillWhereUniqueInput
  }

  /**
   * HelperSkill updateMany
   */
  export type HelperSkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HelperSkills.
     */
    data: XOR<HelperSkillUpdateManyMutationInput, HelperSkillUncheckedUpdateManyInput>
    /**
     * Filter which HelperSkills to update
     */
    where?: HelperSkillWhereInput
  }

  /**
   * HelperSkill upsert
   */
  export type HelperSkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * The filter to search for the HelperSkill to update in case it exists.
     */
    where: HelperSkillWhereUniqueInput
    /**
     * In case the HelperSkill found by the `where` argument doesn't exist, create a new HelperSkill with this data.
     */
    create: XOR<HelperSkillCreateInput, HelperSkillUncheckedCreateInput>
    /**
     * In case the HelperSkill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HelperSkillUpdateInput, HelperSkillUncheckedUpdateInput>
  }

  /**
   * HelperSkill delete
   */
  export type HelperSkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
    /**
     * Filter which HelperSkill to delete.
     */
    where: HelperSkillWhereUniqueInput
  }

  /**
   * HelperSkill deleteMany
   */
  export type HelperSkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelperSkills to delete
     */
    where?: HelperSkillWhereInput
  }

  /**
   * HelperSkill without action
   */
  export type HelperSkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperSkill
     */
    select?: HelperSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperSkillInclude<ExtArgs> | null
  }


  /**
   * Model HelperAvailability
   */

  export type AggregateHelperAvailability = {
    _count: HelperAvailabilityCountAggregateOutputType | null
    _avg: HelperAvailabilityAvgAggregateOutputType | null
    _sum: HelperAvailabilitySumAggregateOutputType | null
    _min: HelperAvailabilityMinAggregateOutputType | null
    _max: HelperAvailabilityMaxAggregateOutputType | null
  }

  export type HelperAvailabilityAvgAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type HelperAvailabilitySumAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type HelperAvailabilityMinAggregateOutputType = {
    id: string | null
    helperId: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
  }

  export type HelperAvailabilityMaxAggregateOutputType = {
    id: string | null
    helperId: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
  }

  export type HelperAvailabilityCountAggregateOutputType = {
    id: number
    helperId: number
    dayOfWeek: number
    startTime: number
    endTime: number
    _all: number
  }


  export type HelperAvailabilityAvgAggregateInputType = {
    dayOfWeek?: true
  }

  export type HelperAvailabilitySumAggregateInputType = {
    dayOfWeek?: true
  }

  export type HelperAvailabilityMinAggregateInputType = {
    id?: true
    helperId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
  }

  export type HelperAvailabilityMaxAggregateInputType = {
    id?: true
    helperId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
  }

  export type HelperAvailabilityCountAggregateInputType = {
    id?: true
    helperId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    _all?: true
  }

  export type HelperAvailabilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelperAvailability to aggregate.
     */
    where?: HelperAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperAvailabilities to fetch.
     */
    orderBy?: HelperAvailabilityOrderByWithRelationInput | HelperAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HelperAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HelperAvailabilities
    **/
    _count?: true | HelperAvailabilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HelperAvailabilityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HelperAvailabilitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HelperAvailabilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HelperAvailabilityMaxAggregateInputType
  }

  export type GetHelperAvailabilityAggregateType<T extends HelperAvailabilityAggregateArgs> = {
        [P in keyof T & keyof AggregateHelperAvailability]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHelperAvailability[P]>
      : GetScalarType<T[P], AggregateHelperAvailability[P]>
  }




  export type HelperAvailabilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelperAvailabilityWhereInput
    orderBy?: HelperAvailabilityOrderByWithAggregationInput | HelperAvailabilityOrderByWithAggregationInput[]
    by: HelperAvailabilityScalarFieldEnum[] | HelperAvailabilityScalarFieldEnum
    having?: HelperAvailabilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HelperAvailabilityCountAggregateInputType | true
    _avg?: HelperAvailabilityAvgAggregateInputType
    _sum?: HelperAvailabilitySumAggregateInputType
    _min?: HelperAvailabilityMinAggregateInputType
    _max?: HelperAvailabilityMaxAggregateInputType
  }

  export type HelperAvailabilityGroupByOutputType = {
    id: string
    helperId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    _count: HelperAvailabilityCountAggregateOutputType | null
    _avg: HelperAvailabilityAvgAggregateOutputType | null
    _sum: HelperAvailabilitySumAggregateOutputType | null
    _min: HelperAvailabilityMinAggregateOutputType | null
    _max: HelperAvailabilityMaxAggregateOutputType | null
  }

  type GetHelperAvailabilityGroupByPayload<T extends HelperAvailabilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HelperAvailabilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HelperAvailabilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HelperAvailabilityGroupByOutputType[P]>
            : GetScalarType<T[P], HelperAvailabilityGroupByOutputType[P]>
        }
      >
    >


  export type HelperAvailabilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helperId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helperAvailability"]>

  export type HelperAvailabilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helperId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helperAvailability"]>

  export type HelperAvailabilitySelectScalar = {
    id?: boolean
    helperId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
  }

  export type HelperAvailabilityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }
  export type HelperAvailabilityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }

  export type $HelperAvailabilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HelperAvailability"
    objects: {
      helper: Prisma.$HelperPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      helperId: string
      dayOfWeek: number
      startTime: string
      endTime: string
    }, ExtArgs["result"]["helperAvailability"]>
    composites: {}
  }

  type HelperAvailabilityGetPayload<S extends boolean | null | undefined | HelperAvailabilityDefaultArgs> = $Result.GetResult<Prisma.$HelperAvailabilityPayload, S>

  type HelperAvailabilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HelperAvailabilityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HelperAvailabilityCountAggregateInputType | true
    }

  export interface HelperAvailabilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HelperAvailability'], meta: { name: 'HelperAvailability' } }
    /**
     * Find zero or one HelperAvailability that matches the filter.
     * @param {HelperAvailabilityFindUniqueArgs} args - Arguments to find a HelperAvailability
     * @example
     * // Get one HelperAvailability
     * const helperAvailability = await prisma.helperAvailability.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HelperAvailabilityFindUniqueArgs>(args: SelectSubset<T, HelperAvailabilityFindUniqueArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HelperAvailability that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HelperAvailabilityFindUniqueOrThrowArgs} args - Arguments to find a HelperAvailability
     * @example
     * // Get one HelperAvailability
     * const helperAvailability = await prisma.helperAvailability.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HelperAvailabilityFindUniqueOrThrowArgs>(args: SelectSubset<T, HelperAvailabilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HelperAvailability that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityFindFirstArgs} args - Arguments to find a HelperAvailability
     * @example
     * // Get one HelperAvailability
     * const helperAvailability = await prisma.helperAvailability.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HelperAvailabilityFindFirstArgs>(args?: SelectSubset<T, HelperAvailabilityFindFirstArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HelperAvailability that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityFindFirstOrThrowArgs} args - Arguments to find a HelperAvailability
     * @example
     * // Get one HelperAvailability
     * const helperAvailability = await prisma.helperAvailability.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HelperAvailabilityFindFirstOrThrowArgs>(args?: SelectSubset<T, HelperAvailabilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HelperAvailabilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HelperAvailabilities
     * const helperAvailabilities = await prisma.helperAvailability.findMany()
     * 
     * // Get first 10 HelperAvailabilities
     * const helperAvailabilities = await prisma.helperAvailability.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const helperAvailabilityWithIdOnly = await prisma.helperAvailability.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HelperAvailabilityFindManyArgs>(args?: SelectSubset<T, HelperAvailabilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HelperAvailability.
     * @param {HelperAvailabilityCreateArgs} args - Arguments to create a HelperAvailability.
     * @example
     * // Create one HelperAvailability
     * const HelperAvailability = await prisma.helperAvailability.create({
     *   data: {
     *     // ... data to create a HelperAvailability
     *   }
     * })
     * 
     */
    create<T extends HelperAvailabilityCreateArgs>(args: SelectSubset<T, HelperAvailabilityCreateArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HelperAvailabilities.
     * @param {HelperAvailabilityCreateManyArgs} args - Arguments to create many HelperAvailabilities.
     * @example
     * // Create many HelperAvailabilities
     * const helperAvailability = await prisma.helperAvailability.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HelperAvailabilityCreateManyArgs>(args?: SelectSubset<T, HelperAvailabilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HelperAvailabilities and returns the data saved in the database.
     * @param {HelperAvailabilityCreateManyAndReturnArgs} args - Arguments to create many HelperAvailabilities.
     * @example
     * // Create many HelperAvailabilities
     * const helperAvailability = await prisma.helperAvailability.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HelperAvailabilities and only return the `id`
     * const helperAvailabilityWithIdOnly = await prisma.helperAvailability.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HelperAvailabilityCreateManyAndReturnArgs>(args?: SelectSubset<T, HelperAvailabilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HelperAvailability.
     * @param {HelperAvailabilityDeleteArgs} args - Arguments to delete one HelperAvailability.
     * @example
     * // Delete one HelperAvailability
     * const HelperAvailability = await prisma.helperAvailability.delete({
     *   where: {
     *     // ... filter to delete one HelperAvailability
     *   }
     * })
     * 
     */
    delete<T extends HelperAvailabilityDeleteArgs>(args: SelectSubset<T, HelperAvailabilityDeleteArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HelperAvailability.
     * @param {HelperAvailabilityUpdateArgs} args - Arguments to update one HelperAvailability.
     * @example
     * // Update one HelperAvailability
     * const helperAvailability = await prisma.helperAvailability.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HelperAvailabilityUpdateArgs>(args: SelectSubset<T, HelperAvailabilityUpdateArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HelperAvailabilities.
     * @param {HelperAvailabilityDeleteManyArgs} args - Arguments to filter HelperAvailabilities to delete.
     * @example
     * // Delete a few HelperAvailabilities
     * const { count } = await prisma.helperAvailability.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HelperAvailabilityDeleteManyArgs>(args?: SelectSubset<T, HelperAvailabilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HelperAvailabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HelperAvailabilities
     * const helperAvailability = await prisma.helperAvailability.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HelperAvailabilityUpdateManyArgs>(args: SelectSubset<T, HelperAvailabilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HelperAvailability.
     * @param {HelperAvailabilityUpsertArgs} args - Arguments to update or create a HelperAvailability.
     * @example
     * // Update or create a HelperAvailability
     * const helperAvailability = await prisma.helperAvailability.upsert({
     *   create: {
     *     // ... data to create a HelperAvailability
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HelperAvailability we want to update
     *   }
     * })
     */
    upsert<T extends HelperAvailabilityUpsertArgs>(args: SelectSubset<T, HelperAvailabilityUpsertArgs<ExtArgs>>): Prisma__HelperAvailabilityClient<$Result.GetResult<Prisma.$HelperAvailabilityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HelperAvailabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityCountArgs} args - Arguments to filter HelperAvailabilities to count.
     * @example
     * // Count the number of HelperAvailabilities
     * const count = await prisma.helperAvailability.count({
     *   where: {
     *     // ... the filter for the HelperAvailabilities we want to count
     *   }
     * })
    **/
    count<T extends HelperAvailabilityCountArgs>(
      args?: Subset<T, HelperAvailabilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HelperAvailabilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HelperAvailability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HelperAvailabilityAggregateArgs>(args: Subset<T, HelperAvailabilityAggregateArgs>): Prisma.PrismaPromise<GetHelperAvailabilityAggregateType<T>>

    /**
     * Group by HelperAvailability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelperAvailabilityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HelperAvailabilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HelperAvailabilityGroupByArgs['orderBy'] }
        : { orderBy?: HelperAvailabilityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HelperAvailabilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHelperAvailabilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HelperAvailability model
   */
  readonly fields: HelperAvailabilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HelperAvailability.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HelperAvailabilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    helper<T extends HelperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HelperDefaultArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HelperAvailability model
   */ 
  interface HelperAvailabilityFieldRefs {
    readonly id: FieldRef<"HelperAvailability", 'String'>
    readonly helperId: FieldRef<"HelperAvailability", 'String'>
    readonly dayOfWeek: FieldRef<"HelperAvailability", 'Int'>
    readonly startTime: FieldRef<"HelperAvailability", 'String'>
    readonly endTime: FieldRef<"HelperAvailability", 'String'>
  }
    

  // Custom InputTypes
  /**
   * HelperAvailability findUnique
   */
  export type HelperAvailabilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which HelperAvailability to fetch.
     */
    where: HelperAvailabilityWhereUniqueInput
  }

  /**
   * HelperAvailability findUniqueOrThrow
   */
  export type HelperAvailabilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which HelperAvailability to fetch.
     */
    where: HelperAvailabilityWhereUniqueInput
  }

  /**
   * HelperAvailability findFirst
   */
  export type HelperAvailabilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which HelperAvailability to fetch.
     */
    where?: HelperAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperAvailabilities to fetch.
     */
    orderBy?: HelperAvailabilityOrderByWithRelationInput | HelperAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelperAvailabilities.
     */
    cursor?: HelperAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelperAvailabilities.
     */
    distinct?: HelperAvailabilityScalarFieldEnum | HelperAvailabilityScalarFieldEnum[]
  }

  /**
   * HelperAvailability findFirstOrThrow
   */
  export type HelperAvailabilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which HelperAvailability to fetch.
     */
    where?: HelperAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperAvailabilities to fetch.
     */
    orderBy?: HelperAvailabilityOrderByWithRelationInput | HelperAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelperAvailabilities.
     */
    cursor?: HelperAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelperAvailabilities.
     */
    distinct?: HelperAvailabilityScalarFieldEnum | HelperAvailabilityScalarFieldEnum[]
  }

  /**
   * HelperAvailability findMany
   */
  export type HelperAvailabilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which HelperAvailabilities to fetch.
     */
    where?: HelperAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelperAvailabilities to fetch.
     */
    orderBy?: HelperAvailabilityOrderByWithRelationInput | HelperAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HelperAvailabilities.
     */
    cursor?: HelperAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelperAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelperAvailabilities.
     */
    skip?: number
    distinct?: HelperAvailabilityScalarFieldEnum | HelperAvailabilityScalarFieldEnum[]
  }

  /**
   * HelperAvailability create
   */
  export type HelperAvailabilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * The data needed to create a HelperAvailability.
     */
    data: XOR<HelperAvailabilityCreateInput, HelperAvailabilityUncheckedCreateInput>
  }

  /**
   * HelperAvailability createMany
   */
  export type HelperAvailabilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HelperAvailabilities.
     */
    data: HelperAvailabilityCreateManyInput | HelperAvailabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HelperAvailability createManyAndReturn
   */
  export type HelperAvailabilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HelperAvailabilities.
     */
    data: HelperAvailabilityCreateManyInput | HelperAvailabilityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HelperAvailability update
   */
  export type HelperAvailabilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * The data needed to update a HelperAvailability.
     */
    data: XOR<HelperAvailabilityUpdateInput, HelperAvailabilityUncheckedUpdateInput>
    /**
     * Choose, which HelperAvailability to update.
     */
    where: HelperAvailabilityWhereUniqueInput
  }

  /**
   * HelperAvailability updateMany
   */
  export type HelperAvailabilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HelperAvailabilities.
     */
    data: XOR<HelperAvailabilityUpdateManyMutationInput, HelperAvailabilityUncheckedUpdateManyInput>
    /**
     * Filter which HelperAvailabilities to update
     */
    where?: HelperAvailabilityWhereInput
  }

  /**
   * HelperAvailability upsert
   */
  export type HelperAvailabilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * The filter to search for the HelperAvailability to update in case it exists.
     */
    where: HelperAvailabilityWhereUniqueInput
    /**
     * In case the HelperAvailability found by the `where` argument doesn't exist, create a new HelperAvailability with this data.
     */
    create: XOR<HelperAvailabilityCreateInput, HelperAvailabilityUncheckedCreateInput>
    /**
     * In case the HelperAvailability was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HelperAvailabilityUpdateInput, HelperAvailabilityUncheckedUpdateInput>
  }

  /**
   * HelperAvailability delete
   */
  export type HelperAvailabilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
    /**
     * Filter which HelperAvailability to delete.
     */
    where: HelperAvailabilityWhereUniqueInput
  }

  /**
   * HelperAvailability deleteMany
   */
  export type HelperAvailabilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelperAvailabilities to delete
     */
    where?: HelperAvailabilityWhereInput
  }

  /**
   * HelperAvailability without action
   */
  export type HelperAvailabilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelperAvailability
     */
    select?: HelperAvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelperAvailabilityInclude<ExtArgs> | null
  }


  /**
   * Model BuddyRequest
   */

  export type AggregateBuddyRequest = {
    _count: BuddyRequestCountAggregateOutputType | null
    _avg: BuddyRequestAvgAggregateOutputType | null
    _sum: BuddyRequestSumAggregateOutputType | null
    _min: BuddyRequestMinAggregateOutputType | null
    _max: BuddyRequestMaxAggregateOutputType | null
  }

  export type BuddyRequestAvgAggregateOutputType = {
    lat: number | null
    lng: number | null
    durationHours: number | null
    compensation: number | null
  }

  export type BuddyRequestSumAggregateOutputType = {
    lat: number | null
    lng: number | null
    durationHours: number | null
    compensation: number | null
  }

  export type BuddyRequestMinAggregateOutputType = {
    id: string | null
    sellerId: string | null
    taskType: $Enums.TaskType | null
    locationLabel: string | null
    lat: number | null
    lng: number | null
    startTime: Date | null
    endTime: Date | null
    durationHours: number | null
    compensation: number | null
    status: $Enums.BuddyRequestStatus | null
    createdAt: Date | null
  }

  export type BuddyRequestMaxAggregateOutputType = {
    id: string | null
    sellerId: string | null
    taskType: $Enums.TaskType | null
    locationLabel: string | null
    lat: number | null
    lng: number | null
    startTime: Date | null
    endTime: Date | null
    durationHours: number | null
    compensation: number | null
    status: $Enums.BuddyRequestStatus | null
    createdAt: Date | null
  }

  export type BuddyRequestCountAggregateOutputType = {
    id: number
    sellerId: number
    taskType: number
    locationLabel: number
    lat: number
    lng: number
    startTime: number
    endTime: number
    durationHours: number
    compensation: number
    status: number
    createdAt: number
    _all: number
  }


  export type BuddyRequestAvgAggregateInputType = {
    lat?: true
    lng?: true
    durationHours?: true
    compensation?: true
  }

  export type BuddyRequestSumAggregateInputType = {
    lat?: true
    lng?: true
    durationHours?: true
    compensation?: true
  }

  export type BuddyRequestMinAggregateInputType = {
    id?: true
    sellerId?: true
    taskType?: true
    locationLabel?: true
    lat?: true
    lng?: true
    startTime?: true
    endTime?: true
    durationHours?: true
    compensation?: true
    status?: true
    createdAt?: true
  }

  export type BuddyRequestMaxAggregateInputType = {
    id?: true
    sellerId?: true
    taskType?: true
    locationLabel?: true
    lat?: true
    lng?: true
    startTime?: true
    endTime?: true
    durationHours?: true
    compensation?: true
    status?: true
    createdAt?: true
  }

  export type BuddyRequestCountAggregateInputType = {
    id?: true
    sellerId?: true
    taskType?: true
    locationLabel?: true
    lat?: true
    lng?: true
    startTime?: true
    endTime?: true
    durationHours?: true
    compensation?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type BuddyRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuddyRequest to aggregate.
     */
    where?: BuddyRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyRequests to fetch.
     */
    orderBy?: BuddyRequestOrderByWithRelationInput | BuddyRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BuddyRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BuddyRequests
    **/
    _count?: true | BuddyRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BuddyRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BuddyRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BuddyRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BuddyRequestMaxAggregateInputType
  }

  export type GetBuddyRequestAggregateType<T extends BuddyRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateBuddyRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBuddyRequest[P]>
      : GetScalarType<T[P], AggregateBuddyRequest[P]>
  }




  export type BuddyRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyRequestWhereInput
    orderBy?: BuddyRequestOrderByWithAggregationInput | BuddyRequestOrderByWithAggregationInput[]
    by: BuddyRequestScalarFieldEnum[] | BuddyRequestScalarFieldEnum
    having?: BuddyRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BuddyRequestCountAggregateInputType | true
    _avg?: BuddyRequestAvgAggregateInputType
    _sum?: BuddyRequestSumAggregateInputType
    _min?: BuddyRequestMinAggregateInputType
    _max?: BuddyRequestMaxAggregateInputType
  }

  export type BuddyRequestGroupByOutputType = {
    id: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date
    endTime: Date
    durationHours: number
    compensation: number | null
    status: $Enums.BuddyRequestStatus
    createdAt: Date
    _count: BuddyRequestCountAggregateOutputType | null
    _avg: BuddyRequestAvgAggregateOutputType | null
    _sum: BuddyRequestSumAggregateOutputType | null
    _min: BuddyRequestMinAggregateOutputType | null
    _max: BuddyRequestMaxAggregateOutputType | null
  }

  type GetBuddyRequestGroupByPayload<T extends BuddyRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BuddyRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BuddyRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BuddyRequestGroupByOutputType[P]>
            : GetScalarType<T[P], BuddyRequestGroupByOutputType[P]>
        }
      >
    >


  export type BuddyRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    taskType?: boolean
    locationLabel?: boolean
    lat?: boolean
    lng?: boolean
    startTime?: boolean
    endTime?: boolean
    durationHours?: boolean
    compensation?: boolean
    status?: boolean
    createdAt?: boolean
    applications?: boolean | BuddyRequest$applicationsArgs<ExtArgs>
    assignments?: boolean | BuddyRequest$assignmentsArgs<ExtArgs>
    ratings?: boolean | BuddyRequest$ratingsArgs<ExtArgs>
    _count?: boolean | BuddyRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buddyRequest"]>

  export type BuddyRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    taskType?: boolean
    locationLabel?: boolean
    lat?: boolean
    lng?: boolean
    startTime?: boolean
    endTime?: boolean
    durationHours?: boolean
    compensation?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["buddyRequest"]>

  export type BuddyRequestSelectScalar = {
    id?: boolean
    sellerId?: boolean
    taskType?: boolean
    locationLabel?: boolean
    lat?: boolean
    lng?: boolean
    startTime?: boolean
    endTime?: boolean
    durationHours?: boolean
    compensation?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type BuddyRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | BuddyRequest$applicationsArgs<ExtArgs>
    assignments?: boolean | BuddyRequest$assignmentsArgs<ExtArgs>
    ratings?: boolean | BuddyRequest$ratingsArgs<ExtArgs>
    _count?: boolean | BuddyRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BuddyRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BuddyRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BuddyRequest"
    objects: {
      applications: Prisma.$BuddyApplicationPayload<ExtArgs>[]
      assignments: Prisma.$BuddyAssignmentPayload<ExtArgs>[]
      ratings: Prisma.$RatingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sellerId: string
      taskType: $Enums.TaskType
      locationLabel: string
      lat: number
      lng: number
      startTime: Date
      endTime: Date
      durationHours: number
      compensation: number | null
      status: $Enums.BuddyRequestStatus
      createdAt: Date
    }, ExtArgs["result"]["buddyRequest"]>
    composites: {}
  }

  type BuddyRequestGetPayload<S extends boolean | null | undefined | BuddyRequestDefaultArgs> = $Result.GetResult<Prisma.$BuddyRequestPayload, S>

  type BuddyRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BuddyRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BuddyRequestCountAggregateInputType | true
    }

  export interface BuddyRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BuddyRequest'], meta: { name: 'BuddyRequest' } }
    /**
     * Find zero or one BuddyRequest that matches the filter.
     * @param {BuddyRequestFindUniqueArgs} args - Arguments to find a BuddyRequest
     * @example
     * // Get one BuddyRequest
     * const buddyRequest = await prisma.buddyRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BuddyRequestFindUniqueArgs>(args: SelectSubset<T, BuddyRequestFindUniqueArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BuddyRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BuddyRequestFindUniqueOrThrowArgs} args - Arguments to find a BuddyRequest
     * @example
     * // Get one BuddyRequest
     * const buddyRequest = await prisma.buddyRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BuddyRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, BuddyRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BuddyRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestFindFirstArgs} args - Arguments to find a BuddyRequest
     * @example
     * // Get one BuddyRequest
     * const buddyRequest = await prisma.buddyRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BuddyRequestFindFirstArgs>(args?: SelectSubset<T, BuddyRequestFindFirstArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BuddyRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestFindFirstOrThrowArgs} args - Arguments to find a BuddyRequest
     * @example
     * // Get one BuddyRequest
     * const buddyRequest = await prisma.buddyRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BuddyRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, BuddyRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BuddyRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BuddyRequests
     * const buddyRequests = await prisma.buddyRequest.findMany()
     * 
     * // Get first 10 BuddyRequests
     * const buddyRequests = await prisma.buddyRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const buddyRequestWithIdOnly = await prisma.buddyRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BuddyRequestFindManyArgs>(args?: SelectSubset<T, BuddyRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BuddyRequest.
     * @param {BuddyRequestCreateArgs} args - Arguments to create a BuddyRequest.
     * @example
     * // Create one BuddyRequest
     * const BuddyRequest = await prisma.buddyRequest.create({
     *   data: {
     *     // ... data to create a BuddyRequest
     *   }
     * })
     * 
     */
    create<T extends BuddyRequestCreateArgs>(args: SelectSubset<T, BuddyRequestCreateArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BuddyRequests.
     * @param {BuddyRequestCreateManyArgs} args - Arguments to create many BuddyRequests.
     * @example
     * // Create many BuddyRequests
     * const buddyRequest = await prisma.buddyRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BuddyRequestCreateManyArgs>(args?: SelectSubset<T, BuddyRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BuddyRequests and returns the data saved in the database.
     * @param {BuddyRequestCreateManyAndReturnArgs} args - Arguments to create many BuddyRequests.
     * @example
     * // Create many BuddyRequests
     * const buddyRequest = await prisma.buddyRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BuddyRequests and only return the `id`
     * const buddyRequestWithIdOnly = await prisma.buddyRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BuddyRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, BuddyRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BuddyRequest.
     * @param {BuddyRequestDeleteArgs} args - Arguments to delete one BuddyRequest.
     * @example
     * // Delete one BuddyRequest
     * const BuddyRequest = await prisma.buddyRequest.delete({
     *   where: {
     *     // ... filter to delete one BuddyRequest
     *   }
     * })
     * 
     */
    delete<T extends BuddyRequestDeleteArgs>(args: SelectSubset<T, BuddyRequestDeleteArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BuddyRequest.
     * @param {BuddyRequestUpdateArgs} args - Arguments to update one BuddyRequest.
     * @example
     * // Update one BuddyRequest
     * const buddyRequest = await prisma.buddyRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BuddyRequestUpdateArgs>(args: SelectSubset<T, BuddyRequestUpdateArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BuddyRequests.
     * @param {BuddyRequestDeleteManyArgs} args - Arguments to filter BuddyRequests to delete.
     * @example
     * // Delete a few BuddyRequests
     * const { count } = await prisma.buddyRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BuddyRequestDeleteManyArgs>(args?: SelectSubset<T, BuddyRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuddyRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BuddyRequests
     * const buddyRequest = await prisma.buddyRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BuddyRequestUpdateManyArgs>(args: SelectSubset<T, BuddyRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BuddyRequest.
     * @param {BuddyRequestUpsertArgs} args - Arguments to update or create a BuddyRequest.
     * @example
     * // Update or create a BuddyRequest
     * const buddyRequest = await prisma.buddyRequest.upsert({
     *   create: {
     *     // ... data to create a BuddyRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BuddyRequest we want to update
     *   }
     * })
     */
    upsert<T extends BuddyRequestUpsertArgs>(args: SelectSubset<T, BuddyRequestUpsertArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BuddyRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestCountArgs} args - Arguments to filter BuddyRequests to count.
     * @example
     * // Count the number of BuddyRequests
     * const count = await prisma.buddyRequest.count({
     *   where: {
     *     // ... the filter for the BuddyRequests we want to count
     *   }
     * })
    **/
    count<T extends BuddyRequestCountArgs>(
      args?: Subset<T, BuddyRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BuddyRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BuddyRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BuddyRequestAggregateArgs>(args: Subset<T, BuddyRequestAggregateArgs>): Prisma.PrismaPromise<GetBuddyRequestAggregateType<T>>

    /**
     * Group by BuddyRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BuddyRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BuddyRequestGroupByArgs['orderBy'] }
        : { orderBy?: BuddyRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BuddyRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBuddyRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BuddyRequest model
   */
  readonly fields: BuddyRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BuddyRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BuddyRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends BuddyRequest$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, BuddyRequest$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    assignments<T extends BuddyRequest$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, BuddyRequest$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
    ratings<T extends BuddyRequest$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, BuddyRequest$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BuddyRequest model
   */ 
  interface BuddyRequestFieldRefs {
    readonly id: FieldRef<"BuddyRequest", 'String'>
    readonly sellerId: FieldRef<"BuddyRequest", 'String'>
    readonly taskType: FieldRef<"BuddyRequest", 'TaskType'>
    readonly locationLabel: FieldRef<"BuddyRequest", 'String'>
    readonly lat: FieldRef<"BuddyRequest", 'Float'>
    readonly lng: FieldRef<"BuddyRequest", 'Float'>
    readonly startTime: FieldRef<"BuddyRequest", 'DateTime'>
    readonly endTime: FieldRef<"BuddyRequest", 'DateTime'>
    readonly durationHours: FieldRef<"BuddyRequest", 'Float'>
    readonly compensation: FieldRef<"BuddyRequest", 'Float'>
    readonly status: FieldRef<"BuddyRequest", 'BuddyRequestStatus'>
    readonly createdAt: FieldRef<"BuddyRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BuddyRequest findUnique
   */
  export type BuddyRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * Filter, which BuddyRequest to fetch.
     */
    where: BuddyRequestWhereUniqueInput
  }

  /**
   * BuddyRequest findUniqueOrThrow
   */
  export type BuddyRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * Filter, which BuddyRequest to fetch.
     */
    where: BuddyRequestWhereUniqueInput
  }

  /**
   * BuddyRequest findFirst
   */
  export type BuddyRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * Filter, which BuddyRequest to fetch.
     */
    where?: BuddyRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyRequests to fetch.
     */
    orderBy?: BuddyRequestOrderByWithRelationInput | BuddyRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuddyRequests.
     */
    cursor?: BuddyRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuddyRequests.
     */
    distinct?: BuddyRequestScalarFieldEnum | BuddyRequestScalarFieldEnum[]
  }

  /**
   * BuddyRequest findFirstOrThrow
   */
  export type BuddyRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * Filter, which BuddyRequest to fetch.
     */
    where?: BuddyRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyRequests to fetch.
     */
    orderBy?: BuddyRequestOrderByWithRelationInput | BuddyRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuddyRequests.
     */
    cursor?: BuddyRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuddyRequests.
     */
    distinct?: BuddyRequestScalarFieldEnum | BuddyRequestScalarFieldEnum[]
  }

  /**
   * BuddyRequest findMany
   */
  export type BuddyRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * Filter, which BuddyRequests to fetch.
     */
    where?: BuddyRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyRequests to fetch.
     */
    orderBy?: BuddyRequestOrderByWithRelationInput | BuddyRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BuddyRequests.
     */
    cursor?: BuddyRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyRequests.
     */
    skip?: number
    distinct?: BuddyRequestScalarFieldEnum | BuddyRequestScalarFieldEnum[]
  }

  /**
   * BuddyRequest create
   */
  export type BuddyRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a BuddyRequest.
     */
    data: XOR<BuddyRequestCreateInput, BuddyRequestUncheckedCreateInput>
  }

  /**
   * BuddyRequest createMany
   */
  export type BuddyRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BuddyRequests.
     */
    data: BuddyRequestCreateManyInput | BuddyRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BuddyRequest createManyAndReturn
   */
  export type BuddyRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BuddyRequests.
     */
    data: BuddyRequestCreateManyInput | BuddyRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BuddyRequest update
   */
  export type BuddyRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a BuddyRequest.
     */
    data: XOR<BuddyRequestUpdateInput, BuddyRequestUncheckedUpdateInput>
    /**
     * Choose, which BuddyRequest to update.
     */
    where: BuddyRequestWhereUniqueInput
  }

  /**
   * BuddyRequest updateMany
   */
  export type BuddyRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BuddyRequests.
     */
    data: XOR<BuddyRequestUpdateManyMutationInput, BuddyRequestUncheckedUpdateManyInput>
    /**
     * Filter which BuddyRequests to update
     */
    where?: BuddyRequestWhereInput
  }

  /**
   * BuddyRequest upsert
   */
  export type BuddyRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the BuddyRequest to update in case it exists.
     */
    where: BuddyRequestWhereUniqueInput
    /**
     * In case the BuddyRequest found by the `where` argument doesn't exist, create a new BuddyRequest with this data.
     */
    create: XOR<BuddyRequestCreateInput, BuddyRequestUncheckedCreateInput>
    /**
     * In case the BuddyRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BuddyRequestUpdateInput, BuddyRequestUncheckedUpdateInput>
  }

  /**
   * BuddyRequest delete
   */
  export type BuddyRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
    /**
     * Filter which BuddyRequest to delete.
     */
    where: BuddyRequestWhereUniqueInput
  }

  /**
   * BuddyRequest deleteMany
   */
  export type BuddyRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuddyRequests to delete
     */
    where?: BuddyRequestWhereInput
  }

  /**
   * BuddyRequest.applications
   */
  export type BuddyRequest$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    where?: BuddyApplicationWhereInput
    orderBy?: BuddyApplicationOrderByWithRelationInput | BuddyApplicationOrderByWithRelationInput[]
    cursor?: BuddyApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuddyApplicationScalarFieldEnum | BuddyApplicationScalarFieldEnum[]
  }

  /**
   * BuddyRequest.assignments
   */
  export type BuddyRequest$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    where?: BuddyAssignmentWhereInput
    orderBy?: BuddyAssignmentOrderByWithRelationInput | BuddyAssignmentOrderByWithRelationInput[]
    cursor?: BuddyAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuddyAssignmentScalarFieldEnum | BuddyAssignmentScalarFieldEnum[]
  }

  /**
   * BuddyRequest.ratings
   */
  export type BuddyRequest$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    cursor?: RatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * BuddyRequest without action
   */
  export type BuddyRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyRequest
     */
    select?: BuddyRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyRequestInclude<ExtArgs> | null
  }


  /**
   * Model BuddyApplication
   */

  export type AggregateBuddyApplication = {
    _count: BuddyApplicationCountAggregateOutputType | null
    _min: BuddyApplicationMinAggregateOutputType | null
    _max: BuddyApplicationMaxAggregateOutputType | null
  }

  export type BuddyApplicationMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    helperId: string | null
    note: string | null
    status: $Enums.ApplicationStatus | null
    createdAt: Date | null
  }

  export type BuddyApplicationMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    helperId: string | null
    note: string | null
    status: $Enums.ApplicationStatus | null
    createdAt: Date | null
  }

  export type BuddyApplicationCountAggregateOutputType = {
    id: number
    requestId: number
    helperId: number
    note: number
    status: number
    createdAt: number
    _all: number
  }


  export type BuddyApplicationMinAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    note?: true
    status?: true
    createdAt?: true
  }

  export type BuddyApplicationMaxAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    note?: true
    status?: true
    createdAt?: true
  }

  export type BuddyApplicationCountAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    note?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type BuddyApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuddyApplication to aggregate.
     */
    where?: BuddyApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyApplications to fetch.
     */
    orderBy?: BuddyApplicationOrderByWithRelationInput | BuddyApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BuddyApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BuddyApplications
    **/
    _count?: true | BuddyApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BuddyApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BuddyApplicationMaxAggregateInputType
  }

  export type GetBuddyApplicationAggregateType<T extends BuddyApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateBuddyApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBuddyApplication[P]>
      : GetScalarType<T[P], AggregateBuddyApplication[P]>
  }




  export type BuddyApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyApplicationWhereInput
    orderBy?: BuddyApplicationOrderByWithAggregationInput | BuddyApplicationOrderByWithAggregationInput[]
    by: BuddyApplicationScalarFieldEnum[] | BuddyApplicationScalarFieldEnum
    having?: BuddyApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BuddyApplicationCountAggregateInputType | true
    _min?: BuddyApplicationMinAggregateInputType
    _max?: BuddyApplicationMaxAggregateInputType
  }

  export type BuddyApplicationGroupByOutputType = {
    id: string
    requestId: string
    helperId: string
    note: string | null
    status: $Enums.ApplicationStatus
    createdAt: Date
    _count: BuddyApplicationCountAggregateOutputType | null
    _min: BuddyApplicationMinAggregateOutputType | null
    _max: BuddyApplicationMaxAggregateOutputType | null
  }

  type GetBuddyApplicationGroupByPayload<T extends BuddyApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BuddyApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BuddyApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BuddyApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], BuddyApplicationGroupByOutputType[P]>
        }
      >
    >


  export type BuddyApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    note?: boolean
    status?: boolean
    createdAt?: boolean
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buddyApplication"]>

  export type BuddyApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    note?: boolean
    status?: boolean
    createdAt?: boolean
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buddyApplication"]>

  export type BuddyApplicationSelectScalar = {
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    note?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type BuddyApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }
  export type BuddyApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }

  export type $BuddyApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BuddyApplication"
    objects: {
      request: Prisma.$BuddyRequestPayload<ExtArgs>
      helper: Prisma.$HelperPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      helperId: string
      note: string | null
      status: $Enums.ApplicationStatus
      createdAt: Date
    }, ExtArgs["result"]["buddyApplication"]>
    composites: {}
  }

  type BuddyApplicationGetPayload<S extends boolean | null | undefined | BuddyApplicationDefaultArgs> = $Result.GetResult<Prisma.$BuddyApplicationPayload, S>

  type BuddyApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BuddyApplicationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BuddyApplicationCountAggregateInputType | true
    }

  export interface BuddyApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BuddyApplication'], meta: { name: 'BuddyApplication' } }
    /**
     * Find zero or one BuddyApplication that matches the filter.
     * @param {BuddyApplicationFindUniqueArgs} args - Arguments to find a BuddyApplication
     * @example
     * // Get one BuddyApplication
     * const buddyApplication = await prisma.buddyApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BuddyApplicationFindUniqueArgs>(args: SelectSubset<T, BuddyApplicationFindUniqueArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BuddyApplication that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BuddyApplicationFindUniqueOrThrowArgs} args - Arguments to find a BuddyApplication
     * @example
     * // Get one BuddyApplication
     * const buddyApplication = await prisma.buddyApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BuddyApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, BuddyApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BuddyApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationFindFirstArgs} args - Arguments to find a BuddyApplication
     * @example
     * // Get one BuddyApplication
     * const buddyApplication = await prisma.buddyApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BuddyApplicationFindFirstArgs>(args?: SelectSubset<T, BuddyApplicationFindFirstArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BuddyApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationFindFirstOrThrowArgs} args - Arguments to find a BuddyApplication
     * @example
     * // Get one BuddyApplication
     * const buddyApplication = await prisma.buddyApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BuddyApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, BuddyApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BuddyApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BuddyApplications
     * const buddyApplications = await prisma.buddyApplication.findMany()
     * 
     * // Get first 10 BuddyApplications
     * const buddyApplications = await prisma.buddyApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const buddyApplicationWithIdOnly = await prisma.buddyApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BuddyApplicationFindManyArgs>(args?: SelectSubset<T, BuddyApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BuddyApplication.
     * @param {BuddyApplicationCreateArgs} args - Arguments to create a BuddyApplication.
     * @example
     * // Create one BuddyApplication
     * const BuddyApplication = await prisma.buddyApplication.create({
     *   data: {
     *     // ... data to create a BuddyApplication
     *   }
     * })
     * 
     */
    create<T extends BuddyApplicationCreateArgs>(args: SelectSubset<T, BuddyApplicationCreateArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BuddyApplications.
     * @param {BuddyApplicationCreateManyArgs} args - Arguments to create many BuddyApplications.
     * @example
     * // Create many BuddyApplications
     * const buddyApplication = await prisma.buddyApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BuddyApplicationCreateManyArgs>(args?: SelectSubset<T, BuddyApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BuddyApplications and returns the data saved in the database.
     * @param {BuddyApplicationCreateManyAndReturnArgs} args - Arguments to create many BuddyApplications.
     * @example
     * // Create many BuddyApplications
     * const buddyApplication = await prisma.buddyApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BuddyApplications and only return the `id`
     * const buddyApplicationWithIdOnly = await prisma.buddyApplication.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BuddyApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, BuddyApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BuddyApplication.
     * @param {BuddyApplicationDeleteArgs} args - Arguments to delete one BuddyApplication.
     * @example
     * // Delete one BuddyApplication
     * const BuddyApplication = await prisma.buddyApplication.delete({
     *   where: {
     *     // ... filter to delete one BuddyApplication
     *   }
     * })
     * 
     */
    delete<T extends BuddyApplicationDeleteArgs>(args: SelectSubset<T, BuddyApplicationDeleteArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BuddyApplication.
     * @param {BuddyApplicationUpdateArgs} args - Arguments to update one BuddyApplication.
     * @example
     * // Update one BuddyApplication
     * const buddyApplication = await prisma.buddyApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BuddyApplicationUpdateArgs>(args: SelectSubset<T, BuddyApplicationUpdateArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BuddyApplications.
     * @param {BuddyApplicationDeleteManyArgs} args - Arguments to filter BuddyApplications to delete.
     * @example
     * // Delete a few BuddyApplications
     * const { count } = await prisma.buddyApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BuddyApplicationDeleteManyArgs>(args?: SelectSubset<T, BuddyApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuddyApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BuddyApplications
     * const buddyApplication = await prisma.buddyApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BuddyApplicationUpdateManyArgs>(args: SelectSubset<T, BuddyApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BuddyApplication.
     * @param {BuddyApplicationUpsertArgs} args - Arguments to update or create a BuddyApplication.
     * @example
     * // Update or create a BuddyApplication
     * const buddyApplication = await prisma.buddyApplication.upsert({
     *   create: {
     *     // ... data to create a BuddyApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BuddyApplication we want to update
     *   }
     * })
     */
    upsert<T extends BuddyApplicationUpsertArgs>(args: SelectSubset<T, BuddyApplicationUpsertArgs<ExtArgs>>): Prisma__BuddyApplicationClient<$Result.GetResult<Prisma.$BuddyApplicationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BuddyApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationCountArgs} args - Arguments to filter BuddyApplications to count.
     * @example
     * // Count the number of BuddyApplications
     * const count = await prisma.buddyApplication.count({
     *   where: {
     *     // ... the filter for the BuddyApplications we want to count
     *   }
     * })
    **/
    count<T extends BuddyApplicationCountArgs>(
      args?: Subset<T, BuddyApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BuddyApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BuddyApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BuddyApplicationAggregateArgs>(args: Subset<T, BuddyApplicationAggregateArgs>): Prisma.PrismaPromise<GetBuddyApplicationAggregateType<T>>

    /**
     * Group by BuddyApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BuddyApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BuddyApplicationGroupByArgs['orderBy'] }
        : { orderBy?: BuddyApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BuddyApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBuddyApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BuddyApplication model
   */
  readonly fields: BuddyApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BuddyApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BuddyApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends BuddyRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BuddyRequestDefaultArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    helper<T extends HelperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HelperDefaultArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BuddyApplication model
   */ 
  interface BuddyApplicationFieldRefs {
    readonly id: FieldRef<"BuddyApplication", 'String'>
    readonly requestId: FieldRef<"BuddyApplication", 'String'>
    readonly helperId: FieldRef<"BuddyApplication", 'String'>
    readonly note: FieldRef<"BuddyApplication", 'String'>
    readonly status: FieldRef<"BuddyApplication", 'ApplicationStatus'>
    readonly createdAt: FieldRef<"BuddyApplication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BuddyApplication findUnique
   */
  export type BuddyApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * Filter, which BuddyApplication to fetch.
     */
    where: BuddyApplicationWhereUniqueInput
  }

  /**
   * BuddyApplication findUniqueOrThrow
   */
  export type BuddyApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * Filter, which BuddyApplication to fetch.
     */
    where: BuddyApplicationWhereUniqueInput
  }

  /**
   * BuddyApplication findFirst
   */
  export type BuddyApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * Filter, which BuddyApplication to fetch.
     */
    where?: BuddyApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyApplications to fetch.
     */
    orderBy?: BuddyApplicationOrderByWithRelationInput | BuddyApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuddyApplications.
     */
    cursor?: BuddyApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuddyApplications.
     */
    distinct?: BuddyApplicationScalarFieldEnum | BuddyApplicationScalarFieldEnum[]
  }

  /**
   * BuddyApplication findFirstOrThrow
   */
  export type BuddyApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * Filter, which BuddyApplication to fetch.
     */
    where?: BuddyApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyApplications to fetch.
     */
    orderBy?: BuddyApplicationOrderByWithRelationInput | BuddyApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuddyApplications.
     */
    cursor?: BuddyApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuddyApplications.
     */
    distinct?: BuddyApplicationScalarFieldEnum | BuddyApplicationScalarFieldEnum[]
  }

  /**
   * BuddyApplication findMany
   */
  export type BuddyApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * Filter, which BuddyApplications to fetch.
     */
    where?: BuddyApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyApplications to fetch.
     */
    orderBy?: BuddyApplicationOrderByWithRelationInput | BuddyApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BuddyApplications.
     */
    cursor?: BuddyApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyApplications.
     */
    skip?: number
    distinct?: BuddyApplicationScalarFieldEnum | BuddyApplicationScalarFieldEnum[]
  }

  /**
   * BuddyApplication create
   */
  export type BuddyApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a BuddyApplication.
     */
    data: XOR<BuddyApplicationCreateInput, BuddyApplicationUncheckedCreateInput>
  }

  /**
   * BuddyApplication createMany
   */
  export type BuddyApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BuddyApplications.
     */
    data: BuddyApplicationCreateManyInput | BuddyApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BuddyApplication createManyAndReturn
   */
  export type BuddyApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BuddyApplications.
     */
    data: BuddyApplicationCreateManyInput | BuddyApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BuddyApplication update
   */
  export type BuddyApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a BuddyApplication.
     */
    data: XOR<BuddyApplicationUpdateInput, BuddyApplicationUncheckedUpdateInput>
    /**
     * Choose, which BuddyApplication to update.
     */
    where: BuddyApplicationWhereUniqueInput
  }

  /**
   * BuddyApplication updateMany
   */
  export type BuddyApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BuddyApplications.
     */
    data: XOR<BuddyApplicationUpdateManyMutationInput, BuddyApplicationUncheckedUpdateManyInput>
    /**
     * Filter which BuddyApplications to update
     */
    where?: BuddyApplicationWhereInput
  }

  /**
   * BuddyApplication upsert
   */
  export type BuddyApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the BuddyApplication to update in case it exists.
     */
    where: BuddyApplicationWhereUniqueInput
    /**
     * In case the BuddyApplication found by the `where` argument doesn't exist, create a new BuddyApplication with this data.
     */
    create: XOR<BuddyApplicationCreateInput, BuddyApplicationUncheckedCreateInput>
    /**
     * In case the BuddyApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BuddyApplicationUpdateInput, BuddyApplicationUncheckedUpdateInput>
  }

  /**
   * BuddyApplication delete
   */
  export type BuddyApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
    /**
     * Filter which BuddyApplication to delete.
     */
    where: BuddyApplicationWhereUniqueInput
  }

  /**
   * BuddyApplication deleteMany
   */
  export type BuddyApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuddyApplications to delete
     */
    where?: BuddyApplicationWhereInput
  }

  /**
   * BuddyApplication without action
   */
  export type BuddyApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyApplication
     */
    select?: BuddyApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyApplicationInclude<ExtArgs> | null
  }


  /**
   * Model BuddyAssignment
   */

  export type AggregateBuddyAssignment = {
    _count: BuddyAssignmentCountAggregateOutputType | null
    _min: BuddyAssignmentMinAggregateOutputType | null
    _max: BuddyAssignmentMaxAggregateOutputType | null
  }

  export type BuddyAssignmentMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    helperId: string | null
    status: $Enums.AssignmentStatus | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type BuddyAssignmentMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    helperId: string | null
    status: $Enums.AssignmentStatus | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type BuddyAssignmentCountAggregateOutputType = {
    id: number
    requestId: number
    helperId: number
    status: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type BuddyAssignmentMinAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    status?: true
    createdAt?: true
    completedAt?: true
  }

  export type BuddyAssignmentMaxAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    status?: true
    createdAt?: true
    completedAt?: true
  }

  export type BuddyAssignmentCountAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    status?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type BuddyAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuddyAssignment to aggregate.
     */
    where?: BuddyAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyAssignments to fetch.
     */
    orderBy?: BuddyAssignmentOrderByWithRelationInput | BuddyAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BuddyAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BuddyAssignments
    **/
    _count?: true | BuddyAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BuddyAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BuddyAssignmentMaxAggregateInputType
  }

  export type GetBuddyAssignmentAggregateType<T extends BuddyAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateBuddyAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBuddyAssignment[P]>
      : GetScalarType<T[P], AggregateBuddyAssignment[P]>
  }




  export type BuddyAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuddyAssignmentWhereInput
    orderBy?: BuddyAssignmentOrderByWithAggregationInput | BuddyAssignmentOrderByWithAggregationInput[]
    by: BuddyAssignmentScalarFieldEnum[] | BuddyAssignmentScalarFieldEnum
    having?: BuddyAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BuddyAssignmentCountAggregateInputType | true
    _min?: BuddyAssignmentMinAggregateInputType
    _max?: BuddyAssignmentMaxAggregateInputType
  }

  export type BuddyAssignmentGroupByOutputType = {
    id: string
    requestId: string
    helperId: string
    status: $Enums.AssignmentStatus
    createdAt: Date
    completedAt: Date | null
    _count: BuddyAssignmentCountAggregateOutputType | null
    _min: BuddyAssignmentMinAggregateOutputType | null
    _max: BuddyAssignmentMaxAggregateOutputType | null
  }

  type GetBuddyAssignmentGroupByPayload<T extends BuddyAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BuddyAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BuddyAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BuddyAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], BuddyAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type BuddyAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buddyAssignment"]>

  export type BuddyAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buddyAssignment"]>

  export type BuddyAssignmentSelectScalar = {
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type BuddyAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }
  export type BuddyAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }

  export type $BuddyAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BuddyAssignment"
    objects: {
      request: Prisma.$BuddyRequestPayload<ExtArgs>
      helper: Prisma.$HelperPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      helperId: string
      status: $Enums.AssignmentStatus
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["buddyAssignment"]>
    composites: {}
  }

  type BuddyAssignmentGetPayload<S extends boolean | null | undefined | BuddyAssignmentDefaultArgs> = $Result.GetResult<Prisma.$BuddyAssignmentPayload, S>

  type BuddyAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BuddyAssignmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BuddyAssignmentCountAggregateInputType | true
    }

  export interface BuddyAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BuddyAssignment'], meta: { name: 'BuddyAssignment' } }
    /**
     * Find zero or one BuddyAssignment that matches the filter.
     * @param {BuddyAssignmentFindUniqueArgs} args - Arguments to find a BuddyAssignment
     * @example
     * // Get one BuddyAssignment
     * const buddyAssignment = await prisma.buddyAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BuddyAssignmentFindUniqueArgs>(args: SelectSubset<T, BuddyAssignmentFindUniqueArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BuddyAssignment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BuddyAssignmentFindUniqueOrThrowArgs} args - Arguments to find a BuddyAssignment
     * @example
     * // Get one BuddyAssignment
     * const buddyAssignment = await prisma.buddyAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BuddyAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, BuddyAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BuddyAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentFindFirstArgs} args - Arguments to find a BuddyAssignment
     * @example
     * // Get one BuddyAssignment
     * const buddyAssignment = await prisma.buddyAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BuddyAssignmentFindFirstArgs>(args?: SelectSubset<T, BuddyAssignmentFindFirstArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BuddyAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentFindFirstOrThrowArgs} args - Arguments to find a BuddyAssignment
     * @example
     * // Get one BuddyAssignment
     * const buddyAssignment = await prisma.buddyAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BuddyAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, BuddyAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BuddyAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BuddyAssignments
     * const buddyAssignments = await prisma.buddyAssignment.findMany()
     * 
     * // Get first 10 BuddyAssignments
     * const buddyAssignments = await prisma.buddyAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const buddyAssignmentWithIdOnly = await prisma.buddyAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BuddyAssignmentFindManyArgs>(args?: SelectSubset<T, BuddyAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BuddyAssignment.
     * @param {BuddyAssignmentCreateArgs} args - Arguments to create a BuddyAssignment.
     * @example
     * // Create one BuddyAssignment
     * const BuddyAssignment = await prisma.buddyAssignment.create({
     *   data: {
     *     // ... data to create a BuddyAssignment
     *   }
     * })
     * 
     */
    create<T extends BuddyAssignmentCreateArgs>(args: SelectSubset<T, BuddyAssignmentCreateArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BuddyAssignments.
     * @param {BuddyAssignmentCreateManyArgs} args - Arguments to create many BuddyAssignments.
     * @example
     * // Create many BuddyAssignments
     * const buddyAssignment = await prisma.buddyAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BuddyAssignmentCreateManyArgs>(args?: SelectSubset<T, BuddyAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BuddyAssignments and returns the data saved in the database.
     * @param {BuddyAssignmentCreateManyAndReturnArgs} args - Arguments to create many BuddyAssignments.
     * @example
     * // Create many BuddyAssignments
     * const buddyAssignment = await prisma.buddyAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BuddyAssignments and only return the `id`
     * const buddyAssignmentWithIdOnly = await prisma.buddyAssignment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BuddyAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, BuddyAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BuddyAssignment.
     * @param {BuddyAssignmentDeleteArgs} args - Arguments to delete one BuddyAssignment.
     * @example
     * // Delete one BuddyAssignment
     * const BuddyAssignment = await prisma.buddyAssignment.delete({
     *   where: {
     *     // ... filter to delete one BuddyAssignment
     *   }
     * })
     * 
     */
    delete<T extends BuddyAssignmentDeleteArgs>(args: SelectSubset<T, BuddyAssignmentDeleteArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BuddyAssignment.
     * @param {BuddyAssignmentUpdateArgs} args - Arguments to update one BuddyAssignment.
     * @example
     * // Update one BuddyAssignment
     * const buddyAssignment = await prisma.buddyAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BuddyAssignmentUpdateArgs>(args: SelectSubset<T, BuddyAssignmentUpdateArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BuddyAssignments.
     * @param {BuddyAssignmentDeleteManyArgs} args - Arguments to filter BuddyAssignments to delete.
     * @example
     * // Delete a few BuddyAssignments
     * const { count } = await prisma.buddyAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BuddyAssignmentDeleteManyArgs>(args?: SelectSubset<T, BuddyAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuddyAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BuddyAssignments
     * const buddyAssignment = await prisma.buddyAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BuddyAssignmentUpdateManyArgs>(args: SelectSubset<T, BuddyAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BuddyAssignment.
     * @param {BuddyAssignmentUpsertArgs} args - Arguments to update or create a BuddyAssignment.
     * @example
     * // Update or create a BuddyAssignment
     * const buddyAssignment = await prisma.buddyAssignment.upsert({
     *   create: {
     *     // ... data to create a BuddyAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BuddyAssignment we want to update
     *   }
     * })
     */
    upsert<T extends BuddyAssignmentUpsertArgs>(args: SelectSubset<T, BuddyAssignmentUpsertArgs<ExtArgs>>): Prisma__BuddyAssignmentClient<$Result.GetResult<Prisma.$BuddyAssignmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BuddyAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentCountArgs} args - Arguments to filter BuddyAssignments to count.
     * @example
     * // Count the number of BuddyAssignments
     * const count = await prisma.buddyAssignment.count({
     *   where: {
     *     // ... the filter for the BuddyAssignments we want to count
     *   }
     * })
    **/
    count<T extends BuddyAssignmentCountArgs>(
      args?: Subset<T, BuddyAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BuddyAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BuddyAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BuddyAssignmentAggregateArgs>(args: Subset<T, BuddyAssignmentAggregateArgs>): Prisma.PrismaPromise<GetBuddyAssignmentAggregateType<T>>

    /**
     * Group by BuddyAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuddyAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BuddyAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BuddyAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: BuddyAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BuddyAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBuddyAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BuddyAssignment model
   */
  readonly fields: BuddyAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BuddyAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BuddyAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends BuddyRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BuddyRequestDefaultArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    helper<T extends HelperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HelperDefaultArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BuddyAssignment model
   */ 
  interface BuddyAssignmentFieldRefs {
    readonly id: FieldRef<"BuddyAssignment", 'String'>
    readonly requestId: FieldRef<"BuddyAssignment", 'String'>
    readonly helperId: FieldRef<"BuddyAssignment", 'String'>
    readonly status: FieldRef<"BuddyAssignment", 'AssignmentStatus'>
    readonly createdAt: FieldRef<"BuddyAssignment", 'DateTime'>
    readonly completedAt: FieldRef<"BuddyAssignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BuddyAssignment findUnique
   */
  export type BuddyAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which BuddyAssignment to fetch.
     */
    where: BuddyAssignmentWhereUniqueInput
  }

  /**
   * BuddyAssignment findUniqueOrThrow
   */
  export type BuddyAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which BuddyAssignment to fetch.
     */
    where: BuddyAssignmentWhereUniqueInput
  }

  /**
   * BuddyAssignment findFirst
   */
  export type BuddyAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which BuddyAssignment to fetch.
     */
    where?: BuddyAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyAssignments to fetch.
     */
    orderBy?: BuddyAssignmentOrderByWithRelationInput | BuddyAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuddyAssignments.
     */
    cursor?: BuddyAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuddyAssignments.
     */
    distinct?: BuddyAssignmentScalarFieldEnum | BuddyAssignmentScalarFieldEnum[]
  }

  /**
   * BuddyAssignment findFirstOrThrow
   */
  export type BuddyAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which BuddyAssignment to fetch.
     */
    where?: BuddyAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyAssignments to fetch.
     */
    orderBy?: BuddyAssignmentOrderByWithRelationInput | BuddyAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuddyAssignments.
     */
    cursor?: BuddyAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuddyAssignments.
     */
    distinct?: BuddyAssignmentScalarFieldEnum | BuddyAssignmentScalarFieldEnum[]
  }

  /**
   * BuddyAssignment findMany
   */
  export type BuddyAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which BuddyAssignments to fetch.
     */
    where?: BuddyAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuddyAssignments to fetch.
     */
    orderBy?: BuddyAssignmentOrderByWithRelationInput | BuddyAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BuddyAssignments.
     */
    cursor?: BuddyAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuddyAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuddyAssignments.
     */
    skip?: number
    distinct?: BuddyAssignmentScalarFieldEnum | BuddyAssignmentScalarFieldEnum[]
  }

  /**
   * BuddyAssignment create
   */
  export type BuddyAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a BuddyAssignment.
     */
    data: XOR<BuddyAssignmentCreateInput, BuddyAssignmentUncheckedCreateInput>
  }

  /**
   * BuddyAssignment createMany
   */
  export type BuddyAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BuddyAssignments.
     */
    data: BuddyAssignmentCreateManyInput | BuddyAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BuddyAssignment createManyAndReturn
   */
  export type BuddyAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BuddyAssignments.
     */
    data: BuddyAssignmentCreateManyInput | BuddyAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BuddyAssignment update
   */
  export type BuddyAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a BuddyAssignment.
     */
    data: XOR<BuddyAssignmentUpdateInput, BuddyAssignmentUncheckedUpdateInput>
    /**
     * Choose, which BuddyAssignment to update.
     */
    where: BuddyAssignmentWhereUniqueInput
  }

  /**
   * BuddyAssignment updateMany
   */
  export type BuddyAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BuddyAssignments.
     */
    data: XOR<BuddyAssignmentUpdateManyMutationInput, BuddyAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which BuddyAssignments to update
     */
    where?: BuddyAssignmentWhereInput
  }

  /**
   * BuddyAssignment upsert
   */
  export type BuddyAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the BuddyAssignment to update in case it exists.
     */
    where: BuddyAssignmentWhereUniqueInput
    /**
     * In case the BuddyAssignment found by the `where` argument doesn't exist, create a new BuddyAssignment with this data.
     */
    create: XOR<BuddyAssignmentCreateInput, BuddyAssignmentUncheckedCreateInput>
    /**
     * In case the BuddyAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BuddyAssignmentUpdateInput, BuddyAssignmentUncheckedUpdateInput>
  }

  /**
   * BuddyAssignment delete
   */
  export type BuddyAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
    /**
     * Filter which BuddyAssignment to delete.
     */
    where: BuddyAssignmentWhereUniqueInput
  }

  /**
   * BuddyAssignment deleteMany
   */
  export type BuddyAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuddyAssignments to delete
     */
    where?: BuddyAssignmentWhereInput
  }

  /**
   * BuddyAssignment without action
   */
  export type BuddyAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuddyAssignment
     */
    select?: BuddyAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuddyAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model Rating
   */

  export type AggregateRating = {
    _count: RatingCountAggregateOutputType | null
    _avg: RatingAvgAggregateOutputType | null
    _sum: RatingSumAggregateOutputType | null
    _min: RatingMinAggregateOutputType | null
    _max: RatingMaxAggregateOutputType | null
  }

  export type RatingAvgAggregateOutputType = {
    rating: number | null
  }

  export type RatingSumAggregateOutputType = {
    rating: number | null
  }

  export type RatingMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    helperId: string | null
    rating: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type RatingMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    helperId: string | null
    rating: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type RatingCountAggregateOutputType = {
    id: number
    requestId: number
    helperId: number
    rating: number
    comment: number
    createdAt: number
    _all: number
  }


  export type RatingAvgAggregateInputType = {
    rating?: true
  }

  export type RatingSumAggregateInputType = {
    rating?: true
  }

  export type RatingMinAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type RatingMaxAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type RatingCountAggregateInputType = {
    id?: true
    requestId?: true
    helperId?: true
    rating?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type RatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rating to aggregate.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ratings
    **/
    _count?: true | RatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RatingMaxAggregateInputType
  }

  export type GetRatingAggregateType<T extends RatingAggregateArgs> = {
        [P in keyof T & keyof AggregateRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRating[P]>
      : GetScalarType<T[P], AggregateRating[P]>
  }




  export type RatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithAggregationInput | RatingOrderByWithAggregationInput[]
    by: RatingScalarFieldEnum[] | RatingScalarFieldEnum
    having?: RatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RatingCountAggregateInputType | true
    _avg?: RatingAvgAggregateInputType
    _sum?: RatingSumAggregateInputType
    _min?: RatingMinAggregateInputType
    _max?: RatingMaxAggregateInputType
  }

  export type RatingGroupByOutputType = {
    id: string
    requestId: string
    helperId: string
    rating: number
    comment: string | null
    createdAt: Date
    _count: RatingCountAggregateOutputType | null
    _avg: RatingAvgAggregateOutputType | null
    _sum: RatingSumAggregateOutputType | null
    _min: RatingMinAggregateOutputType | null
    _max: RatingMaxAggregateOutputType | null
  }

  type GetRatingGroupByPayload<T extends RatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RatingGroupByOutputType[P]>
            : GetScalarType<T[P], RatingGroupByOutputType[P]>
        }
      >
    >


  export type RatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectScalar = {
    id?: boolean
    requestId?: boolean
    helperId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type RatingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }
  export type RatingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | BuddyRequestDefaultArgs<ExtArgs>
    helper?: boolean | HelperDefaultArgs<ExtArgs>
  }

  export type $RatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rating"
    objects: {
      request: Prisma.$BuddyRequestPayload<ExtArgs>
      helper: Prisma.$HelperPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      helperId: string
      rating: number
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["rating"]>
    composites: {}
  }

  type RatingGetPayload<S extends boolean | null | undefined | RatingDefaultArgs> = $Result.GetResult<Prisma.$RatingPayload, S>

  type RatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RatingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RatingCountAggregateInputType | true
    }

  export interface RatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rating'], meta: { name: 'Rating' } }
    /**
     * Find zero or one Rating that matches the filter.
     * @param {RatingFindUniqueArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RatingFindUniqueArgs>(args: SelectSubset<T, RatingFindUniqueArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Rating that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RatingFindUniqueOrThrowArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RatingFindUniqueOrThrowArgs>(args: SelectSubset<T, RatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Rating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindFirstArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RatingFindFirstArgs>(args?: SelectSubset<T, RatingFindFirstArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Rating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindFirstOrThrowArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RatingFindFirstOrThrowArgs>(args?: SelectSubset<T, RatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ratings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ratings
     * const ratings = await prisma.rating.findMany()
     * 
     * // Get first 10 Ratings
     * const ratings = await prisma.rating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ratingWithIdOnly = await prisma.rating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RatingFindManyArgs>(args?: SelectSubset<T, RatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Rating.
     * @param {RatingCreateArgs} args - Arguments to create a Rating.
     * @example
     * // Create one Rating
     * const Rating = await prisma.rating.create({
     *   data: {
     *     // ... data to create a Rating
     *   }
     * })
     * 
     */
    create<T extends RatingCreateArgs>(args: SelectSubset<T, RatingCreateArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ratings.
     * @param {RatingCreateManyArgs} args - Arguments to create many Ratings.
     * @example
     * // Create many Ratings
     * const rating = await prisma.rating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RatingCreateManyArgs>(args?: SelectSubset<T, RatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ratings and returns the data saved in the database.
     * @param {RatingCreateManyAndReturnArgs} args - Arguments to create many Ratings.
     * @example
     * // Create many Ratings
     * const rating = await prisma.rating.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ratings and only return the `id`
     * const ratingWithIdOnly = await prisma.rating.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RatingCreateManyAndReturnArgs>(args?: SelectSubset<T, RatingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Rating.
     * @param {RatingDeleteArgs} args - Arguments to delete one Rating.
     * @example
     * // Delete one Rating
     * const Rating = await prisma.rating.delete({
     *   where: {
     *     // ... filter to delete one Rating
     *   }
     * })
     * 
     */
    delete<T extends RatingDeleteArgs>(args: SelectSubset<T, RatingDeleteArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Rating.
     * @param {RatingUpdateArgs} args - Arguments to update one Rating.
     * @example
     * // Update one Rating
     * const rating = await prisma.rating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RatingUpdateArgs>(args: SelectSubset<T, RatingUpdateArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ratings.
     * @param {RatingDeleteManyArgs} args - Arguments to filter Ratings to delete.
     * @example
     * // Delete a few Ratings
     * const { count } = await prisma.rating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RatingDeleteManyArgs>(args?: SelectSubset<T, RatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ratings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ratings
     * const rating = await prisma.rating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RatingUpdateManyArgs>(args: SelectSubset<T, RatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rating.
     * @param {RatingUpsertArgs} args - Arguments to update or create a Rating.
     * @example
     * // Update or create a Rating
     * const rating = await prisma.rating.upsert({
     *   create: {
     *     // ... data to create a Rating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rating we want to update
     *   }
     * })
     */
    upsert<T extends RatingUpsertArgs>(args: SelectSubset<T, RatingUpsertArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ratings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingCountArgs} args - Arguments to filter Ratings to count.
     * @example
     * // Count the number of Ratings
     * const count = await prisma.rating.count({
     *   where: {
     *     // ... the filter for the Ratings we want to count
     *   }
     * })
    **/
    count<T extends RatingCountArgs>(
      args?: Subset<T, RatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RatingAggregateArgs>(args: Subset<T, RatingAggregateArgs>): Prisma.PrismaPromise<GetRatingAggregateType<T>>

    /**
     * Group by Rating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RatingGroupByArgs['orderBy'] }
        : { orderBy?: RatingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rating model
   */
  readonly fields: RatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends BuddyRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BuddyRequestDefaultArgs<ExtArgs>>): Prisma__BuddyRequestClient<$Result.GetResult<Prisma.$BuddyRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    helper<T extends HelperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HelperDefaultArgs<ExtArgs>>): Prisma__HelperClient<$Result.GetResult<Prisma.$HelperPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rating model
   */ 
  interface RatingFieldRefs {
    readonly id: FieldRef<"Rating", 'String'>
    readonly requestId: FieldRef<"Rating", 'String'>
    readonly helperId: FieldRef<"Rating", 'String'>
    readonly rating: FieldRef<"Rating", 'Float'>
    readonly comment: FieldRef<"Rating", 'String'>
    readonly createdAt: FieldRef<"Rating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rating findUnique
   */
  export type RatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating findUniqueOrThrow
   */
  export type RatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating findFirst
   */
  export type RatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ratings.
     */
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating findFirstOrThrow
   */
  export type RatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ratings.
     */
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating findMany
   */
  export type RatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Ratings to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating create
   */
  export type RatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The data needed to create a Rating.
     */
    data: XOR<RatingCreateInput, RatingUncheckedCreateInput>
  }

  /**
   * Rating createMany
   */
  export type RatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ratings.
     */
    data: RatingCreateManyInput | RatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rating createManyAndReturn
   */
  export type RatingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Ratings.
     */
    data: RatingCreateManyInput | RatingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rating update
   */
  export type RatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The data needed to update a Rating.
     */
    data: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>
    /**
     * Choose, which Rating to update.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating updateMany
   */
  export type RatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ratings.
     */
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyInput>
    /**
     * Filter which Ratings to update
     */
    where?: RatingWhereInput
  }

  /**
   * Rating upsert
   */
  export type RatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The filter to search for the Rating to update in case it exists.
     */
    where: RatingWhereUniqueInput
    /**
     * In case the Rating found by the `where` argument doesn't exist, create a new Rating with this data.
     */
    create: XOR<RatingCreateInput, RatingUncheckedCreateInput>
    /**
     * In case the Rating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>
  }

  /**
   * Rating delete
   */
  export type RatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter which Rating to delete.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating deleteMany
   */
  export type RatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ratings to delete
     */
    where?: RatingWhereInput
  }

  /**
   * Rating without action
   */
  export type RatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const HelperScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    status: 'status',
    rating: 'rating',
    isAvailable: 'isAvailable',
    lat: 'lat',
    lng: 'lng',
    locationLabel: 'locationLabel',
    radiusKm: 'radiusKm',
    profilePhotoUrl: 'profilePhotoUrl',
    idNumber: 'idNumber',
    createdAt: 'createdAt'
  };

  export type HelperScalarFieldEnum = (typeof HelperScalarFieldEnum)[keyof typeof HelperScalarFieldEnum]


  export const HelperSkillScalarFieldEnum: {
    id: 'id',
    helperId: 'helperId',
    taskType: 'taskType'
  };

  export type HelperSkillScalarFieldEnum = (typeof HelperSkillScalarFieldEnum)[keyof typeof HelperSkillScalarFieldEnum]


  export const HelperAvailabilityScalarFieldEnum: {
    id: 'id',
    helperId: 'helperId',
    dayOfWeek: 'dayOfWeek',
    startTime: 'startTime',
    endTime: 'endTime'
  };

  export type HelperAvailabilityScalarFieldEnum = (typeof HelperAvailabilityScalarFieldEnum)[keyof typeof HelperAvailabilityScalarFieldEnum]


  export const BuddyRequestScalarFieldEnum: {
    id: 'id',
    sellerId: 'sellerId',
    taskType: 'taskType',
    locationLabel: 'locationLabel',
    lat: 'lat',
    lng: 'lng',
    startTime: 'startTime',
    endTime: 'endTime',
    durationHours: 'durationHours',
    compensation: 'compensation',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type BuddyRequestScalarFieldEnum = (typeof BuddyRequestScalarFieldEnum)[keyof typeof BuddyRequestScalarFieldEnum]


  export const BuddyApplicationScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    helperId: 'helperId',
    note: 'note',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type BuddyApplicationScalarFieldEnum = (typeof BuddyApplicationScalarFieldEnum)[keyof typeof BuddyApplicationScalarFieldEnum]


  export const BuddyAssignmentScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    helperId: 'helperId',
    status: 'status',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type BuddyAssignmentScalarFieldEnum = (typeof BuddyAssignmentScalarFieldEnum)[keyof typeof BuddyAssignmentScalarFieldEnum]


  export const RatingScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    helperId: 'helperId',
    rating: 'rating',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type RatingScalarFieldEnum = (typeof RatingScalarFieldEnum)[keyof typeof RatingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BuddyStatus'
   */
  export type EnumBuddyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuddyStatus'>
    


  /**
   * Reference to a field of type 'BuddyStatus[]'
   */
  export type ListEnumBuddyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuddyStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TaskType'
   */
  export type EnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType'>
    


  /**
   * Reference to a field of type 'TaskType[]'
   */
  export type ListEnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BuddyRequestStatus'
   */
  export type EnumBuddyRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuddyRequestStatus'>
    


  /**
   * Reference to a field of type 'BuddyRequestStatus[]'
   */
  export type ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuddyRequestStatus[]'>
    


  /**
   * Reference to a field of type 'ApplicationStatus'
   */
  export type EnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus'>
    


  /**
   * Reference to a field of type 'ApplicationStatus[]'
   */
  export type ListEnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus[]'>
    


  /**
   * Reference to a field of type 'AssignmentStatus'
   */
  export type EnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus'>
    


  /**
   * Reference to a field of type 'AssignmentStatus[]'
   */
  export type ListEnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type HelperWhereInput = {
    AND?: HelperWhereInput | HelperWhereInput[]
    OR?: HelperWhereInput[]
    NOT?: HelperWhereInput | HelperWhereInput[]
    id?: StringFilter<"Helper"> | string
    name?: StringFilter<"Helper"> | string
    email?: StringFilter<"Helper"> | string
    phone?: StringFilter<"Helper"> | string
    passwordHash?: StringFilter<"Helper"> | string
    status?: EnumBuddyStatusFilter<"Helper"> | $Enums.BuddyStatus
    rating?: FloatFilter<"Helper"> | number
    isAvailable?: BoolFilter<"Helper"> | boolean
    lat?: FloatFilter<"Helper"> | number
    lng?: FloatFilter<"Helper"> | number
    locationLabel?: StringNullableFilter<"Helper"> | string | null
    radiusKm?: FloatNullableFilter<"Helper"> | number | null
    profilePhotoUrl?: StringNullableFilter<"Helper"> | string | null
    idNumber?: StringNullableFilter<"Helper"> | string | null
    createdAt?: DateTimeFilter<"Helper"> | Date | string
    skills?: HelperSkillListRelationFilter
    availability?: HelperAvailabilityListRelationFilter
    applications?: BuddyApplicationListRelationFilter
    assignments?: BuddyAssignmentListRelationFilter
    ratings?: RatingListRelationFilter
  }

  export type HelperOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    isAvailable?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    locationLabel?: SortOrderInput | SortOrder
    radiusKm?: SortOrderInput | SortOrder
    profilePhotoUrl?: SortOrderInput | SortOrder
    idNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    skills?: HelperSkillOrderByRelationAggregateInput
    availability?: HelperAvailabilityOrderByRelationAggregateInput
    applications?: BuddyApplicationOrderByRelationAggregateInput
    assignments?: BuddyAssignmentOrderByRelationAggregateInput
    ratings?: RatingOrderByRelationAggregateInput
  }

  export type HelperWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: HelperWhereInput | HelperWhereInput[]
    OR?: HelperWhereInput[]
    NOT?: HelperWhereInput | HelperWhereInput[]
    name?: StringFilter<"Helper"> | string
    passwordHash?: StringFilter<"Helper"> | string
    status?: EnumBuddyStatusFilter<"Helper"> | $Enums.BuddyStatus
    rating?: FloatFilter<"Helper"> | number
    isAvailable?: BoolFilter<"Helper"> | boolean
    lat?: FloatFilter<"Helper"> | number
    lng?: FloatFilter<"Helper"> | number
    locationLabel?: StringNullableFilter<"Helper"> | string | null
    radiusKm?: FloatNullableFilter<"Helper"> | number | null
    profilePhotoUrl?: StringNullableFilter<"Helper"> | string | null
    idNumber?: StringNullableFilter<"Helper"> | string | null
    createdAt?: DateTimeFilter<"Helper"> | Date | string
    skills?: HelperSkillListRelationFilter
    availability?: HelperAvailabilityListRelationFilter
    applications?: BuddyApplicationListRelationFilter
    assignments?: BuddyAssignmentListRelationFilter
    ratings?: RatingListRelationFilter
  }, "id" | "email" | "phone">

  export type HelperOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    isAvailable?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    locationLabel?: SortOrderInput | SortOrder
    radiusKm?: SortOrderInput | SortOrder
    profilePhotoUrl?: SortOrderInput | SortOrder
    idNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: HelperCountOrderByAggregateInput
    _avg?: HelperAvgOrderByAggregateInput
    _max?: HelperMaxOrderByAggregateInput
    _min?: HelperMinOrderByAggregateInput
    _sum?: HelperSumOrderByAggregateInput
  }

  export type HelperScalarWhereWithAggregatesInput = {
    AND?: HelperScalarWhereWithAggregatesInput | HelperScalarWhereWithAggregatesInput[]
    OR?: HelperScalarWhereWithAggregatesInput[]
    NOT?: HelperScalarWhereWithAggregatesInput | HelperScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Helper"> | string
    name?: StringWithAggregatesFilter<"Helper"> | string
    email?: StringWithAggregatesFilter<"Helper"> | string
    phone?: StringWithAggregatesFilter<"Helper"> | string
    passwordHash?: StringWithAggregatesFilter<"Helper"> | string
    status?: EnumBuddyStatusWithAggregatesFilter<"Helper"> | $Enums.BuddyStatus
    rating?: FloatWithAggregatesFilter<"Helper"> | number
    isAvailable?: BoolWithAggregatesFilter<"Helper"> | boolean
    lat?: FloatWithAggregatesFilter<"Helper"> | number
    lng?: FloatWithAggregatesFilter<"Helper"> | number
    locationLabel?: StringNullableWithAggregatesFilter<"Helper"> | string | null
    radiusKm?: FloatNullableWithAggregatesFilter<"Helper"> | number | null
    profilePhotoUrl?: StringNullableWithAggregatesFilter<"Helper"> | string | null
    idNumber?: StringNullableWithAggregatesFilter<"Helper"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Helper"> | Date | string
  }

  export type HelperSkillWhereInput = {
    AND?: HelperSkillWhereInput | HelperSkillWhereInput[]
    OR?: HelperSkillWhereInput[]
    NOT?: HelperSkillWhereInput | HelperSkillWhereInput[]
    id?: StringFilter<"HelperSkill"> | string
    helperId?: StringFilter<"HelperSkill"> | string
    taskType?: EnumTaskTypeFilter<"HelperSkill"> | $Enums.TaskType
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }

  export type HelperSkillOrderByWithRelationInput = {
    id?: SortOrder
    helperId?: SortOrder
    taskType?: SortOrder
    helper?: HelperOrderByWithRelationInput
  }

  export type HelperSkillWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HelperSkillWhereInput | HelperSkillWhereInput[]
    OR?: HelperSkillWhereInput[]
    NOT?: HelperSkillWhereInput | HelperSkillWhereInput[]
    helperId?: StringFilter<"HelperSkill"> | string
    taskType?: EnumTaskTypeFilter<"HelperSkill"> | $Enums.TaskType
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }, "id">

  export type HelperSkillOrderByWithAggregationInput = {
    id?: SortOrder
    helperId?: SortOrder
    taskType?: SortOrder
    _count?: HelperSkillCountOrderByAggregateInput
    _max?: HelperSkillMaxOrderByAggregateInput
    _min?: HelperSkillMinOrderByAggregateInput
  }

  export type HelperSkillScalarWhereWithAggregatesInput = {
    AND?: HelperSkillScalarWhereWithAggregatesInput | HelperSkillScalarWhereWithAggregatesInput[]
    OR?: HelperSkillScalarWhereWithAggregatesInput[]
    NOT?: HelperSkillScalarWhereWithAggregatesInput | HelperSkillScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HelperSkill"> | string
    helperId?: StringWithAggregatesFilter<"HelperSkill"> | string
    taskType?: EnumTaskTypeWithAggregatesFilter<"HelperSkill"> | $Enums.TaskType
  }

  export type HelperAvailabilityWhereInput = {
    AND?: HelperAvailabilityWhereInput | HelperAvailabilityWhereInput[]
    OR?: HelperAvailabilityWhereInput[]
    NOT?: HelperAvailabilityWhereInput | HelperAvailabilityWhereInput[]
    id?: StringFilter<"HelperAvailability"> | string
    helperId?: StringFilter<"HelperAvailability"> | string
    dayOfWeek?: IntFilter<"HelperAvailability"> | number
    startTime?: StringFilter<"HelperAvailability"> | string
    endTime?: StringFilter<"HelperAvailability"> | string
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }

  export type HelperAvailabilityOrderByWithRelationInput = {
    id?: SortOrder
    helperId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    helper?: HelperOrderByWithRelationInput
  }

  export type HelperAvailabilityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HelperAvailabilityWhereInput | HelperAvailabilityWhereInput[]
    OR?: HelperAvailabilityWhereInput[]
    NOT?: HelperAvailabilityWhereInput | HelperAvailabilityWhereInput[]
    helperId?: StringFilter<"HelperAvailability"> | string
    dayOfWeek?: IntFilter<"HelperAvailability"> | number
    startTime?: StringFilter<"HelperAvailability"> | string
    endTime?: StringFilter<"HelperAvailability"> | string
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }, "id">

  export type HelperAvailabilityOrderByWithAggregationInput = {
    id?: SortOrder
    helperId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    _count?: HelperAvailabilityCountOrderByAggregateInput
    _avg?: HelperAvailabilityAvgOrderByAggregateInput
    _max?: HelperAvailabilityMaxOrderByAggregateInput
    _min?: HelperAvailabilityMinOrderByAggregateInput
    _sum?: HelperAvailabilitySumOrderByAggregateInput
  }

  export type HelperAvailabilityScalarWhereWithAggregatesInput = {
    AND?: HelperAvailabilityScalarWhereWithAggregatesInput | HelperAvailabilityScalarWhereWithAggregatesInput[]
    OR?: HelperAvailabilityScalarWhereWithAggregatesInput[]
    NOT?: HelperAvailabilityScalarWhereWithAggregatesInput | HelperAvailabilityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HelperAvailability"> | string
    helperId?: StringWithAggregatesFilter<"HelperAvailability"> | string
    dayOfWeek?: IntWithAggregatesFilter<"HelperAvailability"> | number
    startTime?: StringWithAggregatesFilter<"HelperAvailability"> | string
    endTime?: StringWithAggregatesFilter<"HelperAvailability"> | string
  }

  export type BuddyRequestWhereInput = {
    AND?: BuddyRequestWhereInput | BuddyRequestWhereInput[]
    OR?: BuddyRequestWhereInput[]
    NOT?: BuddyRequestWhereInput | BuddyRequestWhereInput[]
    id?: StringFilter<"BuddyRequest"> | string
    sellerId?: StringFilter<"BuddyRequest"> | string
    taskType?: EnumTaskTypeFilter<"BuddyRequest"> | $Enums.TaskType
    locationLabel?: StringFilter<"BuddyRequest"> | string
    lat?: FloatFilter<"BuddyRequest"> | number
    lng?: FloatFilter<"BuddyRequest"> | number
    startTime?: DateTimeFilter<"BuddyRequest"> | Date | string
    endTime?: DateTimeFilter<"BuddyRequest"> | Date | string
    durationHours?: FloatFilter<"BuddyRequest"> | number
    compensation?: FloatNullableFilter<"BuddyRequest"> | number | null
    status?: EnumBuddyRequestStatusFilter<"BuddyRequest"> | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFilter<"BuddyRequest"> | Date | string
    applications?: BuddyApplicationListRelationFilter
    assignments?: BuddyAssignmentListRelationFilter
    ratings?: RatingListRelationFilter
  }

  export type BuddyRequestOrderByWithRelationInput = {
    id?: SortOrder
    sellerId?: SortOrder
    taskType?: SortOrder
    locationLabel?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    applications?: BuddyApplicationOrderByRelationAggregateInput
    assignments?: BuddyAssignmentOrderByRelationAggregateInput
    ratings?: RatingOrderByRelationAggregateInput
  }

  export type BuddyRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BuddyRequestWhereInput | BuddyRequestWhereInput[]
    OR?: BuddyRequestWhereInput[]
    NOT?: BuddyRequestWhereInput | BuddyRequestWhereInput[]
    sellerId?: StringFilter<"BuddyRequest"> | string
    taskType?: EnumTaskTypeFilter<"BuddyRequest"> | $Enums.TaskType
    locationLabel?: StringFilter<"BuddyRequest"> | string
    lat?: FloatFilter<"BuddyRequest"> | number
    lng?: FloatFilter<"BuddyRequest"> | number
    startTime?: DateTimeFilter<"BuddyRequest"> | Date | string
    endTime?: DateTimeFilter<"BuddyRequest"> | Date | string
    durationHours?: FloatFilter<"BuddyRequest"> | number
    compensation?: FloatNullableFilter<"BuddyRequest"> | number | null
    status?: EnumBuddyRequestStatusFilter<"BuddyRequest"> | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFilter<"BuddyRequest"> | Date | string
    applications?: BuddyApplicationListRelationFilter
    assignments?: BuddyAssignmentListRelationFilter
    ratings?: RatingListRelationFilter
  }, "id">

  export type BuddyRequestOrderByWithAggregationInput = {
    id?: SortOrder
    sellerId?: SortOrder
    taskType?: SortOrder
    locationLabel?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: BuddyRequestCountOrderByAggregateInput
    _avg?: BuddyRequestAvgOrderByAggregateInput
    _max?: BuddyRequestMaxOrderByAggregateInput
    _min?: BuddyRequestMinOrderByAggregateInput
    _sum?: BuddyRequestSumOrderByAggregateInput
  }

  export type BuddyRequestScalarWhereWithAggregatesInput = {
    AND?: BuddyRequestScalarWhereWithAggregatesInput | BuddyRequestScalarWhereWithAggregatesInput[]
    OR?: BuddyRequestScalarWhereWithAggregatesInput[]
    NOT?: BuddyRequestScalarWhereWithAggregatesInput | BuddyRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BuddyRequest"> | string
    sellerId?: StringWithAggregatesFilter<"BuddyRequest"> | string
    taskType?: EnumTaskTypeWithAggregatesFilter<"BuddyRequest"> | $Enums.TaskType
    locationLabel?: StringWithAggregatesFilter<"BuddyRequest"> | string
    lat?: FloatWithAggregatesFilter<"BuddyRequest"> | number
    lng?: FloatWithAggregatesFilter<"BuddyRequest"> | number
    startTime?: DateTimeWithAggregatesFilter<"BuddyRequest"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"BuddyRequest"> | Date | string
    durationHours?: FloatWithAggregatesFilter<"BuddyRequest"> | number
    compensation?: FloatNullableWithAggregatesFilter<"BuddyRequest"> | number | null
    status?: EnumBuddyRequestStatusWithAggregatesFilter<"BuddyRequest"> | $Enums.BuddyRequestStatus
    createdAt?: DateTimeWithAggregatesFilter<"BuddyRequest"> | Date | string
  }

  export type BuddyApplicationWhereInput = {
    AND?: BuddyApplicationWhereInput | BuddyApplicationWhereInput[]
    OR?: BuddyApplicationWhereInput[]
    NOT?: BuddyApplicationWhereInput | BuddyApplicationWhereInput[]
    id?: StringFilter<"BuddyApplication"> | string
    requestId?: StringFilter<"BuddyApplication"> | string
    helperId?: StringFilter<"BuddyApplication"> | string
    note?: StringNullableFilter<"BuddyApplication"> | string | null
    status?: EnumApplicationStatusFilter<"BuddyApplication"> | $Enums.ApplicationStatus
    createdAt?: DateTimeFilter<"BuddyApplication"> | Date | string
    request?: XOR<BuddyRequestRelationFilter, BuddyRequestWhereInput>
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }

  export type BuddyApplicationOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    request?: BuddyRequestOrderByWithRelationInput
    helper?: HelperOrderByWithRelationInput
  }

  export type BuddyApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BuddyApplicationWhereInput | BuddyApplicationWhereInput[]
    OR?: BuddyApplicationWhereInput[]
    NOT?: BuddyApplicationWhereInput | BuddyApplicationWhereInput[]
    requestId?: StringFilter<"BuddyApplication"> | string
    helperId?: StringFilter<"BuddyApplication"> | string
    note?: StringNullableFilter<"BuddyApplication"> | string | null
    status?: EnumApplicationStatusFilter<"BuddyApplication"> | $Enums.ApplicationStatus
    createdAt?: DateTimeFilter<"BuddyApplication"> | Date | string
    request?: XOR<BuddyRequestRelationFilter, BuddyRequestWhereInput>
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }, "id">

  export type BuddyApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: BuddyApplicationCountOrderByAggregateInput
    _max?: BuddyApplicationMaxOrderByAggregateInput
    _min?: BuddyApplicationMinOrderByAggregateInput
  }

  export type BuddyApplicationScalarWhereWithAggregatesInput = {
    AND?: BuddyApplicationScalarWhereWithAggregatesInput | BuddyApplicationScalarWhereWithAggregatesInput[]
    OR?: BuddyApplicationScalarWhereWithAggregatesInput[]
    NOT?: BuddyApplicationScalarWhereWithAggregatesInput | BuddyApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BuddyApplication"> | string
    requestId?: StringWithAggregatesFilter<"BuddyApplication"> | string
    helperId?: StringWithAggregatesFilter<"BuddyApplication"> | string
    note?: StringNullableWithAggregatesFilter<"BuddyApplication"> | string | null
    status?: EnumApplicationStatusWithAggregatesFilter<"BuddyApplication"> | $Enums.ApplicationStatus
    createdAt?: DateTimeWithAggregatesFilter<"BuddyApplication"> | Date | string
  }

  export type BuddyAssignmentWhereInput = {
    AND?: BuddyAssignmentWhereInput | BuddyAssignmentWhereInput[]
    OR?: BuddyAssignmentWhereInput[]
    NOT?: BuddyAssignmentWhereInput | BuddyAssignmentWhereInput[]
    id?: StringFilter<"BuddyAssignment"> | string
    requestId?: StringFilter<"BuddyAssignment"> | string
    helperId?: StringFilter<"BuddyAssignment"> | string
    status?: EnumAssignmentStatusFilter<"BuddyAssignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeFilter<"BuddyAssignment"> | Date | string
    completedAt?: DateTimeNullableFilter<"BuddyAssignment"> | Date | string | null
    request?: XOR<BuddyRequestRelationFilter, BuddyRequestWhereInput>
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }

  export type BuddyAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    request?: BuddyRequestOrderByWithRelationInput
    helper?: HelperOrderByWithRelationInput
  }

  export type BuddyAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BuddyAssignmentWhereInput | BuddyAssignmentWhereInput[]
    OR?: BuddyAssignmentWhereInput[]
    NOT?: BuddyAssignmentWhereInput | BuddyAssignmentWhereInput[]
    requestId?: StringFilter<"BuddyAssignment"> | string
    helperId?: StringFilter<"BuddyAssignment"> | string
    status?: EnumAssignmentStatusFilter<"BuddyAssignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeFilter<"BuddyAssignment"> | Date | string
    completedAt?: DateTimeNullableFilter<"BuddyAssignment"> | Date | string | null
    request?: XOR<BuddyRequestRelationFilter, BuddyRequestWhereInput>
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }, "id">

  export type BuddyAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: BuddyAssignmentCountOrderByAggregateInput
    _max?: BuddyAssignmentMaxOrderByAggregateInput
    _min?: BuddyAssignmentMinOrderByAggregateInput
  }

  export type BuddyAssignmentScalarWhereWithAggregatesInput = {
    AND?: BuddyAssignmentScalarWhereWithAggregatesInput | BuddyAssignmentScalarWhereWithAggregatesInput[]
    OR?: BuddyAssignmentScalarWhereWithAggregatesInput[]
    NOT?: BuddyAssignmentScalarWhereWithAggregatesInput | BuddyAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BuddyAssignment"> | string
    requestId?: StringWithAggregatesFilter<"BuddyAssignment"> | string
    helperId?: StringWithAggregatesFilter<"BuddyAssignment"> | string
    status?: EnumAssignmentStatusWithAggregatesFilter<"BuddyAssignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeWithAggregatesFilter<"BuddyAssignment"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"BuddyAssignment"> | Date | string | null
  }

  export type RatingWhereInput = {
    AND?: RatingWhereInput | RatingWhereInput[]
    OR?: RatingWhereInput[]
    NOT?: RatingWhereInput | RatingWhereInput[]
    id?: StringFilter<"Rating"> | string
    requestId?: StringFilter<"Rating"> | string
    helperId?: StringFilter<"Rating"> | string
    rating?: FloatFilter<"Rating"> | number
    comment?: StringNullableFilter<"Rating"> | string | null
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    request?: XOR<BuddyRequestRelationFilter, BuddyRequestWhereInput>
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }

  export type RatingOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    rating?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    request?: BuddyRequestOrderByWithRelationInput
    helper?: HelperOrderByWithRelationInput
  }

  export type RatingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RatingWhereInput | RatingWhereInput[]
    OR?: RatingWhereInput[]
    NOT?: RatingWhereInput | RatingWhereInput[]
    requestId?: StringFilter<"Rating"> | string
    helperId?: StringFilter<"Rating"> | string
    rating?: FloatFilter<"Rating"> | number
    comment?: StringNullableFilter<"Rating"> | string | null
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    request?: XOR<BuddyRequestRelationFilter, BuddyRequestWhereInput>
    helper?: XOR<HelperRelationFilter, HelperWhereInput>
  }, "id">

  export type RatingOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    rating?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RatingCountOrderByAggregateInput
    _avg?: RatingAvgOrderByAggregateInput
    _max?: RatingMaxOrderByAggregateInput
    _min?: RatingMinOrderByAggregateInput
    _sum?: RatingSumOrderByAggregateInput
  }

  export type RatingScalarWhereWithAggregatesInput = {
    AND?: RatingScalarWhereWithAggregatesInput | RatingScalarWhereWithAggregatesInput[]
    OR?: RatingScalarWhereWithAggregatesInput[]
    NOT?: RatingScalarWhereWithAggregatesInput | RatingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Rating"> | string
    requestId?: StringWithAggregatesFilter<"Rating"> | string
    helperId?: StringWithAggregatesFilter<"Rating"> | string
    rating?: FloatWithAggregatesFilter<"Rating"> | number
    comment?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Rating"> | Date | string
  }

  export type HelperCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutHelperInput
    ratings?: RatingCreateNestedManyWithoutHelperInput
  }

  export type HelperUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillUncheckedCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityUncheckedCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutHelperInput
    ratings?: RatingUncheckedCreateNestedManyWithoutHelperInput
  }

  export type HelperUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutHelperNestedInput
    ratings?: RatingUpdateManyWithoutHelperNestedInput
  }

  export type HelperUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUncheckedUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUncheckedUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUncheckedUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutHelperNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutHelperNestedInput
  }

  export type HelperCreateManyInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
  }

  export type HelperUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelperUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelperSkillCreateInput = {
    id?: string
    taskType: $Enums.TaskType
    helper: HelperCreateNestedOneWithoutSkillsInput
  }

  export type HelperSkillUncheckedCreateInput = {
    id?: string
    helperId: string
    taskType: $Enums.TaskType
  }

  export type HelperSkillUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    helper?: HelperUpdateOneRequiredWithoutSkillsNestedInput
  }

  export type HelperSkillUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
  }

  export type HelperSkillCreateManyInput = {
    id?: string
    helperId: string
    taskType: $Enums.TaskType
  }

  export type HelperSkillUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
  }

  export type HelperSkillUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
  }

  export type HelperAvailabilityCreateInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    helper: HelperCreateNestedOneWithoutAvailabilityInput
  }

  export type HelperAvailabilityUncheckedCreateInput = {
    id?: string
    helperId: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type HelperAvailabilityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    helper?: HelperUpdateOneRequiredWithoutAvailabilityNestedInput
  }

  export type HelperAvailabilityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type HelperAvailabilityCreateManyInput = {
    id?: string
    helperId: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type HelperAvailabilityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type HelperAvailabilityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type BuddyRequestCreateInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    applications?: BuddyApplicationCreateNestedManyWithoutRequestInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutRequestInput
    ratings?: RatingCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestUncheckedCreateInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutRequestInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutRequestInput
    ratings?: RatingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: BuddyApplicationUpdateManyWithoutRequestNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutRequestNestedInput
    ratings?: RatingUpdateManyWithoutRequestNestedInput
  }

  export type BuddyRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: BuddyApplicationUncheckedUpdateManyWithoutRequestNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutRequestNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type BuddyRequestCreateManyInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
  }

  export type BuddyRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyApplicationCreateInput = {
    id?: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    request: BuddyRequestCreateNestedOneWithoutApplicationsInput
    helper: HelperCreateNestedOneWithoutApplicationsInput
  }

  export type BuddyApplicationUncheckedCreateInput = {
    id?: string
    requestId: string
    helperId: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
  }

  export type BuddyApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: BuddyRequestUpdateOneRequiredWithoutApplicationsNestedInput
    helper?: HelperUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type BuddyApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyApplicationCreateManyInput = {
    id?: string
    requestId: string
    helperId: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
  }

  export type BuddyApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyAssignmentCreateInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    request: BuddyRequestCreateNestedOneWithoutAssignmentsInput
    helper: HelperCreateNestedOneWithoutAssignmentsInput
  }

  export type BuddyAssignmentUncheckedCreateInput = {
    id?: string
    requestId: string
    helperId: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type BuddyAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    request?: BuddyRequestUpdateOneRequiredWithoutAssignmentsNestedInput
    helper?: HelperUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type BuddyAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BuddyAssignmentCreateManyInput = {
    id?: string
    requestId: string
    helperId: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type BuddyAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BuddyAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RatingCreateInput = {
    id?: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
    request: BuddyRequestCreateNestedOneWithoutRatingsInput
    helper: HelperCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateInput = {
    id?: string
    requestId: string
    helperId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type RatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: BuddyRequestUpdateOneRequiredWithoutRatingsNestedInput
    helper?: HelperUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingCreateManyInput = {
    id?: string
    requestId: string
    helperId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type RatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumBuddyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyStatus | EnumBuddyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyStatusFilter<$PrismaModel> | $Enums.BuddyStatus
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type HelperSkillListRelationFilter = {
    every?: HelperSkillWhereInput
    some?: HelperSkillWhereInput
    none?: HelperSkillWhereInput
  }

  export type HelperAvailabilityListRelationFilter = {
    every?: HelperAvailabilityWhereInput
    some?: HelperAvailabilityWhereInput
    none?: HelperAvailabilityWhereInput
  }

  export type BuddyApplicationListRelationFilter = {
    every?: BuddyApplicationWhereInput
    some?: BuddyApplicationWhereInput
    none?: BuddyApplicationWhereInput
  }

  export type BuddyAssignmentListRelationFilter = {
    every?: BuddyAssignmentWhereInput
    some?: BuddyAssignmentWhereInput
    none?: BuddyAssignmentWhereInput
  }

  export type RatingListRelationFilter = {
    every?: RatingWhereInput
    some?: RatingWhereInput
    none?: RatingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type HelperSkillOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HelperAvailabilityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BuddyApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BuddyAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RatingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HelperCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    isAvailable?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    locationLabel?: SortOrder
    radiusKm?: SortOrder
    profilePhotoUrl?: SortOrder
    idNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type HelperAvgOrderByAggregateInput = {
    rating?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    radiusKm?: SortOrder
  }

  export type HelperMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    isAvailable?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    locationLabel?: SortOrder
    radiusKm?: SortOrder
    profilePhotoUrl?: SortOrder
    idNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type HelperMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    isAvailable?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    locationLabel?: SortOrder
    radiusKm?: SortOrder
    profilePhotoUrl?: SortOrder
    idNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type HelperSumOrderByAggregateInput = {
    rating?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    radiusKm?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumBuddyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyStatus | EnumBuddyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyStatusWithAggregatesFilter<$PrismaModel> | $Enums.BuddyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuddyStatusFilter<$PrismaModel>
    _max?: NestedEnumBuddyStatusFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type HelperRelationFilter = {
    is?: HelperWhereInput
    isNot?: HelperWhereInput
  }

  export type HelperSkillCountOrderByAggregateInput = {
    id?: SortOrder
    helperId?: SortOrder
    taskType?: SortOrder
  }

  export type HelperSkillMaxOrderByAggregateInput = {
    id?: SortOrder
    helperId?: SortOrder
    taskType?: SortOrder
  }

  export type HelperSkillMinOrderByAggregateInput = {
    id?: SortOrder
    helperId?: SortOrder
    taskType?: SortOrder
  }

  export type EnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type HelperAvailabilityCountOrderByAggregateInput = {
    id?: SortOrder
    helperId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
  }

  export type HelperAvailabilityAvgOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type HelperAvailabilityMaxOrderByAggregateInput = {
    id?: SortOrder
    helperId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
  }

  export type HelperAvailabilityMinOrderByAggregateInput = {
    id?: SortOrder
    helperId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
  }

  export type HelperAvailabilitySumOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumBuddyRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyRequestStatus | EnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyRequestStatusFilter<$PrismaModel> | $Enums.BuddyRequestStatus
  }

  export type BuddyRequestCountOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    taskType?: SortOrder
    locationLabel?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type BuddyRequestAvgOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrder
  }

  export type BuddyRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    taskType?: SortOrder
    locationLabel?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type BuddyRequestMinOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    taskType?: SortOrder
    locationLabel?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type BuddyRequestSumOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
    durationHours?: SortOrder
    compensation?: SortOrder
  }

  export type EnumBuddyRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyRequestStatus | EnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.BuddyRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuddyRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumBuddyRequestStatusFilter<$PrismaModel>
  }

  export type EnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type BuddyRequestRelationFilter = {
    is?: BuddyRequestWhereInput
    isNot?: BuddyRequestWhereInput
  }

  export type BuddyApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type BuddyApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type BuddyApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type EnumAssignmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusFilter<$PrismaModel> | $Enums.AssignmentStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BuddyAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type BuddyAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type BuddyAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type EnumAssignmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssignmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssignmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAssignmentStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type RatingCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type RatingMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    helperId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type HelperSkillCreateNestedManyWithoutHelperInput = {
    create?: XOR<HelperSkillCreateWithoutHelperInput, HelperSkillUncheckedCreateWithoutHelperInput> | HelperSkillCreateWithoutHelperInput[] | HelperSkillUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperSkillCreateOrConnectWithoutHelperInput | HelperSkillCreateOrConnectWithoutHelperInput[]
    createMany?: HelperSkillCreateManyHelperInputEnvelope
    connect?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
  }

  export type HelperAvailabilityCreateNestedManyWithoutHelperInput = {
    create?: XOR<HelperAvailabilityCreateWithoutHelperInput, HelperAvailabilityUncheckedCreateWithoutHelperInput> | HelperAvailabilityCreateWithoutHelperInput[] | HelperAvailabilityUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperAvailabilityCreateOrConnectWithoutHelperInput | HelperAvailabilityCreateOrConnectWithoutHelperInput[]
    createMany?: HelperAvailabilityCreateManyHelperInputEnvelope
    connect?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
  }

  export type BuddyApplicationCreateNestedManyWithoutHelperInput = {
    create?: XOR<BuddyApplicationCreateWithoutHelperInput, BuddyApplicationUncheckedCreateWithoutHelperInput> | BuddyApplicationCreateWithoutHelperInput[] | BuddyApplicationUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutHelperInput | BuddyApplicationCreateOrConnectWithoutHelperInput[]
    createMany?: BuddyApplicationCreateManyHelperInputEnvelope
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
  }

  export type BuddyAssignmentCreateNestedManyWithoutHelperInput = {
    create?: XOR<BuddyAssignmentCreateWithoutHelperInput, BuddyAssignmentUncheckedCreateWithoutHelperInput> | BuddyAssignmentCreateWithoutHelperInput[] | BuddyAssignmentUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutHelperInput | BuddyAssignmentCreateOrConnectWithoutHelperInput[]
    createMany?: BuddyAssignmentCreateManyHelperInputEnvelope
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
  }

  export type RatingCreateNestedManyWithoutHelperInput = {
    create?: XOR<RatingCreateWithoutHelperInput, RatingUncheckedCreateWithoutHelperInput> | RatingCreateWithoutHelperInput[] | RatingUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutHelperInput | RatingCreateOrConnectWithoutHelperInput[]
    createMany?: RatingCreateManyHelperInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type HelperSkillUncheckedCreateNestedManyWithoutHelperInput = {
    create?: XOR<HelperSkillCreateWithoutHelperInput, HelperSkillUncheckedCreateWithoutHelperInput> | HelperSkillCreateWithoutHelperInput[] | HelperSkillUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperSkillCreateOrConnectWithoutHelperInput | HelperSkillCreateOrConnectWithoutHelperInput[]
    createMany?: HelperSkillCreateManyHelperInputEnvelope
    connect?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
  }

  export type HelperAvailabilityUncheckedCreateNestedManyWithoutHelperInput = {
    create?: XOR<HelperAvailabilityCreateWithoutHelperInput, HelperAvailabilityUncheckedCreateWithoutHelperInput> | HelperAvailabilityCreateWithoutHelperInput[] | HelperAvailabilityUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperAvailabilityCreateOrConnectWithoutHelperInput | HelperAvailabilityCreateOrConnectWithoutHelperInput[]
    createMany?: HelperAvailabilityCreateManyHelperInputEnvelope
    connect?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
  }

  export type BuddyApplicationUncheckedCreateNestedManyWithoutHelperInput = {
    create?: XOR<BuddyApplicationCreateWithoutHelperInput, BuddyApplicationUncheckedCreateWithoutHelperInput> | BuddyApplicationCreateWithoutHelperInput[] | BuddyApplicationUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutHelperInput | BuddyApplicationCreateOrConnectWithoutHelperInput[]
    createMany?: BuddyApplicationCreateManyHelperInputEnvelope
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
  }

  export type BuddyAssignmentUncheckedCreateNestedManyWithoutHelperInput = {
    create?: XOR<BuddyAssignmentCreateWithoutHelperInput, BuddyAssignmentUncheckedCreateWithoutHelperInput> | BuddyAssignmentCreateWithoutHelperInput[] | BuddyAssignmentUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutHelperInput | BuddyAssignmentCreateOrConnectWithoutHelperInput[]
    createMany?: BuddyAssignmentCreateManyHelperInputEnvelope
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
  }

  export type RatingUncheckedCreateNestedManyWithoutHelperInput = {
    create?: XOR<RatingCreateWithoutHelperInput, RatingUncheckedCreateWithoutHelperInput> | RatingCreateWithoutHelperInput[] | RatingUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutHelperInput | RatingCreateOrConnectWithoutHelperInput[]
    createMany?: RatingCreateManyHelperInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumBuddyStatusFieldUpdateOperationsInput = {
    set?: $Enums.BuddyStatus
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type HelperSkillUpdateManyWithoutHelperNestedInput = {
    create?: XOR<HelperSkillCreateWithoutHelperInput, HelperSkillUncheckedCreateWithoutHelperInput> | HelperSkillCreateWithoutHelperInput[] | HelperSkillUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperSkillCreateOrConnectWithoutHelperInput | HelperSkillCreateOrConnectWithoutHelperInput[]
    upsert?: HelperSkillUpsertWithWhereUniqueWithoutHelperInput | HelperSkillUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: HelperSkillCreateManyHelperInputEnvelope
    set?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    disconnect?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    delete?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    connect?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    update?: HelperSkillUpdateWithWhereUniqueWithoutHelperInput | HelperSkillUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: HelperSkillUpdateManyWithWhereWithoutHelperInput | HelperSkillUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: HelperSkillScalarWhereInput | HelperSkillScalarWhereInput[]
  }

  export type HelperAvailabilityUpdateManyWithoutHelperNestedInput = {
    create?: XOR<HelperAvailabilityCreateWithoutHelperInput, HelperAvailabilityUncheckedCreateWithoutHelperInput> | HelperAvailabilityCreateWithoutHelperInput[] | HelperAvailabilityUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperAvailabilityCreateOrConnectWithoutHelperInput | HelperAvailabilityCreateOrConnectWithoutHelperInput[]
    upsert?: HelperAvailabilityUpsertWithWhereUniqueWithoutHelperInput | HelperAvailabilityUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: HelperAvailabilityCreateManyHelperInputEnvelope
    set?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    disconnect?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    delete?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    connect?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    update?: HelperAvailabilityUpdateWithWhereUniqueWithoutHelperInput | HelperAvailabilityUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: HelperAvailabilityUpdateManyWithWhereWithoutHelperInput | HelperAvailabilityUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: HelperAvailabilityScalarWhereInput | HelperAvailabilityScalarWhereInput[]
  }

  export type BuddyApplicationUpdateManyWithoutHelperNestedInput = {
    create?: XOR<BuddyApplicationCreateWithoutHelperInput, BuddyApplicationUncheckedCreateWithoutHelperInput> | BuddyApplicationCreateWithoutHelperInput[] | BuddyApplicationUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutHelperInput | BuddyApplicationCreateOrConnectWithoutHelperInput[]
    upsert?: BuddyApplicationUpsertWithWhereUniqueWithoutHelperInput | BuddyApplicationUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: BuddyApplicationCreateManyHelperInputEnvelope
    set?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    disconnect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    delete?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    update?: BuddyApplicationUpdateWithWhereUniqueWithoutHelperInput | BuddyApplicationUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: BuddyApplicationUpdateManyWithWhereWithoutHelperInput | BuddyApplicationUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: BuddyApplicationScalarWhereInput | BuddyApplicationScalarWhereInput[]
  }

  export type BuddyAssignmentUpdateManyWithoutHelperNestedInput = {
    create?: XOR<BuddyAssignmentCreateWithoutHelperInput, BuddyAssignmentUncheckedCreateWithoutHelperInput> | BuddyAssignmentCreateWithoutHelperInput[] | BuddyAssignmentUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutHelperInput | BuddyAssignmentCreateOrConnectWithoutHelperInput[]
    upsert?: BuddyAssignmentUpsertWithWhereUniqueWithoutHelperInput | BuddyAssignmentUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: BuddyAssignmentCreateManyHelperInputEnvelope
    set?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    disconnect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    delete?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    update?: BuddyAssignmentUpdateWithWhereUniqueWithoutHelperInput | BuddyAssignmentUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: BuddyAssignmentUpdateManyWithWhereWithoutHelperInput | BuddyAssignmentUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: BuddyAssignmentScalarWhereInput | BuddyAssignmentScalarWhereInput[]
  }

  export type RatingUpdateManyWithoutHelperNestedInput = {
    create?: XOR<RatingCreateWithoutHelperInput, RatingUncheckedCreateWithoutHelperInput> | RatingCreateWithoutHelperInput[] | RatingUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutHelperInput | RatingCreateOrConnectWithoutHelperInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutHelperInput | RatingUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: RatingCreateManyHelperInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutHelperInput | RatingUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutHelperInput | RatingUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type HelperSkillUncheckedUpdateManyWithoutHelperNestedInput = {
    create?: XOR<HelperSkillCreateWithoutHelperInput, HelperSkillUncheckedCreateWithoutHelperInput> | HelperSkillCreateWithoutHelperInput[] | HelperSkillUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperSkillCreateOrConnectWithoutHelperInput | HelperSkillCreateOrConnectWithoutHelperInput[]
    upsert?: HelperSkillUpsertWithWhereUniqueWithoutHelperInput | HelperSkillUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: HelperSkillCreateManyHelperInputEnvelope
    set?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    disconnect?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    delete?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    connect?: HelperSkillWhereUniqueInput | HelperSkillWhereUniqueInput[]
    update?: HelperSkillUpdateWithWhereUniqueWithoutHelperInput | HelperSkillUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: HelperSkillUpdateManyWithWhereWithoutHelperInput | HelperSkillUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: HelperSkillScalarWhereInput | HelperSkillScalarWhereInput[]
  }

  export type HelperAvailabilityUncheckedUpdateManyWithoutHelperNestedInput = {
    create?: XOR<HelperAvailabilityCreateWithoutHelperInput, HelperAvailabilityUncheckedCreateWithoutHelperInput> | HelperAvailabilityCreateWithoutHelperInput[] | HelperAvailabilityUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: HelperAvailabilityCreateOrConnectWithoutHelperInput | HelperAvailabilityCreateOrConnectWithoutHelperInput[]
    upsert?: HelperAvailabilityUpsertWithWhereUniqueWithoutHelperInput | HelperAvailabilityUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: HelperAvailabilityCreateManyHelperInputEnvelope
    set?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    disconnect?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    delete?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    connect?: HelperAvailabilityWhereUniqueInput | HelperAvailabilityWhereUniqueInput[]
    update?: HelperAvailabilityUpdateWithWhereUniqueWithoutHelperInput | HelperAvailabilityUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: HelperAvailabilityUpdateManyWithWhereWithoutHelperInput | HelperAvailabilityUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: HelperAvailabilityScalarWhereInput | HelperAvailabilityScalarWhereInput[]
  }

  export type BuddyApplicationUncheckedUpdateManyWithoutHelperNestedInput = {
    create?: XOR<BuddyApplicationCreateWithoutHelperInput, BuddyApplicationUncheckedCreateWithoutHelperInput> | BuddyApplicationCreateWithoutHelperInput[] | BuddyApplicationUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutHelperInput | BuddyApplicationCreateOrConnectWithoutHelperInput[]
    upsert?: BuddyApplicationUpsertWithWhereUniqueWithoutHelperInput | BuddyApplicationUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: BuddyApplicationCreateManyHelperInputEnvelope
    set?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    disconnect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    delete?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    update?: BuddyApplicationUpdateWithWhereUniqueWithoutHelperInput | BuddyApplicationUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: BuddyApplicationUpdateManyWithWhereWithoutHelperInput | BuddyApplicationUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: BuddyApplicationScalarWhereInput | BuddyApplicationScalarWhereInput[]
  }

  export type BuddyAssignmentUncheckedUpdateManyWithoutHelperNestedInput = {
    create?: XOR<BuddyAssignmentCreateWithoutHelperInput, BuddyAssignmentUncheckedCreateWithoutHelperInput> | BuddyAssignmentCreateWithoutHelperInput[] | BuddyAssignmentUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutHelperInput | BuddyAssignmentCreateOrConnectWithoutHelperInput[]
    upsert?: BuddyAssignmentUpsertWithWhereUniqueWithoutHelperInput | BuddyAssignmentUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: BuddyAssignmentCreateManyHelperInputEnvelope
    set?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    disconnect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    delete?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    update?: BuddyAssignmentUpdateWithWhereUniqueWithoutHelperInput | BuddyAssignmentUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: BuddyAssignmentUpdateManyWithWhereWithoutHelperInput | BuddyAssignmentUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: BuddyAssignmentScalarWhereInput | BuddyAssignmentScalarWhereInput[]
  }

  export type RatingUncheckedUpdateManyWithoutHelperNestedInput = {
    create?: XOR<RatingCreateWithoutHelperInput, RatingUncheckedCreateWithoutHelperInput> | RatingCreateWithoutHelperInput[] | RatingUncheckedCreateWithoutHelperInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutHelperInput | RatingCreateOrConnectWithoutHelperInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutHelperInput | RatingUpsertWithWhereUniqueWithoutHelperInput[]
    createMany?: RatingCreateManyHelperInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutHelperInput | RatingUpdateWithWhereUniqueWithoutHelperInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutHelperInput | RatingUpdateManyWithWhereWithoutHelperInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type HelperCreateNestedOneWithoutSkillsInput = {
    create?: XOR<HelperCreateWithoutSkillsInput, HelperUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutSkillsInput
    connect?: HelperWhereUniqueInput
  }

  export type EnumTaskTypeFieldUpdateOperationsInput = {
    set?: $Enums.TaskType
  }

  export type HelperUpdateOneRequiredWithoutSkillsNestedInput = {
    create?: XOR<HelperCreateWithoutSkillsInput, HelperUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutSkillsInput
    upsert?: HelperUpsertWithoutSkillsInput
    connect?: HelperWhereUniqueInput
    update?: XOR<XOR<HelperUpdateToOneWithWhereWithoutSkillsInput, HelperUpdateWithoutSkillsInput>, HelperUncheckedUpdateWithoutSkillsInput>
  }

  export type HelperCreateNestedOneWithoutAvailabilityInput = {
    create?: XOR<HelperCreateWithoutAvailabilityInput, HelperUncheckedCreateWithoutAvailabilityInput>
    connectOrCreate?: HelperCreateOrConnectWithoutAvailabilityInput
    connect?: HelperWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type HelperUpdateOneRequiredWithoutAvailabilityNestedInput = {
    create?: XOR<HelperCreateWithoutAvailabilityInput, HelperUncheckedCreateWithoutAvailabilityInput>
    connectOrCreate?: HelperCreateOrConnectWithoutAvailabilityInput
    upsert?: HelperUpsertWithoutAvailabilityInput
    connect?: HelperWhereUniqueInput
    update?: XOR<XOR<HelperUpdateToOneWithWhereWithoutAvailabilityInput, HelperUpdateWithoutAvailabilityInput>, HelperUncheckedUpdateWithoutAvailabilityInput>
  }

  export type BuddyApplicationCreateNestedManyWithoutRequestInput = {
    create?: XOR<BuddyApplicationCreateWithoutRequestInput, BuddyApplicationUncheckedCreateWithoutRequestInput> | BuddyApplicationCreateWithoutRequestInput[] | BuddyApplicationUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutRequestInput | BuddyApplicationCreateOrConnectWithoutRequestInput[]
    createMany?: BuddyApplicationCreateManyRequestInputEnvelope
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
  }

  export type BuddyAssignmentCreateNestedManyWithoutRequestInput = {
    create?: XOR<BuddyAssignmentCreateWithoutRequestInput, BuddyAssignmentUncheckedCreateWithoutRequestInput> | BuddyAssignmentCreateWithoutRequestInput[] | BuddyAssignmentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutRequestInput | BuddyAssignmentCreateOrConnectWithoutRequestInput[]
    createMany?: BuddyAssignmentCreateManyRequestInputEnvelope
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
  }

  export type RatingCreateNestedManyWithoutRequestInput = {
    create?: XOR<RatingCreateWithoutRequestInput, RatingUncheckedCreateWithoutRequestInput> | RatingCreateWithoutRequestInput[] | RatingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutRequestInput | RatingCreateOrConnectWithoutRequestInput[]
    createMany?: RatingCreateManyRequestInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type BuddyApplicationUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<BuddyApplicationCreateWithoutRequestInput, BuddyApplicationUncheckedCreateWithoutRequestInput> | BuddyApplicationCreateWithoutRequestInput[] | BuddyApplicationUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutRequestInput | BuddyApplicationCreateOrConnectWithoutRequestInput[]
    createMany?: BuddyApplicationCreateManyRequestInputEnvelope
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
  }

  export type BuddyAssignmentUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<BuddyAssignmentCreateWithoutRequestInput, BuddyAssignmentUncheckedCreateWithoutRequestInput> | BuddyAssignmentCreateWithoutRequestInput[] | BuddyAssignmentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutRequestInput | BuddyAssignmentCreateOrConnectWithoutRequestInput[]
    createMany?: BuddyAssignmentCreateManyRequestInputEnvelope
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
  }

  export type RatingUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<RatingCreateWithoutRequestInput, RatingUncheckedCreateWithoutRequestInput> | RatingCreateWithoutRequestInput[] | RatingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutRequestInput | RatingCreateOrConnectWithoutRequestInput[]
    createMany?: RatingCreateManyRequestInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type EnumBuddyRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.BuddyRequestStatus
  }

  export type BuddyApplicationUpdateManyWithoutRequestNestedInput = {
    create?: XOR<BuddyApplicationCreateWithoutRequestInput, BuddyApplicationUncheckedCreateWithoutRequestInput> | BuddyApplicationCreateWithoutRequestInput[] | BuddyApplicationUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutRequestInput | BuddyApplicationCreateOrConnectWithoutRequestInput[]
    upsert?: BuddyApplicationUpsertWithWhereUniqueWithoutRequestInput | BuddyApplicationUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: BuddyApplicationCreateManyRequestInputEnvelope
    set?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    disconnect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    delete?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    update?: BuddyApplicationUpdateWithWhereUniqueWithoutRequestInput | BuddyApplicationUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: BuddyApplicationUpdateManyWithWhereWithoutRequestInput | BuddyApplicationUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: BuddyApplicationScalarWhereInput | BuddyApplicationScalarWhereInput[]
  }

  export type BuddyAssignmentUpdateManyWithoutRequestNestedInput = {
    create?: XOR<BuddyAssignmentCreateWithoutRequestInput, BuddyAssignmentUncheckedCreateWithoutRequestInput> | BuddyAssignmentCreateWithoutRequestInput[] | BuddyAssignmentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutRequestInput | BuddyAssignmentCreateOrConnectWithoutRequestInput[]
    upsert?: BuddyAssignmentUpsertWithWhereUniqueWithoutRequestInput | BuddyAssignmentUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: BuddyAssignmentCreateManyRequestInputEnvelope
    set?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    disconnect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    delete?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    update?: BuddyAssignmentUpdateWithWhereUniqueWithoutRequestInput | BuddyAssignmentUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: BuddyAssignmentUpdateManyWithWhereWithoutRequestInput | BuddyAssignmentUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: BuddyAssignmentScalarWhereInput | BuddyAssignmentScalarWhereInput[]
  }

  export type RatingUpdateManyWithoutRequestNestedInput = {
    create?: XOR<RatingCreateWithoutRequestInput, RatingUncheckedCreateWithoutRequestInput> | RatingCreateWithoutRequestInput[] | RatingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutRequestInput | RatingCreateOrConnectWithoutRequestInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutRequestInput | RatingUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: RatingCreateManyRequestInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutRequestInput | RatingUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutRequestInput | RatingUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type BuddyApplicationUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<BuddyApplicationCreateWithoutRequestInput, BuddyApplicationUncheckedCreateWithoutRequestInput> | BuddyApplicationCreateWithoutRequestInput[] | BuddyApplicationUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyApplicationCreateOrConnectWithoutRequestInput | BuddyApplicationCreateOrConnectWithoutRequestInput[]
    upsert?: BuddyApplicationUpsertWithWhereUniqueWithoutRequestInput | BuddyApplicationUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: BuddyApplicationCreateManyRequestInputEnvelope
    set?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    disconnect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    delete?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    connect?: BuddyApplicationWhereUniqueInput | BuddyApplicationWhereUniqueInput[]
    update?: BuddyApplicationUpdateWithWhereUniqueWithoutRequestInput | BuddyApplicationUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: BuddyApplicationUpdateManyWithWhereWithoutRequestInput | BuddyApplicationUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: BuddyApplicationScalarWhereInput | BuddyApplicationScalarWhereInput[]
  }

  export type BuddyAssignmentUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<BuddyAssignmentCreateWithoutRequestInput, BuddyAssignmentUncheckedCreateWithoutRequestInput> | BuddyAssignmentCreateWithoutRequestInput[] | BuddyAssignmentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: BuddyAssignmentCreateOrConnectWithoutRequestInput | BuddyAssignmentCreateOrConnectWithoutRequestInput[]
    upsert?: BuddyAssignmentUpsertWithWhereUniqueWithoutRequestInput | BuddyAssignmentUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: BuddyAssignmentCreateManyRequestInputEnvelope
    set?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    disconnect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    delete?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    connect?: BuddyAssignmentWhereUniqueInput | BuddyAssignmentWhereUniqueInput[]
    update?: BuddyAssignmentUpdateWithWhereUniqueWithoutRequestInput | BuddyAssignmentUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: BuddyAssignmentUpdateManyWithWhereWithoutRequestInput | BuddyAssignmentUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: BuddyAssignmentScalarWhereInput | BuddyAssignmentScalarWhereInput[]
  }

  export type RatingUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<RatingCreateWithoutRequestInput, RatingUncheckedCreateWithoutRequestInput> | RatingCreateWithoutRequestInput[] | RatingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutRequestInput | RatingCreateOrConnectWithoutRequestInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutRequestInput | RatingUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: RatingCreateManyRequestInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutRequestInput | RatingUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutRequestInput | RatingUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type BuddyRequestCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<BuddyRequestCreateWithoutApplicationsInput, BuddyRequestUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: BuddyRequestCreateOrConnectWithoutApplicationsInput
    connect?: BuddyRequestWhereUniqueInput
  }

  export type HelperCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<HelperCreateWithoutApplicationsInput, HelperUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutApplicationsInput
    connect?: HelperWhereUniqueInput
  }

  export type EnumApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApplicationStatus
  }

  export type BuddyRequestUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<BuddyRequestCreateWithoutApplicationsInput, BuddyRequestUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: BuddyRequestCreateOrConnectWithoutApplicationsInput
    upsert?: BuddyRequestUpsertWithoutApplicationsInput
    connect?: BuddyRequestWhereUniqueInput
    update?: XOR<XOR<BuddyRequestUpdateToOneWithWhereWithoutApplicationsInput, BuddyRequestUpdateWithoutApplicationsInput>, BuddyRequestUncheckedUpdateWithoutApplicationsInput>
  }

  export type HelperUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<HelperCreateWithoutApplicationsInput, HelperUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutApplicationsInput
    upsert?: HelperUpsertWithoutApplicationsInput
    connect?: HelperWhereUniqueInput
    update?: XOR<XOR<HelperUpdateToOneWithWhereWithoutApplicationsInput, HelperUpdateWithoutApplicationsInput>, HelperUncheckedUpdateWithoutApplicationsInput>
  }

  export type BuddyRequestCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<BuddyRequestCreateWithoutAssignmentsInput, BuddyRequestUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: BuddyRequestCreateOrConnectWithoutAssignmentsInput
    connect?: BuddyRequestWhereUniqueInput
  }

  export type HelperCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<HelperCreateWithoutAssignmentsInput, HelperUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutAssignmentsInput
    connect?: HelperWhereUniqueInput
  }

  export type EnumAssignmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssignmentStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BuddyRequestUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<BuddyRequestCreateWithoutAssignmentsInput, BuddyRequestUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: BuddyRequestCreateOrConnectWithoutAssignmentsInput
    upsert?: BuddyRequestUpsertWithoutAssignmentsInput
    connect?: BuddyRequestWhereUniqueInput
    update?: XOR<XOR<BuddyRequestUpdateToOneWithWhereWithoutAssignmentsInput, BuddyRequestUpdateWithoutAssignmentsInput>, BuddyRequestUncheckedUpdateWithoutAssignmentsInput>
  }

  export type HelperUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<HelperCreateWithoutAssignmentsInput, HelperUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutAssignmentsInput
    upsert?: HelperUpsertWithoutAssignmentsInput
    connect?: HelperWhereUniqueInput
    update?: XOR<XOR<HelperUpdateToOneWithWhereWithoutAssignmentsInput, HelperUpdateWithoutAssignmentsInput>, HelperUncheckedUpdateWithoutAssignmentsInput>
  }

  export type BuddyRequestCreateNestedOneWithoutRatingsInput = {
    create?: XOR<BuddyRequestCreateWithoutRatingsInput, BuddyRequestUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: BuddyRequestCreateOrConnectWithoutRatingsInput
    connect?: BuddyRequestWhereUniqueInput
  }

  export type HelperCreateNestedOneWithoutRatingsInput = {
    create?: XOR<HelperCreateWithoutRatingsInput, HelperUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutRatingsInput
    connect?: HelperWhereUniqueInput
  }

  export type BuddyRequestUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<BuddyRequestCreateWithoutRatingsInput, BuddyRequestUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: BuddyRequestCreateOrConnectWithoutRatingsInput
    upsert?: BuddyRequestUpsertWithoutRatingsInput
    connect?: BuddyRequestWhereUniqueInput
    update?: XOR<XOR<BuddyRequestUpdateToOneWithWhereWithoutRatingsInput, BuddyRequestUpdateWithoutRatingsInput>, BuddyRequestUncheckedUpdateWithoutRatingsInput>
  }

  export type HelperUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<HelperCreateWithoutRatingsInput, HelperUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: HelperCreateOrConnectWithoutRatingsInput
    upsert?: HelperUpsertWithoutRatingsInput
    connect?: HelperWhereUniqueInput
    update?: XOR<XOR<HelperUpdateToOneWithWhereWithoutRatingsInput, HelperUpdateWithoutRatingsInput>, HelperUncheckedUpdateWithoutRatingsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumBuddyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyStatus | EnumBuddyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyStatusFilter<$PrismaModel> | $Enums.BuddyStatus
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumBuddyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyStatus | EnumBuddyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyStatus[] | ListEnumBuddyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyStatusWithAggregatesFilter<$PrismaModel> | $Enums.BuddyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuddyStatusFilter<$PrismaModel>
    _max?: NestedEnumBuddyStatusFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumBuddyRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyRequestStatus | EnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyRequestStatusFilter<$PrismaModel> | $Enums.BuddyRequestStatus
  }

  export type NestedEnumBuddyRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuddyRequestStatus | EnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuddyRequestStatus[] | ListEnumBuddyRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBuddyRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.BuddyRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuddyRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumBuddyRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type NestedEnumAssignmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusFilter<$PrismaModel> | $Enums.AssignmentStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssignmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssignmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAssignmentStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type HelperSkillCreateWithoutHelperInput = {
    id?: string
    taskType: $Enums.TaskType
  }

  export type HelperSkillUncheckedCreateWithoutHelperInput = {
    id?: string
    taskType: $Enums.TaskType
  }

  export type HelperSkillCreateOrConnectWithoutHelperInput = {
    where: HelperSkillWhereUniqueInput
    create: XOR<HelperSkillCreateWithoutHelperInput, HelperSkillUncheckedCreateWithoutHelperInput>
  }

  export type HelperSkillCreateManyHelperInputEnvelope = {
    data: HelperSkillCreateManyHelperInput | HelperSkillCreateManyHelperInput[]
    skipDuplicates?: boolean
  }

  export type HelperAvailabilityCreateWithoutHelperInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type HelperAvailabilityUncheckedCreateWithoutHelperInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type HelperAvailabilityCreateOrConnectWithoutHelperInput = {
    where: HelperAvailabilityWhereUniqueInput
    create: XOR<HelperAvailabilityCreateWithoutHelperInput, HelperAvailabilityUncheckedCreateWithoutHelperInput>
  }

  export type HelperAvailabilityCreateManyHelperInputEnvelope = {
    data: HelperAvailabilityCreateManyHelperInput | HelperAvailabilityCreateManyHelperInput[]
    skipDuplicates?: boolean
  }

  export type BuddyApplicationCreateWithoutHelperInput = {
    id?: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    request: BuddyRequestCreateNestedOneWithoutApplicationsInput
  }

  export type BuddyApplicationUncheckedCreateWithoutHelperInput = {
    id?: string
    requestId: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
  }

  export type BuddyApplicationCreateOrConnectWithoutHelperInput = {
    where: BuddyApplicationWhereUniqueInput
    create: XOR<BuddyApplicationCreateWithoutHelperInput, BuddyApplicationUncheckedCreateWithoutHelperInput>
  }

  export type BuddyApplicationCreateManyHelperInputEnvelope = {
    data: BuddyApplicationCreateManyHelperInput | BuddyApplicationCreateManyHelperInput[]
    skipDuplicates?: boolean
  }

  export type BuddyAssignmentCreateWithoutHelperInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    request: BuddyRequestCreateNestedOneWithoutAssignmentsInput
  }

  export type BuddyAssignmentUncheckedCreateWithoutHelperInput = {
    id?: string
    requestId: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type BuddyAssignmentCreateOrConnectWithoutHelperInput = {
    where: BuddyAssignmentWhereUniqueInput
    create: XOR<BuddyAssignmentCreateWithoutHelperInput, BuddyAssignmentUncheckedCreateWithoutHelperInput>
  }

  export type BuddyAssignmentCreateManyHelperInputEnvelope = {
    data: BuddyAssignmentCreateManyHelperInput | BuddyAssignmentCreateManyHelperInput[]
    skipDuplicates?: boolean
  }

  export type RatingCreateWithoutHelperInput = {
    id?: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
    request: BuddyRequestCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateWithoutHelperInput = {
    id?: string
    requestId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type RatingCreateOrConnectWithoutHelperInput = {
    where: RatingWhereUniqueInput
    create: XOR<RatingCreateWithoutHelperInput, RatingUncheckedCreateWithoutHelperInput>
  }

  export type RatingCreateManyHelperInputEnvelope = {
    data: RatingCreateManyHelperInput | RatingCreateManyHelperInput[]
    skipDuplicates?: boolean
  }

  export type HelperSkillUpsertWithWhereUniqueWithoutHelperInput = {
    where: HelperSkillWhereUniqueInput
    update: XOR<HelperSkillUpdateWithoutHelperInput, HelperSkillUncheckedUpdateWithoutHelperInput>
    create: XOR<HelperSkillCreateWithoutHelperInput, HelperSkillUncheckedCreateWithoutHelperInput>
  }

  export type HelperSkillUpdateWithWhereUniqueWithoutHelperInput = {
    where: HelperSkillWhereUniqueInput
    data: XOR<HelperSkillUpdateWithoutHelperInput, HelperSkillUncheckedUpdateWithoutHelperInput>
  }

  export type HelperSkillUpdateManyWithWhereWithoutHelperInput = {
    where: HelperSkillScalarWhereInput
    data: XOR<HelperSkillUpdateManyMutationInput, HelperSkillUncheckedUpdateManyWithoutHelperInput>
  }

  export type HelperSkillScalarWhereInput = {
    AND?: HelperSkillScalarWhereInput | HelperSkillScalarWhereInput[]
    OR?: HelperSkillScalarWhereInput[]
    NOT?: HelperSkillScalarWhereInput | HelperSkillScalarWhereInput[]
    id?: StringFilter<"HelperSkill"> | string
    helperId?: StringFilter<"HelperSkill"> | string
    taskType?: EnumTaskTypeFilter<"HelperSkill"> | $Enums.TaskType
  }

  export type HelperAvailabilityUpsertWithWhereUniqueWithoutHelperInput = {
    where: HelperAvailabilityWhereUniqueInput
    update: XOR<HelperAvailabilityUpdateWithoutHelperInput, HelperAvailabilityUncheckedUpdateWithoutHelperInput>
    create: XOR<HelperAvailabilityCreateWithoutHelperInput, HelperAvailabilityUncheckedCreateWithoutHelperInput>
  }

  export type HelperAvailabilityUpdateWithWhereUniqueWithoutHelperInput = {
    where: HelperAvailabilityWhereUniqueInput
    data: XOR<HelperAvailabilityUpdateWithoutHelperInput, HelperAvailabilityUncheckedUpdateWithoutHelperInput>
  }

  export type HelperAvailabilityUpdateManyWithWhereWithoutHelperInput = {
    where: HelperAvailabilityScalarWhereInput
    data: XOR<HelperAvailabilityUpdateManyMutationInput, HelperAvailabilityUncheckedUpdateManyWithoutHelperInput>
  }

  export type HelperAvailabilityScalarWhereInput = {
    AND?: HelperAvailabilityScalarWhereInput | HelperAvailabilityScalarWhereInput[]
    OR?: HelperAvailabilityScalarWhereInput[]
    NOT?: HelperAvailabilityScalarWhereInput | HelperAvailabilityScalarWhereInput[]
    id?: StringFilter<"HelperAvailability"> | string
    helperId?: StringFilter<"HelperAvailability"> | string
    dayOfWeek?: IntFilter<"HelperAvailability"> | number
    startTime?: StringFilter<"HelperAvailability"> | string
    endTime?: StringFilter<"HelperAvailability"> | string
  }

  export type BuddyApplicationUpsertWithWhereUniqueWithoutHelperInput = {
    where: BuddyApplicationWhereUniqueInput
    update: XOR<BuddyApplicationUpdateWithoutHelperInput, BuddyApplicationUncheckedUpdateWithoutHelperInput>
    create: XOR<BuddyApplicationCreateWithoutHelperInput, BuddyApplicationUncheckedCreateWithoutHelperInput>
  }

  export type BuddyApplicationUpdateWithWhereUniqueWithoutHelperInput = {
    where: BuddyApplicationWhereUniqueInput
    data: XOR<BuddyApplicationUpdateWithoutHelperInput, BuddyApplicationUncheckedUpdateWithoutHelperInput>
  }

  export type BuddyApplicationUpdateManyWithWhereWithoutHelperInput = {
    where: BuddyApplicationScalarWhereInput
    data: XOR<BuddyApplicationUpdateManyMutationInput, BuddyApplicationUncheckedUpdateManyWithoutHelperInput>
  }

  export type BuddyApplicationScalarWhereInput = {
    AND?: BuddyApplicationScalarWhereInput | BuddyApplicationScalarWhereInput[]
    OR?: BuddyApplicationScalarWhereInput[]
    NOT?: BuddyApplicationScalarWhereInput | BuddyApplicationScalarWhereInput[]
    id?: StringFilter<"BuddyApplication"> | string
    requestId?: StringFilter<"BuddyApplication"> | string
    helperId?: StringFilter<"BuddyApplication"> | string
    note?: StringNullableFilter<"BuddyApplication"> | string | null
    status?: EnumApplicationStatusFilter<"BuddyApplication"> | $Enums.ApplicationStatus
    createdAt?: DateTimeFilter<"BuddyApplication"> | Date | string
  }

  export type BuddyAssignmentUpsertWithWhereUniqueWithoutHelperInput = {
    where: BuddyAssignmentWhereUniqueInput
    update: XOR<BuddyAssignmentUpdateWithoutHelperInput, BuddyAssignmentUncheckedUpdateWithoutHelperInput>
    create: XOR<BuddyAssignmentCreateWithoutHelperInput, BuddyAssignmentUncheckedCreateWithoutHelperInput>
  }

  export type BuddyAssignmentUpdateWithWhereUniqueWithoutHelperInput = {
    where: BuddyAssignmentWhereUniqueInput
    data: XOR<BuddyAssignmentUpdateWithoutHelperInput, BuddyAssignmentUncheckedUpdateWithoutHelperInput>
  }

  export type BuddyAssignmentUpdateManyWithWhereWithoutHelperInput = {
    where: BuddyAssignmentScalarWhereInput
    data: XOR<BuddyAssignmentUpdateManyMutationInput, BuddyAssignmentUncheckedUpdateManyWithoutHelperInput>
  }

  export type BuddyAssignmentScalarWhereInput = {
    AND?: BuddyAssignmentScalarWhereInput | BuddyAssignmentScalarWhereInput[]
    OR?: BuddyAssignmentScalarWhereInput[]
    NOT?: BuddyAssignmentScalarWhereInput | BuddyAssignmentScalarWhereInput[]
    id?: StringFilter<"BuddyAssignment"> | string
    requestId?: StringFilter<"BuddyAssignment"> | string
    helperId?: StringFilter<"BuddyAssignment"> | string
    status?: EnumAssignmentStatusFilter<"BuddyAssignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeFilter<"BuddyAssignment"> | Date | string
    completedAt?: DateTimeNullableFilter<"BuddyAssignment"> | Date | string | null
  }

  export type RatingUpsertWithWhereUniqueWithoutHelperInput = {
    where: RatingWhereUniqueInput
    update: XOR<RatingUpdateWithoutHelperInput, RatingUncheckedUpdateWithoutHelperInput>
    create: XOR<RatingCreateWithoutHelperInput, RatingUncheckedCreateWithoutHelperInput>
  }

  export type RatingUpdateWithWhereUniqueWithoutHelperInput = {
    where: RatingWhereUniqueInput
    data: XOR<RatingUpdateWithoutHelperInput, RatingUncheckedUpdateWithoutHelperInput>
  }

  export type RatingUpdateManyWithWhereWithoutHelperInput = {
    where: RatingScalarWhereInput
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyWithoutHelperInput>
  }

  export type RatingScalarWhereInput = {
    AND?: RatingScalarWhereInput | RatingScalarWhereInput[]
    OR?: RatingScalarWhereInput[]
    NOT?: RatingScalarWhereInput | RatingScalarWhereInput[]
    id?: StringFilter<"Rating"> | string
    requestId?: StringFilter<"Rating"> | string
    helperId?: StringFilter<"Rating"> | string
    rating?: FloatFilter<"Rating"> | number
    comment?: StringNullableFilter<"Rating"> | string | null
    createdAt?: DateTimeFilter<"Rating"> | Date | string
  }

  export type HelperCreateWithoutSkillsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    availability?: HelperAvailabilityCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutHelperInput
    ratings?: RatingCreateNestedManyWithoutHelperInput
  }

  export type HelperUncheckedCreateWithoutSkillsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    availability?: HelperAvailabilityUncheckedCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutHelperInput
    ratings?: RatingUncheckedCreateNestedManyWithoutHelperInput
  }

  export type HelperCreateOrConnectWithoutSkillsInput = {
    where: HelperWhereUniqueInput
    create: XOR<HelperCreateWithoutSkillsInput, HelperUncheckedCreateWithoutSkillsInput>
  }

  export type HelperUpsertWithoutSkillsInput = {
    update: XOR<HelperUpdateWithoutSkillsInput, HelperUncheckedUpdateWithoutSkillsInput>
    create: XOR<HelperCreateWithoutSkillsInput, HelperUncheckedCreateWithoutSkillsInput>
    where?: HelperWhereInput
  }

  export type HelperUpdateToOneWithWhereWithoutSkillsInput = {
    where?: HelperWhereInput
    data: XOR<HelperUpdateWithoutSkillsInput, HelperUncheckedUpdateWithoutSkillsInput>
  }

  export type HelperUpdateWithoutSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availability?: HelperAvailabilityUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutHelperNestedInput
    ratings?: RatingUpdateManyWithoutHelperNestedInput
  }

  export type HelperUncheckedUpdateWithoutSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availability?: HelperAvailabilityUncheckedUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUncheckedUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutHelperNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutHelperNestedInput
  }

  export type HelperCreateWithoutAvailabilityInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutHelperInput
    ratings?: RatingCreateNestedManyWithoutHelperInput
  }

  export type HelperUncheckedCreateWithoutAvailabilityInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillUncheckedCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutHelperInput
    ratings?: RatingUncheckedCreateNestedManyWithoutHelperInput
  }

  export type HelperCreateOrConnectWithoutAvailabilityInput = {
    where: HelperWhereUniqueInput
    create: XOR<HelperCreateWithoutAvailabilityInput, HelperUncheckedCreateWithoutAvailabilityInput>
  }

  export type HelperUpsertWithoutAvailabilityInput = {
    update: XOR<HelperUpdateWithoutAvailabilityInput, HelperUncheckedUpdateWithoutAvailabilityInput>
    create: XOR<HelperCreateWithoutAvailabilityInput, HelperUncheckedCreateWithoutAvailabilityInput>
    where?: HelperWhereInput
  }

  export type HelperUpdateToOneWithWhereWithoutAvailabilityInput = {
    where?: HelperWhereInput
    data: XOR<HelperUpdateWithoutAvailabilityInput, HelperUncheckedUpdateWithoutAvailabilityInput>
  }

  export type HelperUpdateWithoutAvailabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutHelperNestedInput
    ratings?: RatingUpdateManyWithoutHelperNestedInput
  }

  export type HelperUncheckedUpdateWithoutAvailabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUncheckedUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUncheckedUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutHelperNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutHelperNestedInput
  }

  export type BuddyApplicationCreateWithoutRequestInput = {
    id?: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    helper: HelperCreateNestedOneWithoutApplicationsInput
  }

  export type BuddyApplicationUncheckedCreateWithoutRequestInput = {
    id?: string
    helperId: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
  }

  export type BuddyApplicationCreateOrConnectWithoutRequestInput = {
    where: BuddyApplicationWhereUniqueInput
    create: XOR<BuddyApplicationCreateWithoutRequestInput, BuddyApplicationUncheckedCreateWithoutRequestInput>
  }

  export type BuddyApplicationCreateManyRequestInputEnvelope = {
    data: BuddyApplicationCreateManyRequestInput | BuddyApplicationCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type BuddyAssignmentCreateWithoutRequestInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    helper: HelperCreateNestedOneWithoutAssignmentsInput
  }

  export type BuddyAssignmentUncheckedCreateWithoutRequestInput = {
    id?: string
    helperId: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type BuddyAssignmentCreateOrConnectWithoutRequestInput = {
    where: BuddyAssignmentWhereUniqueInput
    create: XOR<BuddyAssignmentCreateWithoutRequestInput, BuddyAssignmentUncheckedCreateWithoutRequestInput>
  }

  export type BuddyAssignmentCreateManyRequestInputEnvelope = {
    data: BuddyAssignmentCreateManyRequestInput | BuddyAssignmentCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type RatingCreateWithoutRequestInput = {
    id?: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
    helper: HelperCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateWithoutRequestInput = {
    id?: string
    helperId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type RatingCreateOrConnectWithoutRequestInput = {
    where: RatingWhereUniqueInput
    create: XOR<RatingCreateWithoutRequestInput, RatingUncheckedCreateWithoutRequestInput>
  }

  export type RatingCreateManyRequestInputEnvelope = {
    data: RatingCreateManyRequestInput | RatingCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type BuddyApplicationUpsertWithWhereUniqueWithoutRequestInput = {
    where: BuddyApplicationWhereUniqueInput
    update: XOR<BuddyApplicationUpdateWithoutRequestInput, BuddyApplicationUncheckedUpdateWithoutRequestInput>
    create: XOR<BuddyApplicationCreateWithoutRequestInput, BuddyApplicationUncheckedCreateWithoutRequestInput>
  }

  export type BuddyApplicationUpdateWithWhereUniqueWithoutRequestInput = {
    where: BuddyApplicationWhereUniqueInput
    data: XOR<BuddyApplicationUpdateWithoutRequestInput, BuddyApplicationUncheckedUpdateWithoutRequestInput>
  }

  export type BuddyApplicationUpdateManyWithWhereWithoutRequestInput = {
    where: BuddyApplicationScalarWhereInput
    data: XOR<BuddyApplicationUpdateManyMutationInput, BuddyApplicationUncheckedUpdateManyWithoutRequestInput>
  }

  export type BuddyAssignmentUpsertWithWhereUniqueWithoutRequestInput = {
    where: BuddyAssignmentWhereUniqueInput
    update: XOR<BuddyAssignmentUpdateWithoutRequestInput, BuddyAssignmentUncheckedUpdateWithoutRequestInput>
    create: XOR<BuddyAssignmentCreateWithoutRequestInput, BuddyAssignmentUncheckedCreateWithoutRequestInput>
  }

  export type BuddyAssignmentUpdateWithWhereUniqueWithoutRequestInput = {
    where: BuddyAssignmentWhereUniqueInput
    data: XOR<BuddyAssignmentUpdateWithoutRequestInput, BuddyAssignmentUncheckedUpdateWithoutRequestInput>
  }

  export type BuddyAssignmentUpdateManyWithWhereWithoutRequestInput = {
    where: BuddyAssignmentScalarWhereInput
    data: XOR<BuddyAssignmentUpdateManyMutationInput, BuddyAssignmentUncheckedUpdateManyWithoutRequestInput>
  }

  export type RatingUpsertWithWhereUniqueWithoutRequestInput = {
    where: RatingWhereUniqueInput
    update: XOR<RatingUpdateWithoutRequestInput, RatingUncheckedUpdateWithoutRequestInput>
    create: XOR<RatingCreateWithoutRequestInput, RatingUncheckedCreateWithoutRequestInput>
  }

  export type RatingUpdateWithWhereUniqueWithoutRequestInput = {
    where: RatingWhereUniqueInput
    data: XOR<RatingUpdateWithoutRequestInput, RatingUncheckedUpdateWithoutRequestInput>
  }

  export type RatingUpdateManyWithWhereWithoutRequestInput = {
    where: RatingScalarWhereInput
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyWithoutRequestInput>
  }

  export type BuddyRequestCreateWithoutApplicationsInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    assignments?: BuddyAssignmentCreateNestedManyWithoutRequestInput
    ratings?: RatingCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestUncheckedCreateWithoutApplicationsInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutRequestInput
    ratings?: RatingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestCreateOrConnectWithoutApplicationsInput = {
    where: BuddyRequestWhereUniqueInput
    create: XOR<BuddyRequestCreateWithoutApplicationsInput, BuddyRequestUncheckedCreateWithoutApplicationsInput>
  }

  export type HelperCreateWithoutApplicationsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutHelperInput
    ratings?: RatingCreateNestedManyWithoutHelperInput
  }

  export type HelperUncheckedCreateWithoutApplicationsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillUncheckedCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityUncheckedCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutHelperInput
    ratings?: RatingUncheckedCreateNestedManyWithoutHelperInput
  }

  export type HelperCreateOrConnectWithoutApplicationsInput = {
    where: HelperWhereUniqueInput
    create: XOR<HelperCreateWithoutApplicationsInput, HelperUncheckedCreateWithoutApplicationsInput>
  }

  export type BuddyRequestUpsertWithoutApplicationsInput = {
    update: XOR<BuddyRequestUpdateWithoutApplicationsInput, BuddyRequestUncheckedUpdateWithoutApplicationsInput>
    create: XOR<BuddyRequestCreateWithoutApplicationsInput, BuddyRequestUncheckedCreateWithoutApplicationsInput>
    where?: BuddyRequestWhereInput
  }

  export type BuddyRequestUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: BuddyRequestWhereInput
    data: XOR<BuddyRequestUpdateWithoutApplicationsInput, BuddyRequestUncheckedUpdateWithoutApplicationsInput>
  }

  export type BuddyRequestUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: BuddyAssignmentUpdateManyWithoutRequestNestedInput
    ratings?: RatingUpdateManyWithoutRequestNestedInput
  }

  export type BuddyRequestUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutRequestNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type HelperUpsertWithoutApplicationsInput = {
    update: XOR<HelperUpdateWithoutApplicationsInput, HelperUncheckedUpdateWithoutApplicationsInput>
    create: XOR<HelperCreateWithoutApplicationsInput, HelperUncheckedCreateWithoutApplicationsInput>
    where?: HelperWhereInput
  }

  export type HelperUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: HelperWhereInput
    data: XOR<HelperUpdateWithoutApplicationsInput, HelperUncheckedUpdateWithoutApplicationsInput>
  }

  export type HelperUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutHelperNestedInput
    ratings?: RatingUpdateManyWithoutHelperNestedInput
  }

  export type HelperUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUncheckedUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUncheckedUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutHelperNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutHelperNestedInput
  }

  export type BuddyRequestCreateWithoutAssignmentsInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    applications?: BuddyApplicationCreateNestedManyWithoutRequestInput
    ratings?: RatingCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutRequestInput
    ratings?: RatingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestCreateOrConnectWithoutAssignmentsInput = {
    where: BuddyRequestWhereUniqueInput
    create: XOR<BuddyRequestCreateWithoutAssignmentsInput, BuddyRequestUncheckedCreateWithoutAssignmentsInput>
  }

  export type HelperCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationCreateNestedManyWithoutHelperInput
    ratings?: RatingCreateNestedManyWithoutHelperInput
  }

  export type HelperUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillUncheckedCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityUncheckedCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutHelperInput
    ratings?: RatingUncheckedCreateNestedManyWithoutHelperInput
  }

  export type HelperCreateOrConnectWithoutAssignmentsInput = {
    where: HelperWhereUniqueInput
    create: XOR<HelperCreateWithoutAssignmentsInput, HelperUncheckedCreateWithoutAssignmentsInput>
  }

  export type BuddyRequestUpsertWithoutAssignmentsInput = {
    update: XOR<BuddyRequestUpdateWithoutAssignmentsInput, BuddyRequestUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<BuddyRequestCreateWithoutAssignmentsInput, BuddyRequestUncheckedCreateWithoutAssignmentsInput>
    where?: BuddyRequestWhereInput
  }

  export type BuddyRequestUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: BuddyRequestWhereInput
    data: XOR<BuddyRequestUpdateWithoutAssignmentsInput, BuddyRequestUncheckedUpdateWithoutAssignmentsInput>
  }

  export type BuddyRequestUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: BuddyApplicationUpdateManyWithoutRequestNestedInput
    ratings?: RatingUpdateManyWithoutRequestNestedInput
  }

  export type BuddyRequestUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: BuddyApplicationUncheckedUpdateManyWithoutRequestNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type HelperUpsertWithoutAssignmentsInput = {
    update: XOR<HelperUpdateWithoutAssignmentsInput, HelperUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<HelperCreateWithoutAssignmentsInput, HelperUncheckedCreateWithoutAssignmentsInput>
    where?: HelperWhereInput
  }

  export type HelperUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: HelperWhereInput
    data: XOR<HelperUpdateWithoutAssignmentsInput, HelperUncheckedUpdateWithoutAssignmentsInput>
  }

  export type HelperUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUpdateManyWithoutHelperNestedInput
    ratings?: RatingUpdateManyWithoutHelperNestedInput
  }

  export type HelperUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUncheckedUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUncheckedUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUncheckedUpdateManyWithoutHelperNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutHelperNestedInput
  }

  export type BuddyRequestCreateWithoutRatingsInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    applications?: BuddyApplicationCreateNestedManyWithoutRequestInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestUncheckedCreateWithoutRatingsInput = {
    id?: string
    sellerId: string
    taskType: $Enums.TaskType
    locationLabel: string
    lat: number
    lng: number
    startTime: Date | string
    endTime: Date | string
    durationHours: number
    compensation?: number | null
    status?: $Enums.BuddyRequestStatus
    createdAt?: Date | string
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutRequestInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutRequestInput
  }

  export type BuddyRequestCreateOrConnectWithoutRatingsInput = {
    where: BuddyRequestWhereUniqueInput
    create: XOR<BuddyRequestCreateWithoutRatingsInput, BuddyRequestUncheckedCreateWithoutRatingsInput>
  }

  export type HelperCreateWithoutRatingsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentCreateNestedManyWithoutHelperInput
  }

  export type HelperUncheckedCreateWithoutRatingsInput = {
    id?: string
    name: string
    email: string
    phone: string
    passwordHash: string
    status?: $Enums.BuddyStatus
    rating?: number
    isAvailable?: boolean
    lat: number
    lng: number
    locationLabel?: string | null
    radiusKm?: number | null
    profilePhotoUrl?: string | null
    idNumber?: string | null
    createdAt?: Date | string
    skills?: HelperSkillUncheckedCreateNestedManyWithoutHelperInput
    availability?: HelperAvailabilityUncheckedCreateNestedManyWithoutHelperInput
    applications?: BuddyApplicationUncheckedCreateNestedManyWithoutHelperInput
    assignments?: BuddyAssignmentUncheckedCreateNestedManyWithoutHelperInput
  }

  export type HelperCreateOrConnectWithoutRatingsInput = {
    where: HelperWhereUniqueInput
    create: XOR<HelperCreateWithoutRatingsInput, HelperUncheckedCreateWithoutRatingsInput>
  }

  export type BuddyRequestUpsertWithoutRatingsInput = {
    update: XOR<BuddyRequestUpdateWithoutRatingsInput, BuddyRequestUncheckedUpdateWithoutRatingsInput>
    create: XOR<BuddyRequestCreateWithoutRatingsInput, BuddyRequestUncheckedCreateWithoutRatingsInput>
    where?: BuddyRequestWhereInput
  }

  export type BuddyRequestUpdateToOneWithWhereWithoutRatingsInput = {
    where?: BuddyRequestWhereInput
    data: XOR<BuddyRequestUpdateWithoutRatingsInput, BuddyRequestUncheckedUpdateWithoutRatingsInput>
  }

  export type BuddyRequestUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: BuddyApplicationUpdateManyWithoutRequestNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutRequestNestedInput
  }

  export type BuddyRequestUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    locationLabel?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationHours?: FloatFieldUpdateOperationsInput | number
    compensation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumBuddyRequestStatusFieldUpdateOperationsInput | $Enums.BuddyRequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: BuddyApplicationUncheckedUpdateManyWithoutRequestNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type HelperUpsertWithoutRatingsInput = {
    update: XOR<HelperUpdateWithoutRatingsInput, HelperUncheckedUpdateWithoutRatingsInput>
    create: XOR<HelperCreateWithoutRatingsInput, HelperUncheckedCreateWithoutRatingsInput>
    where?: HelperWhereInput
  }

  export type HelperUpdateToOneWithWhereWithoutRatingsInput = {
    where?: HelperWhereInput
    data: XOR<HelperUpdateWithoutRatingsInput, HelperUncheckedUpdateWithoutRatingsInput>
  }

  export type HelperUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUpdateManyWithoutHelperNestedInput
  }

  export type HelperUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: EnumBuddyStatusFieldUpdateOperationsInput | $Enums.BuddyStatus
    rating?: FloatFieldUpdateOperationsInput | number
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    locationLabel?: NullableStringFieldUpdateOperationsInput | string | null
    radiusKm?: NullableFloatFieldUpdateOperationsInput | number | null
    profilePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: HelperSkillUncheckedUpdateManyWithoutHelperNestedInput
    availability?: HelperAvailabilityUncheckedUpdateManyWithoutHelperNestedInput
    applications?: BuddyApplicationUncheckedUpdateManyWithoutHelperNestedInput
    assignments?: BuddyAssignmentUncheckedUpdateManyWithoutHelperNestedInput
  }

  export type HelperSkillCreateManyHelperInput = {
    id?: string
    taskType: $Enums.TaskType
  }

  export type HelperAvailabilityCreateManyHelperInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type BuddyApplicationCreateManyHelperInput = {
    id?: string
    requestId: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
  }

  export type BuddyAssignmentCreateManyHelperInput = {
    id?: string
    requestId: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type RatingCreateManyHelperInput = {
    id?: string
    requestId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type HelperSkillUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
  }

  export type HelperSkillUncheckedUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
  }

  export type HelperSkillUncheckedUpdateManyWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
  }

  export type HelperAvailabilityUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type HelperAvailabilityUncheckedUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type HelperAvailabilityUncheckedUpdateManyWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type BuddyApplicationUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: BuddyRequestUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type BuddyApplicationUncheckedUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyApplicationUncheckedUpdateManyWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyAssignmentUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    request?: BuddyRequestUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type BuddyAssignmentUncheckedUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BuddyAssignmentUncheckedUpdateManyWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RatingUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: BuddyRequestUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyWithoutHelperInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyApplicationCreateManyRequestInput = {
    id?: string
    helperId: string
    note?: string | null
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
  }

  export type BuddyAssignmentCreateManyRequestInput = {
    id?: string
    helperId: string
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type RatingCreateManyRequestInput = {
    id?: string
    helperId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type BuddyApplicationUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    helper?: HelperUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type BuddyApplicationUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyApplicationUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuddyAssignmentUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    helper?: HelperUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type BuddyAssignmentUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BuddyAssignmentUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RatingUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    helper?: HelperUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    helperId?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use HelperCountOutputTypeDefaultArgs instead
     */
    export type HelperCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HelperCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BuddyRequestCountOutputTypeDefaultArgs instead
     */
    export type BuddyRequestCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BuddyRequestCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HelperDefaultArgs instead
     */
    export type HelperArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HelperDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HelperSkillDefaultArgs instead
     */
    export type HelperSkillArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HelperSkillDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HelperAvailabilityDefaultArgs instead
     */
    export type HelperAvailabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HelperAvailabilityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BuddyRequestDefaultArgs instead
     */
    export type BuddyRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BuddyRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BuddyApplicationDefaultArgs instead
     */
    export type BuddyApplicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BuddyApplicationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BuddyAssignmentDefaultArgs instead
     */
    export type BuddyAssignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BuddyAssignmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RatingDefaultArgs instead
     */
    export type RatingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RatingDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}