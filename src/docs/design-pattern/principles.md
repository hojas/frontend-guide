---
title: SOLID 编程原则
---

# SOLID 编程原则

## 什么是 SOLID 原则

SOLID 是面向对象编程和设计（OOP & OOD）中的五个基本原则，它们能够帮助我们设计出更加健壮、可维护、可扩展的软件。

SOLID 是由 Robert C. Martin 在 2000 年代初提出的，它们是：

- **S**ingle Responsibility Principle（单一职责原则）
- **O**pen-Closed Principle（开闭原则）
- **L**iskov Substitution Principle（里氏替换原则）
- **I**nterface Segregation Principle（接口隔离原则）
- **D**ependency Inversion Principle（依赖倒置原则）

## 单一职责原则

一个 class 只做一件事情。一个函数只做一件事情。一个组件只做一件事情。

## 开闭原则

软件实体（类、模块、函数、组件等）应该对扩展开放，对修改关闭。

## 里氏替换原则

子类可以扩展父类的功能，但不能改变父类原有的功能。

## 接口隔离原则

不应该强迫客户端依赖它们不需要的接口。

## 依赖倒置原则

高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象。
