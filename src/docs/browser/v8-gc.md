---
title: v8 垃圾回收
---

# v8 垃圾回收

垃圾回收器：Orinoco

## 分代回收

内存大小：

| 位宽 | 新生代 | 老生代 | 总计   |
| ---- | ------ | ------ | ------ |
| 32   | 16MB   | 700MB  | 732MB  |
| 64   | 32MB   | 1400MB | 1464MB |

## Minor GC (Scavenger)

## Major GC (Mark-Compact)

## 老生代

标记清除 Mark-Sweep

标记整理 Mark-Compact

增量标记 Incremental marking

懒清理 Lazy sweeping

并发 Concurrent

并行 Parallel

## 参考

1. https://v8.dev/blog/tags/memory
