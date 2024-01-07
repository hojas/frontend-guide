---
title: Vue3 的响应式原理
---

# Vue3 的响应式原理

Vue3 使用 Proxy 实现对数据的劫持，在读取数据时收集依赖，当数据发生变化时，通知依赖更新。只有被依赖的数据才会被收集，这样就避免了不必要的更新。

若某个函数（比如 Vue 的 render 函数）依赖了代理对象的属性，Vue 会创建一个副作用函数 `effect` ，通过 `effect` 函数来执行该函数。当读取数据时，会触发 `track` 函数收集依赖。当数据发生变化时，会触发 `trigger` 函数通知依赖更新。

收集的依赖会存放在一个全局对象中，该对象存放了所有代理对象的依赖，当数据发生变化时，会遍历依赖，执行依赖的副作用函数。同时，每个副作用函数都会有一个 `deps` 属性，用来存放该副作用函数的依赖，`deps` 是一个数组，每个元素都是一个 `Set` 即代理对象的属性的依赖集合，当副作用函数执行完毕时，会从 `Set` 中清除该函数。因为每次执行副作用函数时都会重新收集依赖，所以需要清除依赖。

下面实现一个简单的响应式系统：

```js
// 依赖收集
// 依赖收集的数据结构如下
// WeakMap<object, Map<any, Set<Function>>>
const targetMap = new WeakMap()

// 副作用函数栈，用来存放当前正在执行的副作用函数
// 数组最后一个元素即为当前正在执行的副作用函数
// 设计为数组是为了支持嵌套的副作用函数
// 例如：effect(() => {
//   effect(() => {
//     proxy.name = 'Jack'
//   })
// })
let activeEffect

/**
 * 收集依赖
 * @params {target} 收集依赖的目标对象
 * @params {key} 对象的属性名称
 */
function track(target, key) {
  if (activeEffect) {
    // 获取当前对象的依赖
    let depsMap = targetMap.get(target)
    // 如果没有依赖，则初始化依赖
    if (!depsMap)
      targetMap.set(target, (depsMap = new Map()))

    // 获取当前属性的依赖
    let dep = depsMap.get(key)
    // 如果没有依赖，则初始化依赖
    if (!dep)
      depsMap.set(key, (dep = new Set()))

    // 如果当前 effect 不在依赖中，则添加依赖
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect)
      // 添加清除依赖的方法
      activeEffect.deps.push(dep)
    }
  }
}

/**
 * 触发副作用函数
 * @params {fn} 副作用函数
 * @params {options} 副作用函数的配置
 */
function trigger(target, key) {
  // 获取当前对象的依赖
  const depsMap = targetMap.get(target)
  // 如果没有依赖，则直接返回
  if (!depsMap)
    return

  // 获取当前属性的依赖
  const effects = new Set()

  // 获取当前属性的依赖
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        // 添加依赖时，需要判断当前 effect 是否是正在执行的副作用函数，防止递归执行
        // 例如：effect(() => {
        //   proxy.name = 'Jack'
        // })
        // 当设置 proxy.name 时，会触发 proxy.name 的 setter 函数
        // setter 函数会触发 trigger 函数，trigger 函数会执行 proxy.name 的依赖
        // 由于此时 proxy.name 的依赖是当前正在执行的副作用函数，所以会导致副作用函数递归执行
        // 所以需要使用 activeEffect 来避免副作用函数递归执行
        if (effect !== activeEffect)
          effects.add(effect)
      })
    }
  }

  // key 存在，则获取当前属性的依赖
  if (key !== void 0)
    add(depsMap.get(key))

  const run = (effect) => {
    if (effect.options.scheduler)
      effect.options.scheduler(effect)
    else
      effect()
  }

  // 执行依赖
  effects.forEach(run)
}

/**
 * 创建副作用函数
 * @params {fn} 副作用函数
 * @params {options} 副作用函数的配置
 */
function effect(fn, options = {}) {
  function effectFn() {
    cleanup(effectFn)
    // 当调用副作用函数时，将当前副作用函数存储到全局变量中
    activeEffect = effectFn
    const result = fn()
    return result
  }

  // 将 options 挂载到副作用函数上
  effectFn.options = options

  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []

  if (!options.lazy) {
    // 如果配置项中没有 lazy 属性，则立即执行副作用函数
    effectFn()
  }
  else {
    // 否则返回副作用函数
    return effectFn
  }
}

/**
 * 清除依赖
 * @params {effect} 副作用函数
 */
function cleanup(effect) {
  const { deps } = effect
  if (deps && deps.length) {
    // 从依赖中删除副作用函数
    deps.forEach(dep => dep.delete(effect))
    // 重置数组
    deps.length = 0
  }
}

/**
 * 创建响应式对象
 * @params {target} 响应式对象
 */
function createReactiveObject(target) {
  return new Proxy(target, {
    // 读取属性时，收集依赖
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      // 收集依赖
      track(target, key)
      return res
    },
    // 设置属性时，触发依赖更新
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      // 触发依赖更新
      trigger(target, key)
      return res
    }
  })
}

/**
 * 创建响应式对象
 * @params {target} 响应式对象
 */
function reactive(target) {
  return createReactiveObject(target)
}
```

然后使用如下：

```js
const obj = reactive({ name: 'Tom' })

effect(() => {
  // 读取属性时，收集依赖
  console.log(obj.name)
})

// 设置属性时，触发依赖更新
proxy.name = 'Jack'
// 此时控制台会打印出 Jack
```
