import { defineConfig } from 'vitepress'
import { head } from './head'
import { sidebar } from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-Hans',
  title: '前端指北',
  description: '收集网络上优质的大前端开发和 Node.js 开发知识',
  ignoreDeadLinks: true,
  head,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '前端基础', link: '/basic' },
      { text: 'Vue', link: '/vue' },
      { text: 'React', link: '/react' },
      { text: 'JavaScript', link: '/javascript' },
      { text: '计算机基础', link: '/cs' },
      { text: '实战', link: '/blog' },
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
      message: 'FrontendGuide 前端指北',
      copyright: 'Copyright © 2024-present feguide.net',
    },
  },
})
