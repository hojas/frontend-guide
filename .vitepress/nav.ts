import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '前端基础', link: '/basic' },
  { text: '前端框架', link: '/frameworks' },
  { text: '前端测试', link: '/testing' },
  { text: '浏览器原理', link: '/browser' },
  { text: '前端工程化', link: '/engineering' },
  // {
  //   text: '性能优化',
  //   link: '/performance',
  // },
  // {
  //   text: '移动端',
  //   link: '/mobile',
  // },
  { text: 'Node.js', link: '/nodejs' },
  {
    text: '编程思想',
    link: '/thinking',
  },
  {
    text: '个人项目',
    link: '/project',
  },
  {
    text: '计算机基础',
    link: 'https://xiaolincoding.com/',
  },
  {
    text: '算法',
    link: 'https://www.programmercarl.com/',
  },
  {
    text: '工具推荐',
    link: '/tools',
  },
]
