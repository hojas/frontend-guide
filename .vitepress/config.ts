import { withMermaid } from 'vitepress-plugin-mermaid'

import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'

export default withMermaid({
  base: '/',
  lang: 'zh-Hans',
  title: 'FrontendGuide',
  description: 'FrontendGuide 是一个分享前端开发技术和 Node.js 开发技术的编程网站。',
  srcDir: 'src/docs',
  markdown: { lineNumbers: true },
  lastUpdated: true,
  head,
  themeConfig: {
    outline: { label: '文章导航', previous: '上一篇', next: '下一篇' },
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/hojas' }],
    lastUpdatedText: '最近更新',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    footer: {
      copyright: 'Copyright © 2024-present FrontendGuide',
    },
  },
})
