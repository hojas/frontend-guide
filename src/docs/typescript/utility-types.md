---
title: TypeScript 内置工具类型的源码实现
---

# TypeScript 内置工具类型的源码实现

## Awaited\<Type>

递归获取 await 或 promise 的 .then() 方法的返回值的类型。

```ts
// Promise
type T1 = Awaited<Promise<string>>
// type T1 = string

// 嵌套 Promise
type T2 = Awaited<Promise<Promise<number>>>
// type T2 = number

// 联合类型，会触发分发
type T3 = Awaited<boolean | Promise<number>>
// type T3 = number | boolean
```

源码实现：

```ts
/**
 * 递归解开类型的“awaited type”。非 Promise 的“thenables”应该解析为 `never`。这模拟了 `await` 的行为。
 */

// 当不在 `--strictNullChecks` 模式下时，`null | undefined` 的特殊情况
type Awaited<T> = T extends null | undefined ? T :
  // `await` 只解开具有可调用 `then` 的对象类型。非对象类型不会解开
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ?
    // 如果 `then` 的参数是可调用的，则提取第一个参数
    F extends ((value: infer V, ...args: infer _) => any) ?
      // 递归解开值
      Awaited<V> :
      // `then` 的参数不可调用则返回 `never`
      never :
    // 非对象或非 thenable
    T
```

## Partial\<Type>

将 Type 的所有属性设置为可选。

```ts
interface Todo {
  title: string
  description: string
}

type PartialTodo = Partial<Todo>

// 等价于
interface PartialTodo {
  title?: string
  description?: string
}
```

源码实现：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

## Required\<Type>

将 Type 的所有属性设置为必填，与 Partial 相反。

```ts
interface Props {
  a?: number
  b?: string
}

type RequiredProps = Required<Props>

// 等价于
interface RequiredProps {
  a: number
  b: string
}
```

源码实现：

```ts
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

## Readonly\<Type>

将 Type 的所有属性设置为只读。

```ts
interface Todo {
  title: string
}

type ReadonlyTodo = Readonly<Todo>

// 等价于
interface ReadonlyTodo {
  readonly title: string
}
```

源码实现：

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

## Record<Keys, Type>

构造一个属性键为 Keys、属性值为 Type 的对象类型。该工具可用于将一个类型的属性映射到另一个类型。

```ts
interface CatInfo {
  age: number
  breed: string
}

type CatName = 'miffy' | 'boris' | 'mordred'

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: 'Persian' },
  boris: { age: 5, breed: 'Maine Coon' },
  mordred: { age: 16, breed: 'British Shorthair' },
}
```

源码实现：

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

## Pick<Type, Keys>

从 Type 中选取属性 Keys（字符串字面量或字符串字面量的组合）集，构建一个类型。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>

// 等价于
interface TodoPreview {
  title: string
  completed: boolean
}
```

源码实现：

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

## Omit<Type, Keys>

从 Type 中选取所有属性，然后删除键（字符串字面量或字符串字面量的联合），从而构造一个类型。与 Pick 相反。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
  createdAt: number
}

type TodoPreview = Omit<Todo, 'description'>

// 等价于
interface TodoPreview {
  title: string
  completed: boolean
  createdAt: number
}
```

源码实现：

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## Exclude<UnionType, ExcludedMembers>

通过从 UnionType 中排除所有可赋值给 ExcludedMembers 的联合成员来构造一个类型。

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// type T0 = "b" | "c"

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>
// type T2 = string | number

type Shape =
  | { kind: 'circle', radius: number }
  | { kind: 'square', x: number }
  | { kind: 'triangle', x: number, y: number }
type T3 = Exclude<Shape, { kind: 'circle' }>
// type T3 = {
//   kind: "square"
//   x: number
// } | {
//   kind: "triangle"
//   x: number
//   y: number
// }
```

源码实现：

```ts
type Exclude<T, U> = T extends U ? never : T
```

## Extract<Type, Union>

从 Type 中提取可赋值给 Union 的所有 union 成员，从而构造一个类型。

```ts
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>
// type T1 = () => void

type Shape =
  | { kind: 'circle', radius: number }
  | { kind: 'square', x: number }
  | { kind: 'triangle', x: number, y: number }
type T2 = Extract<Shape, { kind: 'circle' }>
// type T2 = {
//   kind: "circle";
//   radius: number;
// }
```

源码实现：

```ts
type Extract<T, U> = T extends U ? T : never
```

## NonNullable\<Type>

通过从 Type 中排除 null 和 undefined 来构造一个类型。

