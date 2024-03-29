---
title: Chrome 浏览器架构简介
description: Chrome 浏览器架构简介
---

# Chrome 浏览器架构简介

## 浏览器多进程架构

主要包含以下进程：

**1、浏览器进程（Browser）**

负责浏览器的 Chrome 部分， 包括导航栏、书签、前进和后退按钮。同时这个进程还会控制那些我们看不见的部分，包括网络请求的发送以及文件的读写。

**2、渲染进程（Renderer）**

负责 tab 内和网页展示相关的所有工作。

**3、插件进程（Plugin）**

控制网页使用的所有插件，例如 flash 插件。

**4、GPU 进程**

负责独立于其它进程的 GPU 任务。它之所以被独立为一个进程是因为它要处理来自于不同 tab 的渲染请求并把它在同一个界面上画出来。

## 面向服务的架构

Chrome 可以将浏览器程序的每个部分作为服务运行，允许轻松地拆分成不同的进程或聚合成一个进程。

当 Chrome 浏览器在强大的硬件上运行时，它可能会将每个服务分成不同的进程，以提供更多的稳定性，但如果是在资源有限的设备上，Chrome
浏览器会将服务合并到一个进程中，以节省内存占用。

## 基于站点隔离的渲染进程

自 Chrome 67 以来，在桌面上默认启用了网站隔离，标签中的每个跨网站 iframe 都有一个单独的渲染器进程。

### 参考链接：

1. https://zhuanlan.zhihu.com/p/262182267
2. https://developer.chrome.com/blog/inside-browser-part1/
