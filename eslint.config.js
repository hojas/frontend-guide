import antfu from '@antfu/eslint-config'

export default antfu({
  markdown: true,
  typescript: true,
  formatters: {
    html: true,
    css: true,
  },
})
