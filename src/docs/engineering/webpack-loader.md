---
title: webpack loader 详解
---

# webpack loader 详解

## 什么是 loader

loader 用于对模块的源代码进行转换。loader 可以使你在 import 或 "load(加载)" 模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的得力方式。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件！

loader 本质上是导出为函数的 JavaScript 模块。loader runner 会调用此函数，然后将上一个 loader 产生的结果或者资源文件传入进去。函数中的 this 作为上下文会被 webpack 填充，并且 loader runner 中包含一些实用的方法，比如可以使 loader 调用方式变为异步，或者获取 query 参数。

## loader 的执行顺序

1. 前置 Loader（pre loader）
2. 普通 Loader（loader）
3. 内联 Loader（inline loader）
4. 后置 Loader（post loader）

相同类型的 Loader，执行顺序是从右到左，从下到上。

**使用方式：**

1. 配置文件中配置：pre、normal、post
2. 内联方式：在 import 语句中显示指定使用

## loader 的类型

1. 同步 Loader
2. 异步 Loader
3. Raw Loader
4. Pitching Loader

**同步 Loader**

同步 loader 会在 webpack 构建时立即执行，并将处理后的结果返回给 webpack。同步 loader 的执行速度快，但可能会阻塞 webpack 构建进程。

**异步 Loader**

异步 loader 会在 webpack 构建时异步执行，并将处理后的结果通过 promise 返回给 webpack。异步 loader 的执行速度慢，但不会阻塞 webpack 构建进程。

**Raw Loader**

raw loader 不会对资源文件进行任何处理，而是将资源文件的内容原样返回给 webpack。raw loader 通常用于将资源文件作为模块导入。

**Pitching Loader**

pitching loader 会将处理后的结果传递给下一个 loader 之前，执行一些额外的逻辑。pitching loader 通常用于处理资源文件的依赖关系。
