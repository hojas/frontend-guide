/** @type {import('vitepress').UserConfig} */
export default {
  lang: 'zh-Hans',
  title: '前端开发知识体系',
  description: '分享前端开发技术和 Node.js 开发技术',
  titleTemplate: '分享前端开发技术和 Node.js 开发技术 - 前端开发技术体系',
  srcDir: 'src/docs',
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
  head: [
    [
      'meta',
      {
        name: 'keywords',
        content: '前端开发,前端博客,Node.js开发',
      },
    ],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${process.env.BAIDU_HM_CODE}";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      `,
    ],
  ],
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
        text: '浏览器原理',
        link: '/browser',
      },
      {
        text: '前端工程化',
        link: '/engineering',
      },
      // {
      //   text: '性能优化',
      //   link: '/performance',
      // },
      // {
      //   text: '移动端',
      //   link: '/mobile',
      // },
      {
        text: 'Node.js',
        items: [
          {
            text: '最佳实践',
            link: 'https://github.com/goldbergyoni/nodebestpractices',
          },
        ],
      },
      {
        text: '计算机基础',
        link: 'https://xiaolincoding.com/',
      },
      {
        text: '算法',
        link: 'https://www.programmercarl.com/',
      },
      // {
      //   text: '前端框架',
      //   items: [
      //     { text: 'Vue', link: '/framework/vue' },
      //     { text: 'React', link: '/framework/react' },
      //     { text: 'Angular', link: '/framework/angular' },
      //   ],
      // },
      {
        text: '编程思想',
        link: '/thinking',
      },
      {
        text: '个人项目',
        link: '/project',
      },
      {
        text: '博客文章',
        link: '/blog',
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/hojas' }],
    lastUpdatedText: '最后更新',
    footer: {
      message: '前端开发知识体系',
      copyright: 'Copyright © 2022-present chenyuanxiang.com',
    },
  },
}
