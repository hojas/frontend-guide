import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
  [
    'meta',
    {
      name: 'keywords',
      content: '前端开发,前端博客,Node.js开发',
    },
  ],
  [
    'script',
    { src: 'https://hm.baidu.com/hm.js?5f54051a64b08ac3d89526db54df136f' },
  ],
  [
    'script',
    {},
    'var _hmt = _hmt || [];'
  ],
  [
    'script',
    { id: 'LA_COLLECT', src: 'https://sdk.51.la/js-sdk-pro.min.js' },
  ],
  [
    'script',
    {},
    'LA.init({id:"KHEitCBwNlzuiGqc",ck:"KHEitCBwNlzuiGqc",autoTrack:true,hashMode:true})',
  ],
]
