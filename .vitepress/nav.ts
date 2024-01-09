import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  {
    text: '语言',
    items: [
      { text: 'JavaScript', link: '/javascript' },
      { text: 'ECMAScript', link: '/ecmascript' },
      { text: 'TypeScript', link: '/typescript' },
    ],
  },
  { text: 'Vue 实现原理', link: '/vue' },
  // {
  //   text: '前端框架',
  //   items: [
  //     { text: 'Vue', link: '/vue' },
  //   ],
  // },
  { text: '前端工程化', link: '/engineering' },
  { text: '浏览器原理', link: '/browser' },
  // { text: '前端框架', link: '/frameworks' },
  // { text: '前端工程化', link: '/engineering' },
  // { text: '前端测试', link: '/testing' },
  // {
  //   text: '性能优化',
  //   link: '/performance',
  // },
  // { text: 'Node.js', link: '/nodejs' },
  {
    text: '手搓代码',
    link: '/source-code',
  },
  {
    text: '学习资源',
    link: '/resource',
  },
  // {
  //   text: '计算机基础',
  //   link: 'https://xiaolincoding.com/',
  // },
  // {
  //   text: '算法',
  //   link: 'https://www.programmercarl.com/',
  // },
  {
    text: '关于我',
    link: '/about',
  },
]
