---
title: 字符集和编码
---

# 字符集和编码

## 字符集

字符集（Character Set）是指一组字符的集合，用于定义哪些字符可以被编码和使用。字符集通常包含字母、数字、标点符号、特殊符号等。

**常见字符集：**

1. ASCII（American Standard Code for Information Interchange）
   - 范围：0-127，共128个字符。
   - 特点：只包含英文字母（大小写）、数字、控制字符和基本标点符号。
   - 局限性：不支持非拉丁字符（如汉字、阿拉伯字母）。
2. ISO 8859 系列
   - 范围：扩展ASCII字符集，包含256个字符（0-255）。
   - 特点：适应不同地区的需求，如ISO 8859-1支持西欧语言字符。
   - 局限性：支持区域有限，不能同时支持多种语言。
3. GB2312 / GBK / GB18030（中文字符集）
   - GB2312：支持6763个汉字和682个符号。
   - GBK：扩展GB2312，支持21003个汉字。
   - GB18030：支持全Unicode字符，兼容GBK。
4. Unicode
   - 范围：理论上可容纳所有语言的字符。
   - 特点：为每个字符分配唯一的编码点（代码点），如U+0041代表字符”A”。
   - 主要版本：
      - UTF-8：可变长度编码，1至4字节，兼容ASCII。
      - UTF-16：定长或可变长度编码，2或4字节。
      - UTF-32：定长编码，固定为4字节。

## 编码

编码（Encoding）是指将字符集中的字符转换为计算机可处理的二进制数据的规则。

**常见编码方式：**

1. ASCII 编码
   - 单字节编码，直接将字符映射为0-127的二进制值。
   - 如：A -> 01000001
2. UTF-8 编码
   - 可变长度编码，适用于Unicode。
   - ASCII字符占1字节，常用汉字占3字节，少见字符可能占4字节。
   - 如：中 -> 11100100 10111100 10100000
3. UTF-16 编码
   - 定长或可变长度编码，基本字符集用2字节表示，补充字符用4字节。
   - 如：中 -> 01001110 00010000
4. UTF-32 编码
   - 每个字符用 4 字节（32位）编码，简单但占用空间大。
   - 如：中 -> 00000000 00000000 01001110 00010000
5. GBK 编码
   - 中文扩展编码，兼容ASCII，汉字占用2字节。
   - 如：中 -> 11010100 10111101
6. 其他区域编码
   - 如Shift-JIS（用于日文）、EUC-KR（用于韩文）。

## 编码与字符集的关系

1. 字符集是基础，编码是实现。
   - 字符集定义有哪些字符，编码定义如何表示这些字符。
2. 一个字符集可以有多种编码方式。
   - 如Unicode字符集支持UTF-8、UTF-16、UTF-32编码。

## 如何选择字符集和编码？
1. 国际化项目： 推荐使用Unicode（如UTF-8），因为它支持多语言。
2. 中文项目： 如果只需要中文，可以考虑GBK，但建议优先UTF-8。
3. 存储效率优先： 根据文本内容选择最适合的编码，如ASCII对纯英文最节省空间。