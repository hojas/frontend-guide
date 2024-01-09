---
title: webpack 插件
---

# webpack 插件

插件是 webpack 的支柱功能。Webpack 自身也是构建于你在 webpack 配置中用到的相同的插件系统之上！

插件目的在于解决 loader 无法实现的其他事。

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以在 webpack 构建流程中引入自定义的行为。创建插件比创建 loader 更加高级，因为你需要理解 webpack 底层的特性来处理相应的钩子，所以请做好阅读源码的准备！

webpack5的插件是一个类，它继承自 webpack.Plugin 类。webpack.Plugin 类提供了一些钩子方法，插件可以通过这些钩子方法来执行自己的逻辑。

webpack5 的插件原理可以概括为以下几个步骤：

1. webpack 在构建阶段，会根据配置文件中的插件列表，创建插件实例
2. webpack 会为每个插件实例调用 apply() 方法，并传入 compiler 对象作为参数
3. 插件实例会在 apply() 方法中执行自己的逻辑
4. webpack 会将插件实例的返回值作为钩子方法的参数

插件可以通过钩子方法来执行自己的逻辑。

**webpack5提供了以下钩子方法：**

1. apply()：在插件实例创建后调用
2. init()：在插件实例初始化后调用
3. preCompile()：在编译模块之前调用
4. compile()：在编译模块时调用
5. postCompile()：在编译模块之后调用
6. emit()：在打包文件之前调用
7. normalModuleFactory()：在创建模块工厂时调用
