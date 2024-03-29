---
title: computed 实现原理
---

# computed 实现原理

## ComputedRefImpl 源码分析

```ts
/**
 * 创建计算属性
 * 计算属性是一个副作用函数，所以需要使用 effect 函数来创建
 *
 * @params {fn} 计算属性的函数
 */
export class ComputedRefImpl<T> {
  // 依赖项
  public dep?: Dep = undefined

  // 缓存的值
  private _value!: T
  // 计算属性的副作用函数
  public readonly effect: ReactiveEffect<T>

  // 用于标识是否是 ref 对象
  public readonly __v_isRef = true
  // 用于标识是否是只读的
  public readonly [ReactiveFlags.IS_READONLY]: boolean = false

  // 用于标记是否可以缓存
  public _cacheable: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean,
  ) {
    // 创建计算属性的副作用函数
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(this, DirtyLevels.ComputedValueMaybeDirty),
    )
    // 设置计算属性的副作用函数的标识
    this.effect.computed = this
    // 设置计算属性的缓存策略
    this.effect.active = this._cacheable = !isSSR
    // 设置计算属性的只读标识
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  // 获取计算属性的值
  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    // 计算属性可能会被其他代理包装，例如 readonly() #3376
    const self = toRaw(this)
    // 触发依赖收集
    trackRefValue(self)
    // 如果缓存不可用或者计算属性的副作用函数已经被标记为 dirty，则重新计算
    if (!self._cacheable || self.effect.dirty) {
      // 重新计算
      if (hasChanged(self._value, (self._value = self.effect.run()!)))
        // 如果计算后的值与前值不同，则触发依赖收集
        triggerRefValue(self, DirtyLevels.ComputedValueDirty)
    }
    // 返回计算属性的值
    return self._value
  }

  // 设置计算属性的值
  set value(newValue: T) {
    this._setter(newValue)
  }

  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  // 为了向后兼容 Vue <= 3.3.x 的第三方代码，polyfill _dirty
  get _dirty() {
    return this.effect.dirty
  }

  set _dirty(v) {
    this.effect.dirty = v
  }
  // #endregion
}
```
## computed 源码分析

computed 函数的作用是创建一个计算属性，它的参数有两种形式：

1. 一个函数，这个函数就是计算属性的 getter 函数
2. 一个配置项，配置项中包含 getter 和 setter 函数

源码分析：

```ts
/**
 * 创建计算属性
 *
 * @params {getterOrOptions} 计算属性的函数或者配置项
 * @params {debugOptions} 调试配置项
 * @params {isSSR} 是否是服务端渲染
 */
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false,
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    setter = NOOP
  }
  else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  // 通过 ComputedRefImpl 创建计算属性
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

  return cRef as any
}
```
