---
title: Array - JavaScript
---

# Array

## Array 构造函数

语法：

```javascript
new Array(element0, element1, /* … ,*/ elementN)
new Array(arrayLength)

Array(element0, element1, /* … ,*/ elementN)
Array(arrayLength)
```

示例：

```javascript
const fruits = new Array(2)
console.log(fruits.length) // 2
console.log(fruits[0]) // undefined

const fruits2 = new Array('Apple', 'Banana')
console.log(fruits2.length) // 2
console.log(fruits2[0]) // "Apple"

const fruits3 = Array(2)
console.log(fruits3.length) // 2
console.log(fruits3[0]) // undefined

const fruits4 = Array('Apple', 'Banana')
console.log(fruits4.length) // 2
console.log(fruits4[0]) // "Apple"
```

## 静态方法

### Array.from(arrayLike[, mapFn[, thisArg]])

Array.from() 静态方法从一个可迭代的或类似数组的对象中创建一个新的、浅层拷贝的数组实例。

语法：

```javascript
// 箭头函数
Array.from(arrayLike, element => {})
Array.from(arrayLike, (element, index) => {})

// Mapping 函数
Array.from(arrayLike, mapFn)
Array.from(arrayLike, mapFn, thisArg)

// 内联 Mapping 函数
Array.from(arrayLike, function mapFn(element) {})
Array.from(arrayLike, function mapFn(element, index) {})
Array.from(arrayLike, function mapFn(element) {}, thisArg)
Array.from(arrayLike, function mapFn(element, index) {}, thisArg)
```

示例：

1. 字符串：

```javascript
// 字符串
Array.from('foo') // [ "f", "o", "o" ]
```

2. Set：

```javascript
// Set
const set = new Set(['foo', 'bar', 'baz', 'foo'])
Array.from(set) // [ "foo", "bar", "baz" ]
```

3. Map：

```javascript
const map = new Map([
  [1, 2],
  [2, 4],
  [4, 8],
])
Array.from(map) // [[1, 2], [2, 4], [4, 8]]

const mapper = new Map([
  ['1', 'a'],
  ['2', 'b'],
])
Array.from(mapper.values()) // ['a', 'b']

Array.from(mapper.keys()) // ['1', '2']
```

4. 类数组对象：

```javascript
function f() {
  return Array.from(arguments)
}

f(1, 2, 3) // [ 1, 2, 3 ]
```

5. 使用箭头函数：

```javascript
Array.from([1, 2, 3], x => x + x) // [2, 4, 6]
Array.from({ length: 5 }, (v, i) => i) // [0, 1, 2, 3, 4]
```

6. 实现序列范围生成器

```javascript
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

range(0, 4, 1) // [0, 1, 2, 3, 4]

range(1, 10, 2) // [1, 3, 5, 7, 9]

// 生成字母表
range('A'.charCodeAt(0), 'Z'.charCodeAt(0), 1).map(x => String.fromCharCode(x))
// ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
```

### Array.isArray(value)

Array.isArray() 方法确定传递的值是否是一个数组。

语法：

```javascript
Array.isArray(value)
```

示例：

```javascript
// 下面的都返回 true
Array.isArray([])
Array.isArray([1])
Array.isArray(new Array())
Array.isArray(new Array('a', 'b', 'c', 'd'))
Array.isArray(new Array(3))
// Array.prototype 也是一个数组
Array.isArray(Array.prototype)

// 下面的都返回 false
Array.isArray()
Array.isArray({})
Array.isArray(null)
Array.isArray(undefined)
Array.isArray(17)
Array.isArray('Array')
Array.isArray(true)
Array.isArray(false)
Array.isArray(new Uint8Array(32))
Array.isArray({ __proto__: Array.prototype })
```

**`instanceof` vs `isArray`**

当检查数组实例时，Array.isArray 比 instanceof 更好，因为它跨 iframe 工作。

```javascript
const iframe = document.createElement('iframe')
document.body.appendChild(iframe)
xArray = window.frames[window.frames.length - 1].Array
const arr = new xArray(1, 2, 3) // [1,2,3]

Array.isArray(arr) // true
arr instanceof Array // false，因为 xArray 和 Array 不是同一个构造函数
```

### Array.of(...items)

Array.of() 方法从一个可变数量的参数创建一个新的数组实例。

语法：

```javascript
Array.of(element0)
Array.of(element0, element1)
Array.of(element0, element1, /* … ,*/ elementN)
```

示例：

```javascript
Array.of(7) // [7]
Array(7) // 长度为 7 的空数组

Array.of(1, 2, 3) // [1, 2, 3]
Array(1, 2, 3) // [1, 2, 3]

Array.of(undefined) // [undefined]
```

## 实例属性

### Array.prototype.length

反映一个数组中元素的数量，是一个无符号的 32 位整数，小于 x^32。

示例：

```javascript
const arr = [1, 2]
console.log(arr.length) // 2

arr.length = 5
console.log(arr.length) // 5
console.log(arr) // [ 1, 2, <3 empty items> ]

arr.forEach(element => console.log(element))
// 1
// 2
```
