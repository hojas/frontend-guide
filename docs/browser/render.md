---
title: 浏览器页面渲染流程
---

# 浏览器页面渲染流程

![渲染流程](https://chenyuanxiang.oss-cn-hangzhou.aliyuncs.com/fe-stack/browser/render.png)

## 一、构建 DOM

1. 将 HTML 解析成 Tokens
2. 将 Tokens 解析成 object
3. 接 object 组合成 DOM 树

## 二、构建 CSSOM

解析 CSS 文件，构建 CSSOM 树

## 三、构建 Render Tree

结合 DOM 和 CSSOM 构建 Render Tree

## 四、Layout（重排/回流）

计算元素相对于 viewport 的位置

## 五、Paint（重绘）

将 Render 树转换成像素，显示在屏幕上
