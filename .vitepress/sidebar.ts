import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
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
}
