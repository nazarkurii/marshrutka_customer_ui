<template>
  <div
    id="appContainer"
    :class="{
      'overflow-y-hidden': resolution.fixed,
      'overflow-y-auto': !resolution.fixed,
      'pb-[30px]': resolution.width < 900,
      ' h-fit min-h-[100vh]': route.name == 'parcelOrder' || route.name == 'connection',
      ' h-[100vh]': route.name != 'parcelOrder' && route.name != 'connection',
    }"
    class="flex flex-col gap-[20px] z-[10] bg-neutral-900 items-center"
  >
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from './stores/app'
import { useResolutionStore } from './stores/resolutionStore'
import { onBeforeMount, ref } from 'vue'
import { startApp } from './scripts/app'

const resolution = useResolutionStore()
const route = useRoute()
const scroll = ref(false)
</script>

<style scoped></style>
