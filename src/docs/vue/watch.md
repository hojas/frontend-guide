---
title: watch 的实现原理
---

# watch 的实现原理

watch 和 watchEffect 都是通过 doWatch 函数实现的，watchEffect 会在组件初始化时立即执行一次，而 watch 则可以通过 immediate 选项来控制是否立即执行。

## doWatch 源码分析

```ts
function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  {
    immediate,
    deep,
    flush,
    once,
    onTrack,
    onTrigger,
  }: WatchOptions = EMPTY_OBJ,
): WatchStopHandle {
  if (cb && once) {
    const _cb = cb
    cb = (...args) => {
      _cb(...args)
      unwatch()
    }
  }

  const warnInvalidSource = (s: unknown) => {
    warn(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, `
      + `a reactive object, or an array of these types.`,
    )
  }

  const instance = currentInstance
  const reactiveGetter = (source: object) =>
    deep === true
      ? source // traverse will happen in wrapped getter below
      : // for deep: false, only traverse root-level properties
      traverse(source, deep === false ? 1 : undefined)

  // 副作用函数
  let getter: () => any
  // 标识是否需要强制更新
  let forceTrigger = false
  // 标识是否是多源
  let isMultiSource = false

  // 如果 source 是 ref 对象
  if (isRef(source)) {
    getter = () => source.value
    forceTrigger = isShallow(source)
  }
  // 如果 source 是 reactive 对象
  else if (isReactive(source)) {
    getter = () => reactiveGetter(source)
    forceTrigger = true
  }
  // 如果 source 是数组
  else if (isArray(source)) {
    isMultiSource = true
    forceTrigger = source.some(s => isReactive(s) || isShallow(s))
    getter = () =>
      // 数组中的每一项都要判断
      source.map((s) => {
        if (isRef(s))
          return s.value
        else if (isReactive(s))
          return reactiveGetter(s)
        else if (isFunction(s))
          return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
        else
          __DEV__ && warnInvalidSource(s)
      })
  }
  // 如果 source 是函数
  else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      // getter 就是 source 函数执行的结果
    // 这种情况一般是 watch 中的数据源以函数的形式传入
      getter = () =>
        callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
    }
    else {
      // no cb -> simple effect
      // 没有回调函数，就是 watchEffect
      getter = () => {
        if (cleanup)
          cleanup()

        return callWithAsyncErrorHandling(
          source,
          instance,
          ErrorCodes.WATCH_CALLBACK,
          [onCleanup],
        )
      }
    }
  }
  else {
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }

  // 2.x array mutation watch compat
  if (__COMPAT__ && cb && !deep) {
    const baseGetter = getter
    getter = () => {
      const val = baseGetter()
      if (
        isArray(val)
        && checkCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance)
      )
        traverse(val)

      return val
    }
  }

  // 当有回调并且 deep 为 true 时，将使用 traverse 来包裹 getter 函数
  // 对数据源中的每个属性递归遍历进行监听
  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  // 声明 cleanup 和 onCleanup 函数
  // 在 onCleanup 函数的执行过程中给 cleanup 函数赋值
  // 当副作用函数执行一些异步的副作用，这些响应需要在其失效时清除
  // 所以侦听副作用传入的函数可以接收一个 onCleanup 函数作为入参，用来注册清理失效时的回调。
  // 当以下情况发生时，这个失效回调会被触发：
  // 1. 副作用即将重新执行时
  // 2. 侦听器被停止（如果在 setup() 或生命周期钩子函数中使用了 watchEffect，则在组件卸载时）
  let cleanup: (() => void) | undefined
  let onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, ErrorCodes.WATCH_CLEANUP)
      cleanup = effect.onStop = undefined
    }
  }

  // in SSR there is no need to setup an actual effect, and it should be noop
  // unless it's eager or sync flush
  let ssrCleanup: (() => void)[] | undefined
  if (__SSR__ && isInSSRComponentSetup) {
    // we will also not call the invalidate callback (+ runner is not set up)
    onCleanup = NOOP
    if (!cb) {
      getter()
    }
    else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
        getter(),
        isMultiSource ? [] : undefined,
        onCleanup,
      ])
    }
    if (flush === 'sync') {
      const ctx = useSSRContext()!
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = [])
    }
    else {
      return NOOP
    }
  }

  // 初始化 oldValue
  let oldValue: any = isMultiSource
    ? Array.from({ length: (source as []).length }).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE
  // 声明一个 job 函数
  // 这个函数最终会作为调度器中的回调函数传入
  const job: SchedulerJob = () => {
    if (!effect.active || !effect.dirty)
      return

    if (cb) {
      // watch(source, cb)
      const newValue = effect.run()
      if (
        deep
        || forceTrigger
        || (isMultiSource
          ? (newValue as any[]).some((v, i) => hasChanged(v, oldValue[i]))
          : hasChanged(newValue, oldValue))
          || (__COMPAT__
          && isArray(newValue)
          && isCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance))
      ) {
        // cleanup before running cb again
        // 在再次运行 cb 之前清理
        if (cleanup)
          cleanup()

        callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          // 如果是第一次改变，将旧值传入 undefined
          oldValue === INITIAL_WATCHER_VALUE
            ? undefined
            : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE
              ? []
              : oldValue,
          onCleanup,
        ])
        oldValue = newValue
      }
    }
    else {
      // watchEffect
      effect.run()
    }
  }

  // important: mark the job as a watcher callback so that scheduler knows
  // it is allowed to self-trigger (#1727)
  // 重要：让调度器任务作为侦听器的回调以至于调度器能知道它可以被允许自己派发更新
  job.allowRecurse = !!cb

  // 声明一个 scheduler 的调度器对象
  let scheduler: EffectScheduler
  // 当 flush 为 sync 同步时，直接将 job 赋值给 scheduler
  // 这样这个调度器函数就会直接执行
  if (flush === 'sync') {
    scheduler = job as any // the scheduler function gets called directly
  }
  // 当 flush 为 post 需要延迟执行时，将 job 传入 queuePostRenderEffect 中
  // 这样 job 会被添加进一个延迟执行的队列中
  // 这个队列会在组件被挂载后、更新的生命周期中执行
  else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  }
  // 最后是 flush 为默认的 pre 优先执行的情况
  // 这时调度器会区分组件是否已经挂载
  // 副作用第一次调用时必须是在组件挂载之前
  // 而挂载后则会被推入一个优先执行时机的队列中
  else {
    // default: 'pre'
    job.pre = true
    if (instance)
      job.id = instance.uid
    scheduler = () => queueJob(job)
  }

  // 创建一个副作用函数
  const effect = new ReactiveEffect(getter, NOOP, scheduler)

  const scope = getCurrentScope()
  // 清理 watch 函数
  const unwatch = () => {
    effect.stop()
    if (scope)
      remove(scope.effects, effect)
  }

  if (__DEV__) {
    effect.onTrack = onTrack
    effect.onTrigger = onTrigger
  }

  // initial run
  // 初始化调用副作用函数
  // 如果 immediate 为 true，立即执行一次
  if (cb) {
    if (immediate)
      job()
    else
      oldValue = effect.run()
  }
  // 如果调用时机为 post，则推入延迟执行队列
  else if (flush === 'post') {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense,
    )
  }
  // 其余情况立即首次执行副作用
  else {
    effect.run()
  }

  if (__SSR__ && ssrCleanup)
    ssrCleanup.push(unwatch)
  return unwatch
}
```

## watch 源码

```ts
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchStopHandle {
  return doWatch(source as any, cb, options)
}
```

## watchEffect 源码

```ts
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase,
): WatchStopHandle {
  return doWatch(effect, null, options)
}
```
