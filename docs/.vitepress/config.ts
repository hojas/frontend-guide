export default {
  base: '/fe-stack/',
  lang: 'zh-Hans',
  title: '前端开发技术体系',
  titleTemplate: '分享前端开发技术和 Node.js 开发技术',
  description: '分享前端开发技术和 Node.js 开发技术',
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
  themeConfig: {
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
        text: '前端工程化',
        link: '/engineering',
      },
      {
        text: '性能优化',
        link: '/performance',
      },
      {
        text: '浏览器原理',
        link: '/browser',
      },
      {
        text: '移动端',
        link: '/mobile',
      },
      {
        text: 'Node.js',
        link: '/nodejs',
      },
    ],
    sidebar: {
      '/basic/javascript/': [
        {
          text: 'JavaScript',
          collapsible: true,
          items: [
            {
              text: 'Array',
              link: '/basic/javascript/array',
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hojas' }],
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2022-present hojas',
    },
  },
};
