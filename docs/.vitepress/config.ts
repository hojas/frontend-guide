import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '陈远翔',
  description: '热爱前端开发',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog' },
      { text: '项目', link: '/project' },
    ],

    sidebar: {
      '/blog/': [
        {
          text: '博客',
          items: [
            { text: '浏览器页面渲染原理', link: '/blog/6' },
            { text: '浏览器事件循环原理', link: '/blog/5' },
            { text: '手写实现数组实例方法', link: '/blog/4' },
            { text: '使用 Docker 一键部署带 Let\'s Encrypt SSL 证书的 Nginx', link: '/blog/3' },
            { text: '在 Vue 中实现音频可视化', link: '/blog/2' },
            { text: 'JavaScript 脚本的加载时机', link: '/blog/1' },
          ],
        },
      ],
      '/project/': [
        {
          text: '项目',
          items: [
          ],
        },
      ],

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hojas' },
    ],
  },
})
