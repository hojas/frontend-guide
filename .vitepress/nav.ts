import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  {
    text: '前端基础',
    link: '/basic',
  },
  { text: 'Vue 实现原理', link: '/vue' },
  // {
  //   text: '前端框架',
  //   items: [
  //     { text: 'Vue', link: '/vue' },
  //   ],
  // },
  { text: '前端工程化', link: '/engineering' },
  { text: '性能优化', link: '/performance' },
  { text: '浏览器原理', link: '/browser' },
  { text: 'Node.js', link: '/nodejs' },
  { text: '手搓代码', link: '/source-code' },
  { text: '网络', link: '/network' },
  // {
  //   text: '算法',
  //   link: '/algorithm',
  // link: 'https://www.programmercarl.com/',
  // },
  { text: '设计模式', link: '/design-pattern' },
  // { text: '学习资源', link: '/resource' },
  { text: '关于我', link: '/about' },
]
