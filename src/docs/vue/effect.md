---
title: effect 源码分析
---

# effect 源码分析

## effectScope.ts 源码分析

```ts
let activeEffectScope: EffectScope | undefined

export class EffectScope {
  /**
   * @internal
   */
  private _active = true
  /**
   * @internal
   */
  effects: ReactiveEffect[] = []
  /**
   * @internal
   */
  cleanups: (() => void)[] = []

  /**
   * only assigned by undetached scope
   * @internal
   */
  parent: EffectScope | undefined
  /**
   * record undetached scopes
   * @internal
   */
  scopes: EffectScope[] | undefined
  /**
   * track a child scope's index in its parent's scopes array for optimized
   * removal
   * @internal
   */
  private index: number | undefined

  constructor(public detached = false) {
    this.parent = activeEffectScope
    if (!detached && activeEffectScope) {
      this.index
        = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this,
        ) - 1
    }
  }

  get active() {
    return this._active
  }

  run<T>(fn: () => T): T | undefined {
    if (this._active) {
      const currentEffectScope = activeEffectScope
      try {
        activeEffectScope = this
        return fn()
      }
      finally {
        activeEffectScope = currentEffectScope
      }
    }
    else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`)
    }
  }

  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this
  }

  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent
  }

  stop(fromParent?: boolean) {
    if (this._active) {
      let i, l
      for (i = 0, l = this.effects.length; i < l; i++)
        this.effects[i].stop()

      for (i = 0, l = this.cleanups.length; i < l; i++)
        this.cleanups[i]()

      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++)
          this.scopes[i].stop(true)
      }
      // nested scope, dereference from parent to avoid memory leaks
      if (!this.detached && this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
          this.parent.scopes![this.index!] = last
          last.index = this.index!
        }
      }
      this.parent = undefined
      this._active = false
    }
  }
}

/**
 * Creates an effect scope object which can capture the reactive effects (i.e.
 * computed and watchers) created within it so that these effects can be
 * disposed together. For detailed use cases of this API, please consult its
 * corresponding {@link https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md | RFC}.
 *
 * @param detached - Can be used to create a "detached" effect scope.
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#effectscope}
 */
export function effectScope(detached?: boolean) {
  return new EffectScope(detached)
}

export function recordEffectScope(
  effect: ReactiveEffect,
  scope: EffectScope | undefined = activeEffectScope,
) {
  if (scope && scope.active)
    scope.effects.push(effect)
}

/**
 * Returns the current active effect scope if there is one.
 *
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#getcurrentscope}
 */
export function getCurrentScope() {
  return activeEffectScope
}

/**
 * Registers a dispose callback on the current active effect scope. The
 * callback will be invoked when the associated effect scope is stopped.
 *
 * @param fn - The callback function to attach to the scope's cleanup.
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#onscopedispose}
 */
export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn)
  }
  else if (__DEV__) {
    warn(
      `onScopeDispose() is called when there is no active effect scope`
      + ` to be associated with.`,
    )
  }
}
```

## effect.ts 源码分析

```ts
// 记录当前活跃的对象
export let activeEffect: ReactiveEffect | undefined

/**
 * 创建一个 ReactiveEffect
 * 用于收集依赖和触发依赖
 */
export class ReactiveEffect<T = any> {
  // 是否为激活状态
  active = true
  // 在响应式对象收集依赖时也会将对应的依赖项添加到这个数组中
  deps: Dep[] = []

  /**
   * Can be attached after creation
   * 创建后可能会附加的属性，如果是 computed 则指向 ComputedRefImpl
   * @internal
   */
  computed?: ComputedRefImpl<T>
  /**
   * 是否允许递归，会被外部更改
   * @internal
   */
  allowRecurse?: boolean

  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  /**
   * @internal
   */
  _dirtyLevel = DirtyLevels.Dirty
  /**
   * @internal
   */
  _trackId = 0
  /**
   * @internal
   */
  _runnings = 0
  /**
   * @internal
   */
  _queryings = 0
  /**
   * @internal
   */
  _depsLength = 0

  constructor(
    public fn: () => T,
    public trigger: () => void,
    public scheduler?: EffectScheduler,
    scope?: EffectScope,
  ) {
    recordEffectScope(this, scope)
  }

