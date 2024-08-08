---
title: webpack 插件
---

# webpack 插件

插件是 webpack 的支柱功能。Webpack 自身也是构建于你在 webpack 配置中用到的相同的插件系统之上！

插件目的在于解决 loader 无法实现的其他事。

webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象。

```js
// ConsoleLogOnBuildWebpackPlugin.js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin'

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建正在启动！')
    })
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin
```

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以在 webpack 构建流程中引入自定义的行为。创建插件比创建 loader 更加高级，因为你需要理解 webpack 底层的特性来处理相应的钩子，所以请做好阅读源码的准备！

**webpack 插件由以下组成：**

- 一个 JavaScript 命名函数或 JavaScript 类
- 在插件函数的 prototype 上定义一个 apply 方法
- 指定一个绑定到 webpack 自身的事件钩子
- 处理 webpack 内部实例的特定数据
- 功能完成后调用 webpack 提供的回调

## compiler

Compiler 模块是 webpack 的主要引擎，它通过 CLI 或者 Node API 传递的所有选项创建出一个 compilation 实例。 它扩展（extends）自 Tapable 类，用来注册和调用插件。大多数面向用户的插件会首先在 Compiler 上注册。常用的方法和属性有 run()、watch()、hooks、context 等。

## compilation

Compilation 模块会被 Compiler 用来创建新的 compilation 对象（或新的 build 对象）。 compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。
