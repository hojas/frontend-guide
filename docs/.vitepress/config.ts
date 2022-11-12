/** @type {import('vitepress').UserConfig} */
export default {
  lang: 'zh-Hans',
  title: '陈远翔前端博客',
  titleTemplate: '分享前端开发技术和 Node.js 开发技术',
  description: '分享前端开发技术和 Node.js 开发技术',
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
  themeConfig: {
    outlineTitle: '文章导航',
    nav: [
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
        text: '前端框架',
        items: [
          { text: 'Vue', link: '/framework/vue' },
          { text: 'React', link: '/framework/react' },
          { text: 'Angular', link: '/framework/angular' },
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
      {
        text: '性能优化',
        link: '/performance',
      },
      // {
      //   text: '移动端',
      //   link: '/mobile',
      // },
      {
        text: 'Node.js',
        link: '/nodejs',
      },
      {
        text: '计算机网络',
        link: '/network',
      },
      {
        text: '个人项目',
        link: '/project',
      },
      {
        text: '博客',
        link: '/blog',
      },
    ],
    sidebar: {
      '/browser': [
        {
          text: '浏览器原理',
          items: [
            {
              text: '浏览器架构',
              link: '/browser/architecture',
            },
            {
              text: '页面加载过程',
              link: '/browser/navigation',
            },
            {
              text: '浏览器渲染流程',
              link: '/browser/render',
            },
            {
              text: 'v8 引擎',
              link: '/browser/v8',
            },
            {
              text: 'v8 垃圾回收',
              link: '/browser/v8-gc',
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hojas' }],
    lastUpdatedText: '最后更新',
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2022-present hojas',
    },
  },
}
