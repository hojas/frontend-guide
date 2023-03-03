import { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  {
    text: '前端基础',
    items: [
      { text: 'HTML', link: '/basic/html' },
      { text: 'CSS', link: '/basic/css' },
      { text: 'JavaScript', link: '/basic/javascript' },
      { text: 'TypeScript', link: '/basic/typescript' },
    ],
  },
  {
    text: '浏览器原理',
    link: '/browser',
  },
  {
    text: '前端工程化',
    link: '/engineering',
  },
  // {
  //   text: '性能优化',
  //   link: '/performance',
  // },
  // {
  //   text: '移动端',
  //   link: '/mobile',
  // },
  {
    text: 'Node.js',
    items: [
      {
        text: '最佳实践',
        link: 'https://github.com/goldbergyoni/nodebestpractices',
      },
    ],
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
    text: '编程思想',
    link: '/thinking',
  },
  {
    text: '个人项目',
    link: '/project',
  },
  {
    text: '博客文章',
    link: '/blog',
  },
]
