import { withMermaid } from 'vitepress-plugin-mermaid'

import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'

export default withMermaid({
  base: '/',
  lang: 'zh-Hans',
  title: 'FrontendGuide',
  description: '分享前端开发技术和 Node.js 开发技术',
  titleTemplate: '分享前端开发技术和 Node.js 开发技术 - FrontendGuide',
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
      copyright: 'Copyright © 2023-present FrontendGuide',
    },
  },
})