  public get dirty() {
    if (this._dirtyLevel === DirtyLevels.ComputedValueMaybeDirty) {
      this._dirtyLevel = DirtyLevels.NotDirty
      this._queryings++
      pauseTracking()
      for (const dep of this.deps) {
        if (dep.computed) {
          triggerComputed(dep.computed)
          if (this._dirtyLevel >= DirtyLevels.ComputedValueDirty)
            break
        }
      }
      resetTracking()
      this._queryings--
    }
    return this._dirtyLevel >= DirtyLevels.ComputedValueDirty
  }

  public set dirty(v) {
    this._dirtyLevel = v ? DirtyLevels.Dirty : DirtyLevels.NotDirty
  }

  run() {
    this._dirtyLevel = DirtyLevels.NotDirty
    if (!this.active)
      return this.fn()

    const lastShouldTrack = shouldTrack
    const lastEffect = activeEffect
    try {
      shouldTrack = true
      activeEffect = this
      this._runnings++
      preCleanupEffect(this)
      return this.fn()
    }
    finally {
      postCleanupEffect(this)
      this._runnings--
      activeEffect = lastEffect
      shouldTrack = lastShouldTrack
    }
  }

  stop() {
    if (this.active) {
      preCleanupEffect(this)
      postCleanupEffect(this)
      this.onStop?.()
      this.active = false
    }
  }
}

function triggerComputed(computed: ComputedRefImpl<any>) {
  return computed.value
}

function preCleanupEffect(effect: ReactiveEffect) {
  effect._trackId++
  effect._depsLength = 0
}

function postCleanupEffect(effect: ReactiveEffect) {
  if (effect.deps && effect.deps.length > effect._depsLength) {
    for (let i = effect._depsLength; i < effect.deps.length; i++)
      cleanupDepEffect(effect.deps[i], effect)

    effect.deps.length = effect._depsLength
  }
}

function cleanupDepEffect(dep: Dep, effect: ReactiveEffect) {
  const trackId = dep.get(effect)
  if (trackId !== undefined && effect._trackId !== trackId) {
    dep.delete(effect)
    if (dep.size === 0)
      dep.cleanup()
  }
}

export interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

export interface ReactiveEffectOptions extends DebuggerOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
  scope?: EffectScope
  allowRecurse?: boolean
  onStop?: () => void
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

/**
 * Registers the given function to track reactive updates.
 * 注册给定的函数以跟踪响应式更新。
 *
 * The given function will be run once immediately.
 * 给定的函数将立即运行一次。每次任何响应式
 * Every time any reactive property that's accessed within it gets updated, the function will run again.
 * 在它内部访问的任何响应式属性被更新时，该函数将再次运行。
 *
 * @param fn - The function that will track reactive updates.
 * @param options - Allows to control the effect's behaviour.
 * @returns A runner that can be used to control the effect after creation.
 */
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
): ReactiveEffectRunner {
  // 如果 fn 是一个 ReactiveEffectRunner 则取出 effect 中的 fn
  if ((fn as ReactiveEffectRunner).effect instanceof ReactiveEffect)
    fn = (fn as ReactiveEffectRunner).effect.fn

  // 创建一个 ReactiveEffect
  const _effect = new ReactiveEffect(fn, NOOP, () => {
    if (_effect.dirty)
      _effect.run()
  })
  // 如果 options 存在则将 options 中的属性赋值给 _effect
  if (options) {
    extend(_effect, options)
    if (options.scope)
      recordEffectScope(_effect, options.scope)
  }
  if (!options || !options.lazy)
    _effect.run()

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

/**
 * Stops the effect associated with the given runner.
 *
 * @param runner - Association with the effect to stop tracking.
 */
export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

export let shouldTrack = true
export let pauseScheduleStack = 0

const trackStack: boolean[] = []

/**
 * Temporarily pauses tracking.
 */
export function pauseTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = false
}

/**
 * Re-enables effect tracking (if it was paused).
 */
export function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

/**
 * Resets the previous global effect tracking state.
 */
export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}

export function pauseScheduling() {
  pauseScheduleStack++
}

