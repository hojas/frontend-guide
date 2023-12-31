---
title: async/await 的原理
---

# async/await 的原理

## async/await 是什么

async/await 是 ES2016（ES7） 中的新特性，它是 Generator 的语法糖，它的目的是为了简化 Promise 的使用，让异步代码看起来像同步代码。

## async/await 的使用

async/await 的使用非常简单，只需要在函数前面加上 async 关键字，然后在需要等待的表达式前面加上 await 关键字即可。

```js
async function fn() {
  await 1
}
```

## async/await 的原理

async/await 的原理就是将 Generator 函数和自动执行器包装在一个函数里面。

```js
/**
 * await 函数的实现
 *
 * @param {*} thisArg
 * @param {*} _arguments
 * @param {*} P
 * @param {*} generator
 */
const __awaiter = function (thisArg, _arguments, P, generator) {
  P = P || Promise

  /**
   * 来判断 value 是否是一个 promise
   * 如果是的话就返回这个 promise，如果不是的话就包裹成一个 resolved 的 promise
   *
   * @param {*} value
   */
  function adopt(value) {
    return value instanceof P
      ? value
      : new P((resolve) => {
        resolve(value)
      })
  }

  return new P((resolve, reject) => {
    function fulfilled(value) {
      try {
        step(generator.next(value))
      }
      catch (e) { reject(e) }
    }

    function rejected(value) {
      try {
        step(generator.throw(value))
      }
      catch (e) { reject(e) }
    }

    /**
     * 1. generator.next() 会返回一个对象，这个对象有两个属性 value 和 done
     * 2. value 是 yield 后面表达式的值，done 是一个布尔值，表示是否执行完毕
     * 3. step 函数会判断 done 的值，如果为 true 就表示执行完毕了，就会调用 resolve 方法，将 value 传递出去
     * 4. 如果 done 为 false 就表示还没执行完，就会调用 adopt 方法，将 value 包裹成一个 promise 对象，然后调用 then 方法，将 step 函数作为参数传递进去
     * 5. 这样就会递归的执行 generator 函数，直到 done 为 true，最后将最后一个 yield 后面表达式的值传递出去
     *
     * @param {*} result
     * result = { value: 1, done: false }
     */
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }

    generator = generator.apply(thisArg, _arguments || [])
    step(generator).next()
  })
}

function fn() {
  return __awaiter(this, void 0, void 0, function* () {
    yield 1
  })
}
```
