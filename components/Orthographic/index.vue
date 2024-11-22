<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import define from './main'
import { Inspector, Runtime } from './runtime'
import './style.css'

const el = ref()

function init() {
  el.value.innerHTML = ''
  const runtime = new Runtime()
  runtime.module(define, Inspector.into(el.value))
}

onMounted(() => {
  init()
  window.addEventListener('resize', init)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', init)
})
</script>

<template>
  <div ref="el" class="boll-chart" />
</template>

<style>
.boll-chart span {
  display: none;
}
</style>
