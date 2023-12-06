import { withMermaid } from 'vitepress-plugin-mermaid'

import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'

export default withMermaid({
  base: '/frontend-guide/',
  lang: 'zh-Hans',
  title: 'Frontend Guide',
  description: '分享前端开发技术和 Node.js 开发技术',
  titleTemplate: '分享前端开发技术和 Node.js 开发技术 - Frontend Guide',
  srcDir: 'src/docs',
  markdown: { lineNumbers: true },
  lastUpdated: true,
  head,
  themeConfig: {
    outline: { label: '文章导航' },
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/hojas' }],
    lastUpdatedText: '最后更新',
    footer: {
      message: 'Frontend Guide',
      copyright: 'Copyright © 2023-present frontend-guide',
    },
  },
})
