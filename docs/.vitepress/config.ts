import { defineConfig } from 'vitepress'
import { head } from './head'
import { sidebar } from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-Hans',
  title: '陈远翔',
  description: '热爱前端开发',
  ignoreDeadLinks: true,
  head,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog' },
      { text: '项目', link: '/project' },
      { text: '关于', link: '/about' },
    ],

    sidebar,

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hojas' },
    ],

    footer: {
      message: '陈远翔个人网站',
      copyright: 'Copyright © 2024-present feguide.net',
    },
  },
})
