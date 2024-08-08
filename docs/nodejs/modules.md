---
title: 模块化
---

# JavaScript 模块化

Node.js 有两个模块系统，CommonJS 模块和 ECMAScript 模块。

默认情况下，Node.js 将把以下内容视为 CommonJS 模块：

1. 扩展名为 `.cjs` 的文件
2. 扩展名为 `.js` 的文件，且最近的父级 package.json 未设置顶层 `type` 字段
3. 扩展名为 `.js` 的文件，且最近的父级 package.json 包含顶层 `"type": "commonjs"` 字段
4. 扩展名不是 `.mjs`、`.cjs`、`.json`、`.node` 或 `.js` 的文件

## 缓存

模块在第一次被加载后会被缓存，多次调用 `require('foo')` 都会得到完全相同的对象。

只要 `require.cache` 没有被修改，多次调用 `require('foo')` 就不会导致模块代码被多次执行。这是一个重要的特性。有了它，“部分完成” 的对象可以被返回，从而允许横向依赖被加载，即使它们会导致循环。

## 循环依赖

```js
// a.js
console.log('a starting')
exports.done = false

const b = require('./b.js')
console.log('in a, b.done = %j', b.done)

exports.done = true
console.log('a done')
```

```js
// b.js
console.log('b starting')
exports.done = false

const a = require('./a.js')
console.log('in b, a.done = %j', a.done)

exports.done = true
console.log('b done')
```

```js
console.log('main starting')
const a = require('./a.js')
const b = require('./b.js')
console.log('in main, a.done = %j, b.done = %j', a.done, b.done)
```

当 main.js 加载 a.js 时，然后 a.js 反过来加载 b.js。在这一点上，b.js 试图加载 a.js。为了防止无限循环，a.js 出口对象的一个未完成的副本被返回给 b.js 模块。b.js 随后完成加载，其出口对象被提供给 a.js 模块。

当 main.js 加载完两个模块时，它们都已经完成了。因此，这个程序的输出将是：

```shell
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

## 参考

1. https://nodejs.org/dist/latest-v18.x/docs/api/modules.html
