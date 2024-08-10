<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { initTags } from '../functions'

const url = location.href.split('?')[1]
const params = new URLSearchParams(url)
const { theme } = useData()
const data = computed(() => initTags(theme.value.posts))
const selectTag = ref(params.get('tag') ? params.get('tag') : '')
function toggleTag(tag: string) {
  selectTag.value = tag
}
</script>

<template>
  <div class="tags">
    <span v-for="(_, key) in data" :key="key" class="tag" @click="toggleTag(String(key))">
      {{ key }} <strong>{{ data[key].length }}</strong>
    </span>
  </div>
  <div class="tag-header">
    {{ selectTag }}
  </div>
  <a
    v-for="(article, index) in selectTag ? data[selectTag] : []"
    :key="index"
    :href="withBase(article.regularPath)"
    class="posts"
  >
    <div class="post-container">
      <div class="post-dot" />
      {{ article.frontMatter.title }}
    </div>
    <div class="date">{{ article.frontMatter.date }}</div>
  </a>
</template>

<style scoped>
.tags {
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
}

.tag {
    display: inline-block;
    padding: 4px 16px;
    margin: 6px 8px;
    font-size: 0.875rem;
    line-height: 25px;
    background-color: var(--vp-c-bg-alt);
    transition: 0.4s;
    border-radius: 2px;
    color: var(--vp-c-text-1);
    cursor: pointer;
}

.tag strong {
    color: var(--vp-c-brand);
}

.tag-header {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 1rem 0;
    text-align: left;
}

@media screen and (max-width: 768px) {
    .tag-header {
        font-size: 1.5rem;
    }

    .date {
        font-size: 0.75rem;
    }
}
</style>
