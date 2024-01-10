---
title: Node.js 中的事件循环
---

# Node.js 中的事件循环

## 异步 API

**定时器**

1. setTimeout
2. setInterval

**I/O**

1. 文件读写
2. 网络请求
3. 数据库操作
4. ...

**Node.js 独有 API**

1. process.nextTick
2. setImmediate

## 任务队列

**Timer 队列**

用于处理 setTimeout 和 setInterval 的回调。

**Poll 队列**

用于处理 I/O 回调。

**Check 队列**

用于处理 setImmediate 的回调。

**NextTick 队列**

用于处理 process.nextTick 的回调。

**Microtask 队列**

用于处理 Promise 的回调。

## 事件循环流程

Node.js 事件循环主要有以下几个阶段：

1. timers：执行 setTimeout() 和 setInterval() 的回调
2. pending callbacks：将 I/O 回调推迟到下一次循环迭代时执行
3. idle, prepare：仅在内部使用
4. poll：检索新的 I/O 事件；执行与 I/O 相关的回调（除了关闭回调、定时器的回调和 setImmediate() 以外的几乎所有回调）；node 将在适当的时候在此阻塞
5. check：调用 setImmediate() 的回调
6. close callbacks：一些关闭回调，如 socket.on('close',...)

事件循环的完整流程如下：

```txt
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

1. node 的初始化
   1. 初始化 node 环境
   2. 执行输入代码
   3. 执行 **process.nextTick** 回调
   4. 执行 **microtask**
2. 进入 event-loop
   1. 进入 **timers** 阶段
      1. 检查 timer 队列中是否有到期的 timer 回调，如果有，将到期的 timer 回调按照 timerId 升序执行
      2. 检查是否有 process.nextTick 回调，如果有，全部执行
      3. 检查是否有 microtask，如果有，全部执行
      4. 退出 **timers** 阶段
   2. 进入 **pending callbacks** 阶段
      1. 检查是否有 pending 的 I/O 回调。如果有，执行回调。如果没有，退出该阶段
      2. 检查是否有 process.nextTick 任务，如果有，全部执行
      3. 检查是否有 microtask，如果有，全部执行
      4. 退出该阶段
   3. 进入 **idle, prepare** 阶段
      1. 这个阶段是内部使用的
   4. 进入 **poll** 阶段
      1. 如果 poll 队列不是空的
         1. 那么执行所有可用的回调，直到 poll 队列为空或者达到系统最大限制
         2. 检查是否有 process.nextTick 任务，如果有，全部执行
         3. 检查是否有 microtask，如果有，全部执行
      2. 如果 poll 队列为空
         1. 如果之前设置过 setImmediate 回调，那么退出 poll 阶段，进入 check 阶段
         2. 如果之前没有设置过 setImmediate 回调，那么阻塞在此阶段，等待新的事件通知
   5. 进入 **check** 阶段
      1. 如果有 immediate 回调，则执行所有 immediate 回调
      2. 检查是否有 process.nextTick 回调，如果有，全部执行
      3. 检查是否有 microtask，如果有，全部执行
      4. 退出 check 阶段
   6. 进入 **close callbacks** 阶段
      1. 如果有 immediate 回调，则执行所有 immediate 回调
      2. 检查是否有 process.nextTick 回调，如果有，全部执行
      3. 检查是否有 microtask，如果有，全部执行
      4. 退出 closing 阶段
   7. 检查是否有活跃的 handles（定时器、IO 等事件句柄）
      1. 如果有，继续下一轮循环
      2. 如果没有，结束事件循环，退出程序
