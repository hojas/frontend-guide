---
title: JavaScript 核心知识
---

# JavaScript 核心知识

## 基础教程

https://javascript.info/

https://wangdoc.com/javascript/

https://wangdoc.com/es6/

## 原理

[JavaScript 原理](how-javascript-works.md)

## 元编程

### 对象的可扩展能力

对象数据属性的特性：`value`、`writable`、`enumerable` 和 `configurable`。

对象访问器属性的特性：`get`、`set`、`enumerable` 和 `configurable`。

`Object.defineProperty()` 和 `Object.defineProperties()` 可以修改属性特性，`Object.create()` 也可以在创建对象时设置属性特性。

`Object.preventExtensions(obj)` 使对象不可扩展，即无法给对象添加新属性。

`Object.isExtensible(obj)` 判断对象是否可扩展。

`Object.seal(obj)` 使对象不可扩展，并且不能删除或配置已有属性，可写的已有属性依然可写。

`Object.isSealed(obj)` 判断对象是否被封存。

`Object.freeze()` 在封存对象的基础上，会把其全部自有属性设置为只读的，访问器属性的 set 不受影响。

`Object.isFrozen(obj)` 判断对象是否被锁定。

### 原型

`Object.getPrototypeOf(obj)` 获取对象的原型。

`o.isPrototypeOf(obj)` 判断对象 o 是否为 obj 的原型。

`Object.setPrototypeOf(obj, o)` 设置 obj 的原型为 o。

### 公认符号

`Symbol.iterator` 和 `Symbol.asyncIterator` 使对象或类把自己变成可迭代对象和异步可迭代对象。

`Symbol.hasInstance`：实现了 `[Symbol.hasInstance](x) {}` 方法的对象可以用于 `instanceof` 右侧参数。

`Symbol.toStringTag`：实现了该属性的 class，`Object.prototype.toString.call(obj)` 会返回该属性的值。

`Symbol.species`：是一个访问器属性，允许子类覆盖对象的默认构造函数。

## 箭头函数

1. 没有 this
2. 没有 arguments
3. 不能用作构造器

## Symbol 类型

`symbol` 是唯一标识符的基本类型，使用带有可选描述（name）的 `Symbol()` 调用创建。

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

常见的 macro-task：script（整体代码）、setTimeout、setInterval、 setImmediate、 I/O 操作、UI 交互等。

常见的 micro-task：Promise、MutationObserver 等。
