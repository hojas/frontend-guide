---
title: 性能优化实践
---

# 性能优化实践

## 加载优化

1. 减少 HTTP 请求
2. 使用服务端渲染
3. 静态资源使用 CDN
4. CSS 放在 head 中，JS 放在 body 最后
5. 字体图标代替图片图标
6. 使用 HTTP 缓存
7. 图片优化：延迟加载、降低图片质量、使用 CSS3 代替图片效果
8. 通过打包实现按需加载文件

## 运行时优化

1. 减少重绘重排
2. 使用事件委托
3. 降低 CSS 选择器的复杂性
4. 使用 flex 布局