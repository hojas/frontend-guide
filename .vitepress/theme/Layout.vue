<script lang="ts" setup>
import { watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'

const { isDark } = useData()
const { Layout } = DefaultTheme

const route = useRoute()
watch(route, route => {
  const iframe = document.querySelector<HTMLIFrameElement>(
    '.giscus-comments iframe'
  )
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { term: route.path } } },
    'https://giscus.app'
  )
})
</script>

<template>
  <Layout>
    <template #doc-after>
      <div class="giscus-comments">
        <Giscus
          repo="hojas/fe-stack-comments"
          repo-id="R_kgDOIyG1Cg"
          category="Announcements"
          category-id="DIC_kwDOIyG1Cs4CTnUQ"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          :theme="isDark ? 'transparent_dark' : 'light'"
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.comments {
  margin-top: 2rem;
}
</style>
