<script setup lang="ts">
type Mode = 'dark' | 'light'

withDefaults(
  defineProps<{ src: string, mode: Mode, alt?: string }>(),
  {
    mode: 'dark',
  },
)
</script>

<template>
  <div class="img-loader" :class="mode">
    <img :src="src" :alt="alt">
  </div>
</template>

<style scoped>
.img-loader {
  padding: 10px;
}

.dark {
  background: #000;
}

.light {
  background: #fff;
}
</style>
