---
title: 手写 JavaScript 实现深拷贝
---

# 手写 JavaScript 实现深拷贝

## 代码

```javascript
function deepCopy(obj) {
  // 如果不是对象或者是 null，则直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let copy
  if (Array.isArray(obj)) {
    // 如果是数组，创建一个新数组
    copy = []
    for (let i = 0; i < obj.length; i++) {
      // 递归拷贝数组的每一项
      copy[i] = deepCopy(obj[i])
    }
  }
  else {
    // 如果是对象，创建一个新对象
    copy = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 递归拷贝对象的每一个属性
        copy[key] = deepCopy(obj[key])
      }
    }
  }

  return copy
}
```

## 注意

这个实现有一些限制，比如无法正确处理循环引用的对象。对于循环引用或者包含特殊类型（如函数）的对象，可能需要根据实际情况进行特殊处理。