export function resetScheduling() {
  pauseScheduleStack--
  while (!pauseScheduleStack && queueEffectSchedulers.length)
    queueEffectSchedulers.shift()!()
}

export function trackEffect(
  effect: ReactiveEffect,
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo,
) {
  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId)
    const oldDep = effect.deps[effect._depsLength]
    if (oldDep !== dep) {
      if (oldDep)
        cleanupDepEffect(oldDep, effect)

      effect.deps[effect._depsLength++] = dep
    }
    else {
      effect._depsLength++
    }
    if (__DEV__)
      effect.onTrack?.(extend({ effect }, debuggerEventExtraInfo!))
  }
}

const queueEffectSchedulers: (() => void)[] = []

export function triggerEffects(
  dep: Dep,
  dirtyLevel: DirtyLevels,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo,
) {
  pauseScheduling()
  for (const effect of dep.keys()) {
    if (!effect.allowRecurse && effect._runnings)
      continue

    if (
      effect._dirtyLevel < dirtyLevel
      && (!effect._runnings || dirtyLevel !== DirtyLevels.ComputedValueDirty)
    ) {
      const lastDirtyLevel = effect._dirtyLevel
      effect._dirtyLevel = dirtyLevel
      if (
        lastDirtyLevel === DirtyLevels.NotDirty
        && (!effect._queryings || dirtyLevel !== DirtyLevels.ComputedValueDirty)
      ) {
        if (__DEV__)
          effect.onTrigger?.(extend({ effect }, debuggerEventExtraInfo))

        effect.trigger()
        if (effect.scheduler)
          queueEffectSchedulers.push(effect.scheduler)
      }
    }
  }
  resetScheduling()
}
```

## reactiveEffect.ts 源码分析

```ts
import { isArray, isIntegerKey, isMap, isSymbol } from '@vue/shared'
import { DirtyLevels, type TrackOpTypes, TriggerOpTypes } from './constants'
import { type Dep, createDep } from './dep'
import {
  activeEffect,
  pauseScheduling,
  resetScheduling,
  shouldTrack,
  trackEffect,
  triggerEffects,
} from './effect'

// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<object, KeyToDepMap>()

export const ITERATE_KEY = Symbol(__DEV__ ? 'iterate' : '')
export const MAP_KEY_ITERATE_KEY = Symbol(__DEV__ ? 'Map key iterate' : '')

/**
 * Tracks access to a reactive property.
 *
 * This will check which effect is running at the moment and record it as dep
 * which records all effects that depend on the reactive property.
 *
 * @param target - Object holding the reactive property.
 * @param type - Defines the type of access to the reactive property.
 * @param key - Identifier of the reactive property to track.
 */
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap)
      targetMap.set(target, (depsMap = new Map()))

    let dep = depsMap.get(key)
    if (!dep)
      depsMap.set(key, (dep = createDep(() => depsMap!.delete(key))))

    trackEffect(
      activeEffect,
      dep,
      __DEV__
        ? {
            target,
            type,
            key,
          }
        : void 0,
    )
  }
}

/**
 * Finds all deps associated with the target (or a specific property) and
 * triggers the effects stored within.
 *
 * @param target - The reactive object.
 * @param type - Defines the type of the operation that needs to trigger effects.
 * @param key - Can be used to target a specific reactive property in the target object.
 */
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>,
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  let deps: (Dep | undefined)[] = []
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    deps = [...depsMap.values()]
  }
  else if (key === 'length' && isArray(target)) {
    const newLength = Number(newValue)
    depsMap.forEach((dep, key) => {
      if (key === 'length' || (!isSymbol(key) && key >= newLength))
        deps.push(dep)
    })
  }
  else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0)
      deps.push(depsMap.get(key))

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target))
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
        }
        else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          deps.push(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target))
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target))
          deps.push(depsMap.get(ITERATE_KEY))

        break
    }
  }

  pauseScheduling()
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        DirtyLevels.Dirty,
        __DEV__
          ? {
              target,
              type,
              key,
              newValue,
              oldValue,
              oldTarget,
            }
          : void 0,
      )
    }
  }
  resetScheduling()
}

export function getDepFromReactive(object: any, key: string | number | symbol) {
  return targetMap.get(object)?.get(key)
}
```
