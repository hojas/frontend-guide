---
title: Chrome Blink 渲染引擎
---

<script setup>
import ImgLoader from '../../components/ImgLoader.vue'
import blink from '../assets/img/browser/embedded-blink.png'
</script>

# Chrome Blink 渲染引擎

Blink 是一个 web 平台渲染引擎，实现了所有在浏览器标签内渲染内容的功能，包括：

1. 实施网络平台的规格（如 HTML 标准），包括 DOM、CSS 和 Web IDL
2. 嵌入 V8 并运行 JavaScript
3. 从底层网络栈请求资源
4. 构建 DOM 树
5. 计算样式和布局
6. 嵌入 Chrome Compositor 并绘制图形

<ImgLoader :src="blink" />

## 参考

- https://docs.google.com/document/d/1aitSOucL0VHZa9Z2vbRJSyAIsAz24kX8LFByQ5xQnUg/
