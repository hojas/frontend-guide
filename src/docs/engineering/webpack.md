---
title: webpack 原理
---

# webpack 原理

## 核心概念

1. Entry
2. Output
3. Loader
4. Plugin
5. Mode

详情查看文档：https://webpack.js.org/concepts/

## 编译过程

1. 初始化阶段
2. 构建阶段
   1. 创建模块
   2. 依赖收集
   3. 模块编译
   4. chunk 分割
3. 生成阶段
4. 输出阶段

### 一、初始化阶段

在初始化阶段，webpack 会根据用户的配置文件创建一个 compiler 对象。compiler 对象是 webpack 的核心，它负责整个打包过程的控制。

### 二、构建阶段

构建阶段是 webpack 打包流程中最重要的阶段。在构建阶段，webpack 会根据用户的配置文件，对源代码进行解析、编译、优化等处理，最终生成可执行的代码。

构建阶段可以分为以下几个步骤：

1. 创建模块

在创建模块阶段，webpack 会根据入口文件的内容，创建一个个模块对象。模块对象包含了模块的名称、路径、依赖等信息。

2. 依赖收集

在依赖收集阶段，webpack 会根据模块的依赖关系，将所有相关的模块都收集到一起。

3. 模块编译

在模块编译阶段，webpack 会根据用户配置的 loader，对每个模块进行编译。loader 可以对模块的代码进行转换、压缩、优化等处理。

4. chunk 分割

在 chunk 分割阶段，webpack 会根据模块的使用情况，将模块分割成多个 chunk。chunk 是 webpack 打包输出的最小单元。

### 三、生成阶段

在生成阶段，webpack 会根据 chunk 的类型，生成相应的输出文件。例如，js 文件会生成 js 文件，css 文件会生成 css 文件。

### 四、输出阶段

在输出阶段，webpack 会将生成的文件输出到指定的目录。

### 什么是 Compiler ？

Compiler 继承自 Tapable，是 Webpack 的整个生命周期管理，代表了完整的 Webpack 环境配置。

每个 Webpack 的配置，对应一个 Compiler 对象，记录了 Webpack 的 options、loader 和 plugin 等信息，并且通过的 Hook 机制管理整个打包流程的生命周期。

### 什么是 Compilation ？

Compilation 也继承自 Tapable，代表了一次资源版本构建，包含了当前的模块资源、编译生成资源、变化的文 件、以及被跟踪依赖的状态信息。

每次构建过程都会产生一次 Compilation，比如我们启动 watch 功能的时候，每当检测到一个文件变化，就会重新创建一个新的 Compilation，从而生成一组新的编译资源。
