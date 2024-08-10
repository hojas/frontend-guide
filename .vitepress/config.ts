import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'

// 每页的文章数量
const pageSize = 15

export default defineConfig({
  lang: 'zh-Hans',
  base: '/',
  cacheDir: './node_modules/.vitepress_cache',
  title: '前端指北',
  description: '前端指北是一个分享前端开发技术和 Node.js 开发技术的编程网站。',
  ignoreDeadLinks: true,
  themeConfig: {
    posts: await getPosts(pageSize),
    website: 'https://www.feguide.net', // copyright link
    // 评论的仓库地址
    comment: {
      repo: 'hojas/frontend-guide',
      themes: 'github-light',
      issueTerm: 'pathname',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/pages/category' },
      { text: '归档', link: '/pages/archives' },
      { text: '标签', link: '/pages/tags' },
      { text: '关于我', link: '/pages/about' },
      // { text: 'Airene', link: 'http://airene.net' }  -- External link test
    ],
    search: {
      provider: 'local',
    },
    // outline:[2,3],
    outline: {
      label: '文章导航',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hojas' }],
  } as any,
  srcExclude: ['README.md'], // exclude the README.md , needn't to compiler
})
