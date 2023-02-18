---
title: 通用编程原则
---

# 通用编程原则

## 1. KISS

Keep It Simple, Stupid.

大多数系统如果保持简单而不是复杂，效果最好。

## 2. YAGNI

You Aren't Gonna Need It.

在必要之前不要做多余的事情。

## 3. Do The Simplest Thing That Could Possibly Work

仅当我们只解决问题本身时，才能最大化地解决实际问题。

## 4. 关注点分离（Separation of Concerns）

关注点分离是将计算机程序分成不同部分的设计原则，这样每个部分都解决了一个单独的关注点。例如，一个应用程序的业务逻辑和用户界面是独立的关注点。改变用户界面不应要求改变业务逻辑，反之亦然。

## 5. Keep things DRY

DRY(Don’t Repeat Yourself): 每项知识都必须在一个系统内有一个单一的、明确的、权威的表述。

程序中的每个重要功能都应该在源代码中的一个地方实现。如果类似的功能是由不同的代码片断完成的，一般来说，通过抽象出不同的部分将它们合二为一是有好处的。

## 6. 为维护者写代码（Code For The Maintainer）

为维护者写代码，始终以这样的方式进行编码和注释，新人接手项目后，他们会在阅读和学习代码中获得乐趣。

## 7. 避免过早优化（Avoid Premature Optimization）

程序员们浪费了大量的时间来考虑或担心他们程序中非关键部分的速度，而这些对效率的尝试在考虑到调试和维护时实际上有很大的负面影响。我们应该忘记小的效率，比如说大约 97%的时间：过早的优化是万恶之源。然而，我们不应该放弃那关键的 3%的机会。

## 8. 童子军军规（Boy Scout Rule）

美国童子军有一条简单的军规，我们可以使用到我们的职业中：“离开营地时比你到达时更干净”。根据童子军军规，我们应该至终保持代码比我们看到时更干净。