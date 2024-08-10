---
title: 手写 JavaScript 实现节流函数 throttle
---

# 手写 JavaScript 实现节流函数 throttle

代码：

```js
/**
 * 节流函数
 *
 * @param {Function} fn 要节流的函数
 * @param {number} timeout 间隔时间
 */
function throttle(fn, timeout) {
  let timer = null
  return function (...args) {
    if (timer)
      return

    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, timeout)
  }
}
```

使用：

```js
function fn(msg) {
  console.log(msg)
}

const throttleFn = throttle(fn, 500)

throttleFn('1')

setTimeout(() => {
  throttleFn('100')
}, 100)

setTimeout(() => {
  throttleFn('200')
}, 200)

setTimeout(() => {
  throttleFn('300')
}, 300)

setTimeout(() => {
  throttleFn('400')
}, 400)

setTimeout(() => {
  throttleFn('500')
}, 500)

setTimeout(() => {
  throttleFn('600')
}, 600)

setTimeout(() => {
  throttleFn('700')
}, 700)
```

可以看到，节流函数的执行结果如下：

```text
1
500
```

因为 500 毫秒内只有第一调用生效。
