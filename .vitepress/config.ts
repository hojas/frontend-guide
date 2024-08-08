import { getThemeConfig } from '@sugarat/theme/node'

import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'

const blogTheme = getThemeConfig({
  comment: {
    repo: 'hojas/frontend-guide',
    repoId: 'R_kgDOHItlnw',
    category: 'Announcements',
    categoryId: 'DIC_kwDOHItln84CblVj',
    inputPosition: 'bottom',
  },
  footer: {
    message: '',
    version: false,
    copyright: 'MIT License | 前端指北',
  },
})

export default {
  extends: blogTheme,
  base: '/',
  lang: 'zh-Hans',
  title: '前端指北',
  description: '前端指北是一个分享前端开发技术和 Node.js 开发技术的编程网站。',
  srcDir: 'src/docs',
  markdown: { lineNumbers: true, math: true, mermaid: true },
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
  },
}
