---
title: HTML
---

## 基础教程

https://www.w3school.com.cn/html/index.asp

## base 标签

`<base>` HTML 元素指定用于文档中所有相对 URL 的基 URL。一个文档中只能有一个 `<base>` 元素，`<base>` 元素有两个属性：

1. `href` 表示整个文档中用于相对 URL 的基 URL，允许使用绝对 URL 和相对 URL
2. `target` 设置 `<a>`、`<form>`、`<area>` 元素的行为，常用的值有：`_self`、`_blank`、`_parent`、`_top`

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="https://www.example.com/" target="_blank">
    <title>demo</title>
</head>
<body>
<!-- 点击 a 将在新标签页打开链接 https://www.example.com/a.html -->
<a href="a.html">a</a>
</body>
</html>
```

## HTML 文档 nodeType

用于表示 HTML 文档节点的类型。

```javascript
const t = document.querySelector('div').nodeType
console.log(t) // 1
```

常用值：

- `1`：表示节点是 HTML 元素
- `2`：表示节点是属性
- `3`：表示节点是文本节点
- `8`：表示节点是注释节点
