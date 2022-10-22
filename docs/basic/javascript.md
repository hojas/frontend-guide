---
title: JavaScript 核心知识
---

# JavaScript 核心知识

## 基础教程

https://javascript.info/

https://wangdoc.com/javascript/

https://wangdoc.com/es6/

## 箭头函数

1. 没有 this
2. 没有 arguments
3. 不能用作构造器

## Symbol 类型

`symbol` 是唯一标识符的基本类型。

`symbol` 是使用带有可选描述（name）的 `Symbol()` 调用创建的。

`symbol` 总是不同的值，即使它们有相同的名字。如果希望同名的 `symbol` 相等，那么应该使用全局注册表：`Symbol.for(key)`
返回（如果需要的话则创建）一个以 `key` 作为名字的全局 `symbol`。使用 `Symbol.for` 多次调用 `key` 相同的 `symbol`
时，返回的就是同一个 `symbol`。

对象中的 `symbol` 属性不会出现在 `for..in` 中。有一个内建方法 `Object.getOwnPropertySymbols(obj)`
允许我们获取所有的 `symbol`。还有一个名为 `Reflect.ownKeys(obj)` 的方法可以返回一个对象的所有键，包括 `symbol`
。但大多数库、内建方法和语法结构都没有使用这些方法。

## 可迭代对象

可以应用 `for..of` 的对象被称为可迭代的，可迭代对象必须实现 `Symbol.iterator` 方法。`Symbol.iterator` 方法会被 `for..of`
自动调用，也可以直接调用它。

`obj[Symbol.iterator]()` 的结果被称为迭代器（iterator），由它处理进一步的迭代过程。一个迭代器必须有 `next()`
方法，它返回一个 `{ done: Boolean, value: any }` 对象，这里 `done:true` 表明迭代结束，否则 `value` 就是下一个值。

内建的可迭代对象例如字符串和数组，都实现了 `Symbol.iterator`。

字符串迭代器能够识别代理对（surrogate pair），代理对也就是 UTF-16 扩展字符。

**类数组**

有索引属性和 `length` 属性的对象被称为类数组对象。这种对象可能还具有其他属性和方法，但是没有数组的内建方法。

如果仔细研究一下规范，会发现大多数内建方法都假设它们需要处理的是可迭代对象或者类数组对象，而不是“真正的”数组，因为这样抽象度更高。

`Array.from(obj[, mapFn, thisArg])` 将可迭代对象或类数组对象 `obj` 转化为真正的数组 `Array`。可选参数 `mapFn`
和 `thisArg` 允许将函数应用到每个元素。

## WeakMap 和 WeakSet

`WeakMap` 是类似于 `Map` 的集合，它仅允许对象作为键，并且一旦通过其他方式无法访问这些对象，垃圾回收便会将这些对象与其关联值一同删除。

`WeakSet` 是类似于 `Set` 的集合，它仅存储对象，并且一旦通过其他方式无法访问这些对象，垃圾回收便会将这些对象删除。

它们的主要优点是它们对对象是弱引用，所以被它们引用的对象很容易地被垃圾收集器移除。

## Object.defineProperty

- value - 对象属性的值
- writable：如果为 true，则值可以被修改，否则它是只可读的
- enumerable：如果为 true，则会被在循环中列出，否则不会被列出
- configurable：如果为 true，则此属性可以被删除，这些特性也可以被修改，否则不可以

### get 和 set

- get：一个没有参数的函数，在读取属性时工作
- set：带有一个参数的函数，当属性被设置时调用

## 原型继承

在 JavaScript 中，所有的对象都有一个隐藏的 `[[Prototype]]` 属性，它要么是另一个对象，要么就是 null。通过 `[[Prototype]]` 引用的对象被称为“原型”。

我们可以使用 `obj.__proto__` 访问它（历史遗留下来的 getter/setter）。

for..in 循环在其自身和继承的属性上进行迭代。所有其他的键/值获取方法仅对对象本身起作用。

`F.prototype` 属性在 `new F` 被调用时为新对象的 `[[Prototype]]` 赋值。

推荐使用 `Object.getPrototypeOf(obj)` 和 `Object.setPrototypeOf(obj, proto)` 来访问和设置对象的原型。

## ES Module

[原理](http://www.wawow.xyz/#/md-render?bid=40)

## 浏览器事件循环
