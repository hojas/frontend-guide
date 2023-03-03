import { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  '/browser': [
    {
      text: '浏览器原理',
      items: [
        { text: 'blink 渲染引擎', link: '/browser/blink.html' },
        { text: 'v8 引擎', link: '/browser/v8.html' },
      ],
    },
  ],
}
