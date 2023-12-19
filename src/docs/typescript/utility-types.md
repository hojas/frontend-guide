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
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any; } ?
    // 如果 `then` 的参数是可调用的，则提取第一个参数
    F extends ((value: infer V, ...args: infer _) => any) ?
      // 递归解开值
      Awaited<V> :
      // `then` 的参数不可调用则返回 `never`
      never :
    // 非对象或非 thenable
    T;
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
type PartialTodo = {
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
type RequiredProps = {
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
type ReadonlyTodo = {
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

type CatName = "miffy" | "boris" | "mordred"

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
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

type TodoPreview = Pick<Todo, "title" | "completed">

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

type TodoPreview = Omit<Todo, "description">

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
type T0 = Exclude<"a" | "b" | "c", "a">
// type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">
// type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>
// type T2 = string | number

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number }
type T3 = Exclude<Shape, { kind: "circle" }>
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
type T0 = Extract<"a" | "b" | "c", "a" | "f">
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>
// type T1 = () => void

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number }
type T2 = Extract<Shape, { kind: "circle" }>
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

## 参考

https://www.typescriptlang.org/docs/handbook/utility-types.html
