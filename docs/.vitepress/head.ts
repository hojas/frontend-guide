import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
  [
    'meta',
    {
      name: 'keywords',
      content: 'frontend,前端开发,前端博客,vue,react,webpack,Node.js开发',
    },
  ],
  [
    'script',
    { id: 'LA_COLLECT', src: 'https://sdk.51.la/js-sdk-pro.min.js' },
  ],
  [
    'script',
    {},
    'LA.init({id:"KHEitCBwNlzuiGqc",ck:"KHEitCBwNlzuiGqc",autoTrack:true,hashMode:true,screenRecord:true})',
  ],
]
