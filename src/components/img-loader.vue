<script setup lang="ts">
defineProps<{ src: string; alt?: string }>()
</script>

<template>
  <div class="img-loader">
    <img :src="src" :alt="alt">
  </div>
</template>

<style scoped>
.img-loader {
  padding: 10px;
  background: #fff;
}
</style>
