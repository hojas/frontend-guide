---
title: JavaScript 中的 in 运算符
---

# JavaScript 中的 in 运算符

如果指定的属性在指定的对象或其原型链中，则 in 运算符返回 true。

以下内容来自 ECMAScript Specification。

## RelationalExpression : RelationalExpression in ShiftExpression

1. Let lref be ? Evaluation of RelationalExpression.
2. Let lval be ? GetValue(lref).
3. Let rref be ? Evaluation of ShiftExpression.
4. Let rval be ? GetValue(rref).
5. If rval is not an Object, throw a TypeError exception.
6. Return ? HasProperty(rval, ? ToPropertyKey(lval)).

## [[HasProperty]]

(propertyKey) → Boolean

Return a Boolean value indicating whether this object already has either an own or inherited property whose key is propertyKey.
