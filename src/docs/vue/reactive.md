---
title: reactive.ts 源码分析
---

# reactive.ts 源码分析

## createReactiveObject 函数

重点关注 createReactiveObject 函数，其他函数都是对 createReactiveObject 函数的封装。

createReactiveObject 函数的作用是创建响应式对象，也就是创建 Proxy 对象。

createReactiveObject 函数的参数如下：

- target：目标对象
- isReadonly：是否只读
- baseHandlers：基础处理器
- collectionHandlers：集合处理器
- proxyMap：代理映射

## reactive.ts 源码分析

```ts
/**
 * 创建响应式对象
 * @param target 目标对象
 */
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  // 如果尝试观察只读代理，则返回只读版本。
  if (isReadonly(target))
    return target

  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap,
  )
}

/**
 * 创建浅层响应式对象
 * @param target 目标对象
 */
export function shallowReactive<T extends object>(
  target: T,
): ShallowReactive<T> {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap,
  )
}

/**
 * 创建只读响应式对象
 * @param target 目标对象
 */
export function readonly<T extends object>(
  target: T,
): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap,
  )
}

/**
 * 创建浅层只读响应式对象
 * @param target 目标对象
 */
export function shallowReadonly<T extends object>(target: T): Readonly<T> {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap,
  )
}

/**
 * 创建响应式对象
 * @param target 目标对象
 * @param isReadonly 是否只读
 * @param baseHandlers 基础处理器
 * @param collectionHandlers 集合处理器
 * @param proxyMap 代理映射
 */
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>,
) {
  if (!isObject(target)) {
    if (__DEV__)
      console.warn(`value cannot be made reactive: ${String(target)}`)

    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  // target 已经是一个 Proxy，返回它。
  // 例外：在响应式对象上调用 readonly()
  if (
    target[ReactiveFlags.RAW]
    && !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  )
    return target

  // target already has corresponding Proxy
  // target 已经有了相应的 Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy)
    return existingProxy

  // only specific value types can be observed.
  // 只有特定的值类型可以被观察。
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID)
    return target

  // 创建 Proxy
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
  )
  // 缓存 Proxy
  proxyMap.set(target, proxy)
  return proxy
}

/**
 * 判断是否是响应式对象
 * @param value 值
 */
export function isReactive(value: unknown): boolean {
  if (isReadonly(value))
    return isReactive((value as Target)[ReactiveFlags.RAW])

  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

/**
 * 判断是否是只读响应式对象
 * @param value 值
 */
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

/**
 * 判断是否是浅层响应式对象
 * @param value 值
 */
export function isShallow(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_SHALLOW])
}

/**
 * 判断是否是 Proxy
 * @param value 值
 */
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

/**
 * 解除响应式对象
 * @param observed 响应式对象
 */
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

/**
 * 将一个对象标记为不可被转为代理。返回该对象本身。
 * @param value 值
 */
export function markRaw<T extends object>(value: T): Raw<T> {
  def(value, ReactiveFlags.SKIP, true)
  return value
}

/**
 * 将一个对象转换为响应式对象，返回转换后的代理。
 * @param value 值
 */
export function toReactive<T extends unknown>(value: T): T {
  return isObject(value) ? reactive(value) : value
}

/**
 * 将一个对象转换为只读响应式对象，返回转换后的代理。
 * @param value 值
 */
export function toReadonly<T extends unknown>(value: T): T {
  return isObject(value) ? readonly(value) : value
}
```
