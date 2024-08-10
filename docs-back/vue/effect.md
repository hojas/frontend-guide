---
title: effect.ts 源码分析
---

# effect.ts 源码分析

## effect.ts 源码分析

ReactEffect 是一个类，用于收集依赖和触发依赖。

```ts
import { NOOP, extend } from '@vue/shared'
import type { ComputedRefImpl } from './computed'
import {
  DirtyLevels,
  type TrackOpTypes,
  type TriggerOpTypes,
} from './constants'
import type { Dep } from './dep'
import { type EffectScope, recordEffectScope } from './effectScope'

export type EffectScheduler = (...args: any[]) => any

export type DebuggerEvent = {
  effect: ReactiveEffect
} & DebuggerEventExtraInfo

export interface DebuggerEventExtraInfo {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

// 当前活动的 ReactiveEffect 对象
export let activeEffect: ReactiveEffect | undefined

/**
 * 创建一个 ReactiveEffect
 * 用于收集依赖和触发依赖
 */
export class ReactiveEffect<T = any> {
  // 当前 effect 是否为激活状态
  active = true
  // 存储与 effect 相关的依赖项数组
  deps: Dep[] = []

  /**
   * Can be attached after creation
   * 表示该 effect 是由某个计算属性触发的
   * @internal
   */
  computed?: ComputedRefImpl<T>
  /**
   * 表示该 effect 是否允许递归运行
   * @internal
   */
  allowRecurse?: boolean

  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  /**
   * 内部属性，表示当前 effect 的脏状态级别，默认为 Dirty
   * @internal
   */
  _dirtyLevel = DirtyLevels.Dirty
  /**
   * 内部属性，用于标识追踪的 ID
   * @internal
   */
  _trackId = 0
  /**
   * 内部属性，表示当前正在运行中的 effect 的数量
   * @internal
   */
  _runnings = 0
  /**
   * @internal
   */
  _shouldSchedule = false
  /**
   * 内部属性，表示当前 effect 的依赖项数组的长度
   * @internal
   */
  _depsLength = 0

  constructor(
    public fn: () => T,
    public trigger: () => void,
    public scheduler?: EffectScheduler,
    scope?: EffectScope,
  ) {
    // 初始化
    // this.fn = fn
    // this.trigger = trigger
    // this.scheduler = scheduler
    // 记录当前 effect 到 scope.effects 中
    recordEffectScope(this, scope)
  }

  // 获取当前 effect 的脏状态
  public get dirty() {
    if (
      this._dirtyLevel === DirtyLevels.MaybeDirty_ComputedSideEffect
      || this._dirtyLevel === DirtyLevels.MaybeDirty
    ) {
      this._dirtyLevel = DirtyLevels.QueryingDirty
      pauseTracking()
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i]
        if (dep.computed) {
          triggerComputed(dep.computed)
          if (this._dirtyLevel >= DirtyLevels.Dirty) {
            break
          }
        }
      }
      if (this._dirtyLevel === DirtyLevels.QueryingDirty) {
        this._dirtyLevel = DirtyLevels.NotDirty
      }
      resetTracking()
    }
    return this._dirtyLevel >= DirtyLevels.Dirty
  }

  // 设置当前 effect 的脏状态
  public set dirty(v) {
    this._dirtyLevel = v ? DirtyLevels.Dirty : DirtyLevels.NotDirty
  }

  // 运行当前 effect
  run() {
    // 将当前 effect 的脏状态设置为 NotDirty
    this._dirtyLevel = DirtyLevels.NotDirty
    // 如果当前 effect 不是激活状态则直接返回 fn 执行结果
    if (!this.active)
      return this.fn()
    // 缓存当前的 shouldTrack 和 activeEffect
    const lastShouldTrack = shouldTrack
    const lastEffect = activeEffect
    try {
      // 将 shouldTrack 设置为 true （表示是否需要收集依赖）
      shouldTrack = true
      // 将当前活动的 effect 对象设置为 “自己”
      activeEffect = this
      // 将当前 effect 的运行中的数量加 1
      this._runnings++
      // 执行副作用函数之前，执行 preCleanupEffect 函数
      preCleanupEffect(this)
      // 执行副作用函数，并返回执行结果
      return this.fn()
    }
    finally {
      // 执行副作用函数之后，执行 postCleanupEffect 函数
      postCleanupEffect(this)
      // 将当前 effect 的运行中的数量减 1
      this._runnings--
      // 将 shouldTrack 和 activeEffect 恢复到之前的状态
      activeEffect = lastEffect
      shouldTrack = lastShouldTrack
    }
  }

  // 停止当前 effect
  stop() {
    if (this.active) {
      preCleanupEffect(this)
      postCleanupEffect(this)
      this.onStop && this.onStop()
      this.active = false
    }
  }
}

function triggerComputed(computed: ComputedRefImpl<any>) {
  return computed.value
}

/**
 * 在执行 fn 之前，preCleanupEffect 会永久自增 _trackId，确保了每次 effect 的 fn 运行时，
 * 其 _trackId 都是唯一的，避免了在不同追踪周期间引入混淆。
 * 同时，重置依赖项数组长度确保了只追踪在本次运行期间访问的新依赖项，避免了旧依赖项的影响。
 */
function preCleanupEffect(effect: ReactiveEffect) {
  // 增加 effect 的追踪 ID
  effect._trackId++
  // 重置依赖项数组长度为 0
  effect._depsLength = 0
}

/**
 * 由于依赖项数组可能在 fn 运行时被动态添加新的依赖，执行后需要清理多余的依赖项，
 * 确保依赖项的数量与实际被追踪的依赖一致。
 * 这样，便于在下次effect触发，只追踪新的依赖项，提高了响应式系统的性能。
 */
function postCleanupEffect(effect: ReactiveEffect) {
  if (effect.deps.length > effect._depsLength) {
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      // 清理多余的依赖项
      cleanupDepEffect(effect.deps[i], effect)
    }
    // 调整依赖项数组的长度
    effect.deps.length = effect._depsLength
  }
}

// 清除依赖项
function cleanupDepEffect(dep: Dep, effect: ReactiveEffect) {
  // 获取依赖项中的追踪 ID
  const trackId = dep.get(effect)
  if (trackId !== undefined && effect._trackId !== trackId) {
    // 删除无关的依赖项
    dep.delete(effect)
    // 如果依赖项为空，执行清理操作
    if (dep.size === 0) {
      dep.cleanup()
    }
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
 * Every time any reactive property that's accessed within it gets updated,
 * the function will run again.
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
  if ((fn as ReactiveEffectRunner).effect instanceof ReactiveEffect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  // 创建一个 ReactiveEffect
  const _effect = new ReactiveEffect(fn, NOOP, () => {
    if (_effect.dirty) {
      _effect.run()
    }
  })
  if (options) {
    // 如果有 options 则将 options 中合并到 _effect 中
    extend(_effect, options)
    // 如果有 options.scope 则将 _effect 添加到 options.scope.effects 中
    if (options.scope)
      recordEffectScope(_effect, options.scope)
  }
  // 如果没有 options.lazy 则立即执行 _effect.run()
  if (!options || !options.lazy)
    _effect.run()
  // 将 _effect.run 的 this 绑定到 _effect 上
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  // 将 _effect 添加到 runner 上
  runner.effect = _effect
  return runner
}

/**
 * Stops the effect associated with the given runner.
 * 停止与给定 runner 关联的 effect。
 *
 * @param runner - Association with the effect to stop tracking.
 */
export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

export let shouldTrack = true
// 用于存储暂停调度的计数
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

// 用于增加暂停调度的计数
export function pauseScheduling() {
  pauseScheduleStack++
}

// 减少暂停调度的计数，并在计数为零时执行队列中的 effect 调度器函数
export function resetScheduling() {
  pauseScheduleStack--
  while (!pauseScheduleStack && queueEffectSchedulers.length)
    queueEffectSchedulers.shift()!()
}

/**
 * 依赖收集
 * @param effect
 * @param dep
 * @param debuggerEventExtraInfo
 */
export function trackEffect(
  effect: ReactiveEffect,
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo,
) {
  // 如果当前依赖项中没有记录该 effect 的追踪 ID，则建立关联
  if (dep.get(effect) !== effect._trackId) {
    // 添加依赖
    dep.set(effect, effect._trackId)
    // 获取当前 effect 依赖项数组中的最后一个依赖项
    const oldDep = effect.deps[effect._depsLength]
    // 如果最后一个依赖项不是当前依赖项，进行处理
    if (oldDep !== dep) {
      // 如果最后一个依赖项存在，则清理 effect 与最后一个依赖项的关联
      if (oldDep) {
        cleanupDepEffect(oldDep, effect)
      }
      // 将当前依赖项添加到 effect 的依赖项数组中
      effect.deps[effect._depsLength++] = dep
    }
    else {
      // 如果最后一个依赖项就是当前依赖项，增加依赖项数组长度
      effect._depsLength++
    }
    if (__DEV__)
      effect.onTrack?.(extend({ effect }, debuggerEventExtraInfo!))
  }
}

// 用于存储 effect 调度器函数
const queueEffectSchedulers: EffectScheduler[] = []

/**
 * 触发依赖
 */
export function triggerEffects(
  dep: Dep,
  dirtyLevel: DirtyLevels,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo,
) {
  // 暂停调度
  pauseScheduling()
  // 遍历依赖项中的 effect
  for (const effect of dep.keys()) {
    // dep.get(effect) is very expensive, we need to calculate it lazily and reuse the result
    let tracking: boolean | undefined
    // 如果 effect 的脏状态小于指定的脏状态级别，执行下面的逻辑
    if (
      effect._dirtyLevel < dirtyLevel
      && (tracking ??= dep.get(effect) === effect._trackId)
    ) {
      effect._shouldSchedule ||= effect._dirtyLevel === DirtyLevels.NotDirty
      // 将 effect 的脏状态设置为指定的脏状态级别
      effect._dirtyLevel = dirtyLevel
    }
    if (
      effect._shouldSchedule
      && (tracking ??= dep.get(effect) === effect._trackId)
    ) {
      if (__DEV__) {
        effect.onTrigger?.(extend({ effect }, debuggerEventExtraInfo))
      }
      // 触发 effect 的 trigger 函数
      effect.trigger()
      if (
        (!effect._runnings || effect.allowRecurse)
        && effect._dirtyLevel !== DirtyLevels.MaybeDirty_ComputedSideEffect
      ) {
        effect._shouldSchedule = false
        if (effect.scheduler) {
          // 将 effect 的调度器函数添加到队列中
          queueEffectSchedulers.push(effect.scheduler)
        }
      }
    }
  }
  // 重置调度
  resetScheduling()
}
```
