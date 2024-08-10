---
page: true
title: 首页
aside: false
---
<script setup>
import { useData } from "vitepress";
import Page from "./.vitepress/theme/components/Page.vue";

const { theme } = useData();
const posts = theme.value.posts.slice(0, 15)
</script>

<Page :posts="posts" :pageCurrent="1" :pagesNum="2" />