import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  '/ecmascript': [
    {
      text: 'ECMAScript',
      items: [
        { text: '2023', link: '/ecmascript/2023.html' },
      ],
    },
  ],
  '/javascript': [
    {
      text: 'JavaScript',
      items: [
        { text: '数据类型', link: '/javascript/type.html' },
        { text: 'async/await的原理', link: '/javascript/async-await.html' },
      ],
    },
  ],
  '/typescript': [
    {
      text: 'TypeScript',
      items: [
        { text: '工具类型', link: '/typescript/utility-types.html' },
      ],
    },
  ],
  '/vue': [
    {
      text: 'Vue',
      items: [
        { text: '响应式原理', link: '/vue/reactivity.html' },
        // { text: 'Diff 算法', link: '/vue/diff.html' },
        // { text: '路由', link: '/vue/router.html' },
      ],
    },
  ],
  '/browser': [
    {
      text: '浏览器原理',
      items: [
        { text: '进程和线程', link: '/browser/process-and-thread.html' },
        { text: '事件循环', link: '/browser/event-loop.html' },
        { text: '页面渲染原理', link: '/browser/rendering.html' },
      ],
    },
  ],
  '/source-code': [
    {
      text: '手搓代码',
      items: [
        { text: '音频可视化的实现', link: '/source-code/voice-visualization.html' },
        { text: '深拷贝', link: '/source-code/deep-copy.html' },
      ],
    },
  ],
}
