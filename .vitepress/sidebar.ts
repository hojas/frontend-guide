import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  '/javascript': [
    {
      text: 'JavaScript',
      items: [
        { text: '数据类型', link: '/javascript/type.html' },
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
  '/browser': [
    {
      text: '浏览器原理',
      items: [
        { text: '进程和线程', link: '/browser/process-and-thread.html' },
        { text: '事件循环', link: '/browser/event-loop.html' },
        // { text: 'blink 渲染引擎', link: '/browser/blink.html' },
        // { text: 'v8 引擎简介', link: '/browser/v8.html' },
      ],
    },
  ],
  '/source-code': [
    {
      text: '手搓代码',
      items: [
        { text: '深拷贝', link: '/source-code/deep-copy.html' },
      ],
    },
  ],
}
