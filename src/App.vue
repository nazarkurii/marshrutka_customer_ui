<template>
  <div class="bg-neutral-900">
    <div
      id="appContainer"
      :class="{
        'overflow-y-hidden': resolution.fixed,
        'overflow-y-auto': !resolution.fixed,
        'pb-[30px]': resolution.width < 900,
        'h-fit min-h-[100vh]': route.name == 'parcelOrder' || route.name == 'connection',
        'h-[100vh]': route.name != 'parcelOrder' && route.name != 'connection',
      }"
      class="flex flex-col gap-[20px] z-[10] bg-neutral-900 items-center"
    >
      <router-view></router-view>
      <Contact />
      <p class="fixed m-auto text-5xl text-white font-bold z-[300] mt-[300px]">CI/CD Test 8.1</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useResolutionStore } from './stores/resolutionStore'

import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import Contact from './components/global/contact/contact.vue'

const resolution = useResolutionStore()
const route = useRoute()
</script>

<style scoped></style>
