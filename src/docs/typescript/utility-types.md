---
title: TypeScript 内置工具类型
---

# TypeScript 内置工具类型

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
// type PartialTodo = {
//  title?: string
//  description?: string
// }
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
// type RequiredProps = {
//   a: number
//   b: string
// }
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
// type ReadonlyTodo = {
//   readonly title: string
// }
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

## 参考

https://www.typescriptlang.org/docs/handbook/utility-types.html
