import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  '/ecmascript': [
    {
      text: 'ECMAScript',
      items: [
        { text: '2023', link: '/ecmascript/2023' },
      ],
    },
  ],
  '/javascript': [
    {
      text: 'JavaScript',
      items: [
        { text: '数据类型', link: '/javascript/type' },
        { text: 'async/await 的原理', link: '/javascript/async-await' },
        { text: 'requestIdleCallback', link: '/javascript/request-idle-callback' },
        { text: 'requestAnimationFrame', link: '/javascript/request-animation-frame' },
      ],
    },
  ],
  '/typescript': [
    {
      text: 'TypeScript',
      items: [
        { text: '工具类型', link: '/typescript/utility-types' },
      ],
    },
  ],
  '/vue': [
    {
      text: 'Vue 实现原理',
      items: [
        { text: '响应式原理', link: '/vue/reactivity' },
        { text: 'effectScope.ts 源码分析', link: '/vue/effect-scope' },
        { text: 'effect.ts 源码分析', link: '/vue/effect' },
        { text: 'reactiveEffect.ts 源码分析', link: '/vue/reactive-effect' },
        { text: 'reactive.ts 源码分析', link: '/vue/reactive' },
        { text: 'ref 实现原理', link: '/vue/ref' },
        { text: 'computed 实现原理', link: '/vue/computed' },
        { text: 'watch 实现原理', link: '/vue/watch' },
        { text: 'Diff 算法', link: '/vue/diff' },
        // { text: '路由', link: '/vue/router' },
      ],
    },
  ],
  '/engineering': [
    {
      text: '工程化',
      items: [
        { text: 'Webpack', link: '/engineering/webpack' },
        { text: 'Webpack Loader', link: '/engineering/webpack-loader' },
        { text: 'Webpack 插件', link: '/engineering/webpack-plugin' },
      ],
    },
  ],
  '/performance': [
    {
      text: '性能优化',
      items: [
        { text: '性能指标', link: '/performance/performance-index' },
        { text: '性能优化实践', link: '/performance/practice' },
      ],
    },
  ],
  '/browser': [
    {
      text: '浏览器原理',
      items: [
        { text: '进程和线程', link: '/browser/process-and-thread' },
        { text: '事件循环', link: '/browser/event-loop' },
        { text: '页面渲染原理', link: '/browser/rendering' },
      ],
    },
  ],
  '/nodejs': [
    {
      text: 'Node.js',
      items: [
        { text: '事件循环', link: '/nodejs/event-loop' },
      ],
    },
  ],
  '/blog': [
    {
      text: '博客文章',
      items: [
        { text: '使用 Docker 一键部署带 Let\'s Encrypt SSL 证书的 Nginx', link: '/blog/1' },
        { text: '音频可视化的实现', link: '/blog/2' },
      ],
    },
  ],
  '/algorithm': [
    {
      text: '算法',
      items: [
        { text: '排序算法', link: '/algorithm/sorting' },
      ],
    },
  ],
  '/design-pattern': [
    {
      text: '设计模式',
      items: [
        { text: '编程原则', link: '/design-pattern/principles' },
        { text: '常用设计模式', link: '/design-pattern/design-patterns' },
      ],
    },
  ],
}
