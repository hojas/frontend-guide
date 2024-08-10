<script lang="ts" setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useYearSort } from '../functions'

const { theme } = useData()
const data = computed(() => useYearSort(theme.value.posts))
</script>

<template>
  <div v-for="(yearList, i) in data" :key="i">
    <div class="year">
      {{ yearList[0].frontMatter.date.split('-')[0] }}
    </div>
    <a v-for="(article, index) in yearList" :key="index" :href="withBase(article.regularPath)" class="posts">
      <div class="post-container">
        <div class="post-dot" />
        {{ article.frontMatter.title }}
      </div>
      <div class="date">{{ article.frontMatter.date.slice(5) }}</div>
    </a>
  </div>
</template>

<style scoped>
.year {
    padding: 14px 0 8px 0;
    font-size: 1.25rem;
    font-weight: 500;
    font-family: var(--date-font-family),serif;
}
</style>
