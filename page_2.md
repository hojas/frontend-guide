---
page: true
title: page_2
aside: false
---
<script setup>
import { useData } from "vitepress";
import Page from "./.vitepress/theme/components/Page.vue";

const { theme } = useData();
const posts = theme.value.posts.slice(15, 30)
</script>

<Page :posts="posts" :pageCurrent="2" :pagesNum="2" />