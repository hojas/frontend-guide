<script setup>
import DefaultTheme from 'vitepress/theme'
import { withBase } from 'vitepress'
import Copyright from './Copyright.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <div v-if="!$frontmatter.page" style="padding-top:20px;" class="post-info">
        {{ $frontmatter.date?.substring(0, 10) }} &nbsp;&nbsp;
        <span v-for="(item, i) in $frontmatter.tags" :key="i">
          <a :href="withBase(`/pages/tags.html?tag=${item}`)">{{ item }}</a>
        </span>
      </div>
    </template>
  </Layout>
  <Copyright />
</template>
