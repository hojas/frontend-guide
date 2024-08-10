---
title: 手写 JavaScript 实现防抖函数 debounce
---

# 手写 JavaScript 实现防抖函数 debounce

代码：

```js
/**
 * 防抖函数
 *
 * @param {Function} fn 要防抖的函数
 * @param {number} timeout 间隔时间
 */
function debounce(fn, timeout = 200) {
  let timer = null
  return function (...args) {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
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

const debounceFn = debounce(fn, 500)

debounceFn('1')

setTimeout(() => {
  debounceFn('100')
}, 100)

setTimeout(() => {
  debounceFn('200')
}, 200)

setTimeout(() => {
  debounceFn('300')
}, 300)

setTimeout(() => {
  debounceFn('400')
}, 400)

setTimeout(() => {
  debounceFn('500')
}, 500)

setTimeout(() => {
  debounceFn('600')
}, 600)
```

可以看到输出的是 `600`，因为在 `500ms` 内，`debounceFn` 被调用了多次，但是只有最后一次生效了。
