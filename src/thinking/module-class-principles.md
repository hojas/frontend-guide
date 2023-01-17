---
title: 模块/类编程原则
---

# 模块/类编程原则

## 最大化内聚（Maximise Cohesion）

单一模块或组件的内聚力是指其职责形成一个有意义的单元的程度。内聚力越高越好。

## SOLID 原则

这是一个缩写，指的是：

- S：单一功能原则 (The Single Responsibility Principle)
- O：开闭原则 (The Open/Closed Principle)
- L：里氏替换原则 (The Liskov Substitution Principle)
- I：接口隔离原则 (The Interface Segregation Principle)
- D：依赖反转原则 (The Dependency Inversion Principle)

### 单一功能原则 (The Single Responsibility Principle)

这个原则表明模块或者类只应该做一件事。这意味着对程序功能的单个小更改，应该只需要更改一个组件。

### 开闭原则 (The Open/Closed Principle)

这个原则指出实体（可以是类、模块、函数等）应该能够使它们的行为易于扩展，但是它们的扩展行为不应该被修改。

### 里氏替换原则 (The Liskov Substitution Principle)

该原则指出，如果组件依赖于类型，那么它应该能够使用该类型的子类型，而不会导致系统失败或者必须知道该子类型的详细信息。

### 接口隔离原则 (The Interface Segregation Principle)

该原则指出组件的消费者不应该依赖于它实际上不使用的组件函数。

### 依赖倒置原则 (The Dependency Inversion Principle)

该原则指出，更高级别的协调组件不应该知道其依赖项的详细信息。
