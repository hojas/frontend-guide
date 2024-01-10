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
      text: 'Vue',
      items: [
        { text: '响应式原理', link: '/vue/reactivity' },
        { text: 'Diff 算法', link: '/vue/diff' },
        { text: 'computed 实现原理', link: '/vue/computed' },
        { text: 'watch 实现原理', link: '/vue/watch' },
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
  '/source-code': [
    {
      text: '手搓代码',
      items: [
        { text: '防抖', link: '/source-code/debounce' },
        { text: '节流', link: '/source-code/throttle' },
        { text: '深拷贝', link: '/source-code/deep-copy' },
        { text: '音频可视化的实现', link: '/source-code/voice-visualization' },
      ],
    },
  ],
}
