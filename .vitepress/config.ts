import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'

export default withMermaid(
  defineConfig({
    lang: 'zh-Hans',
    title: '前端开发知识体系',
    description: '分享前端开发技术和 Node.js 开发技术',
    titleTemplate: '分享前端开发技术和 Node.js 开发技术 - 前端开发技术体系',
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
        message: '前端开发知识体系',
        copyright: 'Copyright © 2022-present chenyuanxiang.com',
      },
    },
  })
)
