---
title: HTML
---

# HTML

## HTML 元素 nodeType

获取元素 nodeType

```javascript
const t = document.querySelector('div').nodeType
console.log(t) // 1
```

| 值  | 节点类型              | nodeName       | nodeValue  | 描述                                               | 子节点                                                                       |
| --- | --------------------- | -------------- | ---------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Element               | 元素名         | null       | 代表元素                                           | Element, Text, Comment, ProcessingInstruction, CDATASection, EntityReference |
| 2   | Attribute             | 属性名称       | 属性值     | 代表属性                                           | Text, EntityReference                                                        |
| 3   | Text                  | #text          | 节点的内容 | 代表元素或属性中的文本内容                         | None                                                                         |
| 4   | CDATASection          | #cdata-section | 节点的内容 | 代表文档中的 CDATA 部分（不会由解析器解析的文本）  | None                                                                         |
| 7   | ProcessingInstruction | target         | 节点的内容 | 代表处理指令                                       | None                                                                         |
| 8   | Comment               | #comment       | 注释文本   | 代表注释                                           | None                                                                         |
| 9   | Document              | #document      | null       | 代表整个文档（DOM 树的根节点）                     | Element, ProcessingInstruction, Comment, DocumentType                        |
| 10  | DocumentType          | 文档类型名称   | null       | 向为文档定义的实体提供接口                         | None                                                                         |
| 11  | DocumentFragment      | #document 片段 | null       | 代表轻量级的 Document 对象，能够容纳文档的某个部分 | Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference |
| 12  | Notation              | 符号名称       | null       | 代表 DTD 中声明的符号                              | None                                                                         |
