<script setup lang="ts">
defineProps<{ src: string; alt?: string }>()
</script>

<template>
  <div>
    <img :src="src" :alt="alt">
  </div>
</template>

<style scoped>
div {
  padding: 10px;
  background: #fff;
}
</style>
