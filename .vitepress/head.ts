import { HeadConfig } from 'vitepress'

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
    {},
    `
        var _hmt = _hmt || []
        ;(function() {
          var hm = document.createElement("script")
          hm.src = "https://hm.baidu.com/hm.js?${process.env.BAIDU_HM_CODE}"
          var s = document.getElementsByTagName("script")[0]
          s.parentNode.insertBefore(hm, s)
        })()
      `,
  ],
]
