import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/fe-stack/',
  title: '前端全栈知识体系',
  description: '前端全栈知识体系',
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端基础',
        items: [
          { text: 'HTML', link: '/html/' },
          { text: 'CSS', link: '/css/' },
          { text: 'JavaScript', link: '/javascript/' },
          { text: 'TypeScript', link: '/typescript/' },
        ],
      },
      {
        text: '前端框架',
        items: [
          { text: 'Vue', link: '/vue/' },
          { text: 'React', link: '/react/' },
          { text: 'Angular', link: '/angular/' },
        ],
      },
      {
        text: '前端工程化',
        link: '/engineering/',
      },
      {
        text: '性能优化',
        link: '/performance/',
      },
      {
        text: '浏览器原理',
        link: '/browser/',
      },
      {
        text: '移动端',
        link: '/mobile/',
      },
      {
        text: 'Node.js',
        link: '/nodejs/',
      },
    ],
  },
})
