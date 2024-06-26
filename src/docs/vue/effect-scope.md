---
title: effectScope.ts 源码分析
---

# effectScope.ts 源码分析

## effectScope 函数

effectScope 函数创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。

effect 作用域是 EffectScope 类的实例，主要关注它的 run 方法和 stop 方法。

**EffectScope 的实例属性：**

- _active：是否被停止了
- effects：记录的 effects
- cleanups：用户注入的清除函数
- parent：父级作用域
- scopes：记录未分离的作用域
- index：跟踪子作用域在其父作用域的作用域数组中的索引，以进行优化的删除
- detached：是否是分离的作用域

**EffectScope 的实例方法：**

- run：执行传入的函数
- stop：停止收集到的 effect 监听，传入是否是父级删除标志
- on：切换当前正在使用的 effect 作用域为当前作用域
- off：切换当前正在使用的 effect 作用域为父级作用域

## effectScope.ts 源码

```ts
import type { ReactiveEffect } from './effect'
import { warn } from './warning'

let activeEffectScope: EffectScope | undefined

export class EffectScope {
  /**
   * 是否被停止了
   * @internal
   */
  private _active = true
  /**
   * 记录的 effects
   * @internal
   */
  effects: ReactiveEffect[] = []
  /**
   * 用户注入的清除函数
   * @internal
   */
  cleanups: (() => void)[] = []

  /**
   * only assigned by undetached scope
   * 仅由未分离的作用域分配
   * 父级作用域
   * @internal
   */
  parent: EffectScope | undefined
  /**
   * record undetached scopes
   * 记录未分离的作用域
   * 子级作用域
   * @internal
   */
  scopes: EffectScope[] | undefined
  /**
   * track a child scope's index in its parent's scopes array for optimized removal
   * 跟踪子作用域在其父作用域的作用域数组中的索引，以进行优化的删除
   * @internal
   */
  private index: number | undefined

  constructor(public detached = false) {
    // 当前正在使用的 effect 作用域作为父级
    this.parent = activeEffectScope
    // 如果不是分离的作用域且当前作用域存在
    // 则记住当前作用域在父级中的位置
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
        // 当前正在使用的 effect 作用域设置为当前作用域
        activeEffectScope = this
        // 执行 fn
        return fn()
      }
      finally {
        // 恢复当前正在使用的 effect 作用域
        activeEffectScope = currentEffectScope
      }
    }
    else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`)
    }
  }

  /**
   * This should only be called on non-detached scopes
   * 这只应该在未分离的作用域上调用
   * 切换当前正在使用的 effect 作用域为当前作用域
   * @internal
   */
  on() {
    activeEffectScope = this
  }

  /**
   * This should only be called on non-detached scopes
   * 这只应该在未分离的作用域上调用
   * 切换当前正在使用的 effect 作用域为父级作用域
   * @internal
   */
  off() {
    activeEffectScope = this.parent
  }

  // 统一停止收集到的 effect 监听，传入是否是父级删除标志
  stop(fromParent?: boolean) {
    if (this._active) {
      let i, l
      // 停止所有 effect
      for (i = 0, l = this.effects.length; i < l; i++)
        this.effects[i].stop()

      // 执行用户注册的所有清理函数
      for (i = 0, l = this.cleanups.length; i < l; i++)
        this.cleanups[i]()

      // 清理所有的子作用域
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++)
          this.scopes[i].stop(true)
      }
      // nested scope, dereference from parent to avoid memory leaks
      // 嵌套作用域，从父级取消引用以避免内存泄漏
      if (!this.detached && this.parent && !fromParent) {
        // optimized O(1) removal
        // 优化的 O(1) 删除
        const last = this.parent.scopes!.pop()
        // 判断是否是当前作用域，如果不是则跟当前替换位置
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

/**
 * 在 scope 中记录 effect
 */
export function recordEffectScope(
  effect: ReactiveEffect,
  scope: EffectScope | undefined = activeEffectScope,
) {
  if (scope && scope.active)
    scope.effects.push(effect)
}

/**
 * Returns the current active effect scope if there is one.
 * 返回当前活动的作用域（如果有）。
 *
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#getcurrentscope}
 */
export function getCurrentScope() {
  return activeEffectScope
}

/**
 * Registers a dispose callback on the current active effect scope.
 * The callback will be invoked when the associated effect scope is stopped.
 *
 * 在当前活动的作用域上注册一个 dispose 回调。
 * 当停止关联的作用域时，将调用回调。
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