```ts
type T0 = NonNullable<string | number | undefined>
// type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>
// type T1 = string[]
```

源码实现：

```ts
type NonNullable<T> = T extends null | undefined ? never : T
```

## Parameters\<Type>

从函数类型 Type 的参数中使用的类型构造一个元组类型。

对于重载函数，这将是最后一个签名的参数。

```ts
type T0 = Parameters<() => string>
// type T0 = []

type T1 = Parameters<(s: string) => void>
// type T1 = [s: string]

type T2 = Parameters<<T>(arg: T) => T>
// type T2 = [arg: unknown]
```

源码实现：

```ts
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never
```

## ConstructorParameters\<Type>

根据构造函数类型构造一个元组或数组类型。它会生成一个包含所有参数类型的元组类型（如果 Type 不是函数，则生成 never 类型）。

```ts
type T0 = ConstructorParameters<ErrorConstructor>
// type T0 = [message?: string]

 type T1 = ConstructorParameters<FunctionConstructor>
// type T1 = string[]

type T2 = ConstructorParameters<RegExpConstructor>
// type T2 = [pattern: string | RegExp, flags?: string]

class C {
  constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>
// type T3 = [a: number, b: string]
```

源码实现：

```ts
 type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never
```

## ReturnType\<Type>

从函数类型 Type 的返回类型中提取类型。

```ts
type T0 = ReturnType<() => string>
// type T0 = string

type T1 = ReturnType<(s: string) => void>
// type T1 = void

type T2 = ReturnType<<T>() => T>
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>
// type T3 = number[]

type T4 = ReturnType<typeof f1>
// type T4 = {
//   a: number;
//   b: string;
// }
declare function f1(s: string): { a: number, b: string }
```

源码实现：

```ts
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any
```

## InstanceType\<Type>

从构造函数类型 Type 的实例类型中提取类型。

```ts
class C {
  x = 0
  y = 0
}

type T0 = InstanceType<typeof C>
// type T0 = C
```

源码实现：

```ts
type InstanceType<T extends new (...args: any) => any> =
  T extends new (...args: any) => infer R ? R : any
```

## ThisParameterType\<Type>

从函数类型 Type 的 this 参数中提取类型。

```ts
function toHex(this: number) {
  return this.toString(16)
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n)
}
```

源码实现：

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown
```

## OmitThisParameter\<Type>

从函数类型 Type 中删除 this 参数。

```ts
function toHex(this: number) {
  return this.toString(16)
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5)
```

源码实现：

```ts
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T
```

## ThisType\<Type>

用于指定 this 的类型。注意，这只是一个标记，它不会转换类型。

```ts
interface ObjectDescriptor<D, M> {
  data?: D
  methods?: M & ThisType<D & M> // Type of 'this' in methods is D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  const data: object = desc.data || {}
  const methods: object = desc.methods || {}
  return { ...data, ...methods } as D & M
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx // Strongly typed this
      this.y += dy // Strongly typed this
    }
  }
})

obj.x = 10
obj.y = 20

obj.moveBy(5, 5)
```

源码实现：

```ts
interface ThisType<T> { }
```

## 字符串操作类型

Typescript 内置封装了四个主要的工具类型，为了性能将其内置在编译器中实现。

### Uppercase\<StringType>

将字符串转换为大写字母。

```ts
type T0 = Uppercase<'foo'>
// type T0 = "FOO"

type T1 = Uppercase<'FOO'>
// type T1 = "FOO"

type T2 = Uppercase<'foo' | 'bar'>
// type T2 = "FOO" | "BAR"
```

源码实现：

```ts
type Uppercase<S extends string> = intrinsic
```

### Lowercase\<StringType>

将字符串转换为小写字母。

```ts
type T0 = Lowercase<'FOO'>
// type T0 = "foo"

type T1 = Lowercase<'foo'>
// type T1 = "foo"

type T2 = Lowercase<'foo' | 'BAR'>
// type T2 = "foo" | "bar"
```

源码实现：

```ts
type Lowercase<S extends string> = intrinsic
```

### Capitalize\<StringType>

> 本征字符串操作类型。

将字符串的首字母转换为大写。

```ts
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

源码实现：

```ts
type Capitalize<S extends string> = intrinsic
```

### Uncapitalize\<StringType>

> 本征字符串操作类型。

将字符串的首字母转换为小写。

```ts
type uncapitalized = Uncapitalize<'Hello World'> // expected to be 'hello World'
```

源码实现：

```ts
type Uncapitalize<S extends string> = intrinsic
```

## 参考

https://www.typescriptlang.org/docs/handbook/utility-types.html
