---
title: JavaScript 的数据类型
---

# JavaScript 的数据类型

## 包装对象

数值、字符串、布尔值这三种原始类型在一定条件下，会自动转为对象，也就是原始类型的“包装对象”（wrapper）。

所谓“包装对象”，指的是与数值、字符串、布尔值分别相对应的 Number、String、Boolean 三个原生对象。这三个原生对象可以把原始类型的值变成（包装成）对象。

包装对象的设计目的，首先是使得“对象”这种类型可以覆盖 JavaScript 所有的值，整门语言有一个通用的数据模型，其次是使得原始类型的值也有办法调用自己的方法。

某些场合，原始类型的值会自动当作包装对象调用，即调用包装对象的属性和方法。这时，JavaScript 引擎会自动将原始类型的值转为包装对象实例，并在使用后立刻销毁实例。

比如：

```javascript
(1).toString() // '1'
'abc'.length // 3
(true).toString() // 'true'
```

## 参考

https://wangdoc.com/javascript/stdlib/wrapper
