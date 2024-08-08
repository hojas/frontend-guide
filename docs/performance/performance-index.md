---
title: 性能指标
---

<script setup>
import ImgLoader from '../../components/ImgLoader.vue'
import lcp from './assets/good-lcp-values.svg'
import cls from './assets/good-cls-values.svg'
import fid from './assets/good-fid-values-25.svg'
import inp from './assets/inp-desktop-v2.svg'
import ttfbDiagram from './assets/performance-navigation-timing-timestamp-diagram.svg'
import ttfb from './assets/good-ttfb-values.svg'
import fcp from './assets/good-fcp-values-18.svg'
</script>

# 性能指标

## LCP

> Largest Contentful Paint

最大内容绘制（LCP）指标会报告视口内可见的最大图片或文本块的呈现时间（相对于用户首次导航到页面的时间）。

为了提供良好的用户体验，网站应努力将 LCP 控制在 2.5 秒以内。为了确保您的大多数用户都能达到此目标，最好衡量一下网页加载的第 75 百分位（按移动设备和桌面设备细分）。

<ImgLoader :src="lcp" alt="LCP" />

## CLS

> Cumulative Layout Shift

CLS 用于衡量在网页的整个生命周期内发生的每次意外布局偏移的最大突发布局偏移分数。

为了提供良好的用户体验，网站应努力使 CLS 得分不超过 0.1。为了确保您的大多数用户都能达到此目标，比较好的做法是网页加载的第 75 个百分位数（按移动设备和桌面设备细分）。

<ImgLoader :src="cls" alt="CLS" />

## FID

> First Input Delay

FID 衡量的是从用户首次与网页互动（即，点击链接、点按按钮或使用由 JavaScript 提供支持的自定义控件）到浏览器能够实际开始处理事件处理脚本以响应该互动的时间。

为了提供良好的用户体验，网站应努力将 First Input Delay 控制在 100 毫秒以内。为了确保大多数用户都能达到此目标，衡量网页加载的第 75 百分位（按移动设备和桌面设备细分）是一个不错的阈值。

<ImgLoader :src="fid" alt="FID" />

## INP

> Interaction to Next Paint

INP 是一项指标，通过观察在用户访问网页期间发生的所有点击、点按和键盘互动的延迟时间，评估网页对用户互动的总体响应情况。最终 INP 值是观察到的最长互动，忽略离群值。

- INP 低于或 200 毫秒表示网页响应速度较快。
- INP 高于 200 毫秒且低于或等于 500 毫秒表示网页的响应速度需要改进。
- INP 高于 500 毫秒表示网页响应速度很差。

<ImgLoader :src="inp" alt="INP" />

## TTFB

> Time to First Byte

TTFB 用于测量资源请求与响应的第一个字节开始到达之间的时间。

<ImgLoader :src="ttfbDiagram" alt="TTFB" />

TTFB 是以下请求阶段的总和：

- 重定向时间
- Service Worker 启动时间（如果适用）
- DNS 查找
- 连接和 TLS 协商
- 请求，直到响应的第一个字节已到达

缩短连接设置时间和后端的延迟时间有助于降低 TTFB。

由于 TTFB 早于以用户为中心的指标（例如 First Contentful Paint (FCP) 和 Largest Contentful Paint (LCP)），因此我们建议您的服务器响应导航请求的速度足够快，以便 75% 的用户能够体验到 FCP 不超过“良好”阈值。一般来说，大多数网站都应尽量将播放至第一字节的时间控制在 0.8 秒以内。

<ImgLoader :src="ttfb" alt="TTFB" />

## FCP

> First Contentful Paint

首次内容绘制（FCP）指标用于测量从用户首次导航到页面的那部分时间，到页面内容的任何部分呈现在屏幕上的时间。 对于此指标，“内容”是指文本、图片（包括背景图片）、`<svg>` 元素或非白色 `<canvas>` 元素。

为了提供良好的用户体验，网站应努力将 FCP 控制在 1.8 秒以内。为了确保您的大多数用户都能达到此目标，最好衡量一下网页加载的第 75 百分位（按移动设备和桌面设备细分）。

<ImgLoader :src="fcp" alt="FCP" />

## TBT

> Total Blocking Time

总阻塞时间 (TBT) 指标测量在首次内容绘制 (FCP) 之后所用的总时间，其中主线程被阻塞的时间足够长，足以阻止输入响应。

为了提供良好的用户体验，在普通移动硬件上测试网站时，网站应尽量使总阻塞时间低于 200 毫秒。

## 参考

- https://web.dev/explore/metrics?hl=zh-cn
