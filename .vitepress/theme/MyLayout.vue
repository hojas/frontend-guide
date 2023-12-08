<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'

const { Layout } = DefaultTheme
const originalSetItem = localStorage.setItem

const theme = ref('dark_dimmed')

/**
 * Set theme based on localStorage and system
 */
function setTheme() {
  const mode = localStorage.getItem('vitepress-theme-appearance')

  if (mode === 'light') {
    // light mode
    theme.value = 'light_tritanopia'
  }
  else {
    // auto mode depends on system
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      theme.value = 'dark_dimmed'
    else
      theme.value = 'light_tritanopia'
  }
}

onMounted(() => {
  setTheme()

  // listen to localStorage change
  localStorage.setItem = function () {
    // eslint-disable-next-line prefer-rest-params
    originalSetItem.apply(this, arguments)
    setTheme()
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme)
})

onBeforeUnmount(() => {
  // remove listener
  localStorage.setItem = originalSetItem
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setTheme)
})
</script>

<template>
  <Layout>
    <template #doc-after>
      <div class="comment-container">
        <Giscus
          id="comments"
          repo="hojas/frontend-guide"
          repo-id="R_kgDOHItlnw"
          category="Announcements"
          category-id="DIC_kwDOHItln84CblVj"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="bottom"
          :theme="theme"
          lang="zh-CN"
          crossorigin="anonymous"
          term="Welcome to FrontendGuide"
        />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.comment-container {
  margin-top: 100px;
}
</style>
