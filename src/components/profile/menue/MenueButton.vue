<template>
  <button
    @click="clickFunc ? clickFunc() : router.push({ name: routeName })"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="{
      'border-zinc-600 bg-zinc-800 cursor-default':
        route.name == routeName && resolution.width > 900,
      'cursor-pointer ': resolution.width > 900 ? route.name != routeName : true,
    }"
    class="flex h-[120px] min-h-[120px] gap-[20px] border-zinc-600 p-[10px] max-w-[350px] w-ful border rounded-2xl items-center"
  >
    <img :src="imagePath" class="size-[50px] mb-[10px]" alt="" />
    <div class="flex w-full flex-col gap-[5px]">
      <p
        :class="{
          'mr-auto': resolution.width > 800,
          'mx-auto': resolution.width <= 800,
        }"
        class="text-white text-xl font-bold"
      >
        {{ name }}
      </p>
      <p v-if="resolution.width > 400" class="text-zinc-600 text-start">{{ description }}</p>
    </div>
    <img
      src="/menue-arrow.svg"
      :class="{
        'translate-x-[5px]': isHovered,
      }"
      class="size-[20px] rotate-180 transition-all duration-200 mr-[10px]"
      alt=""
    />
  </button>
</template>

<script setup lang="ts">
import { useResolutionStore } from '@/stores/resolutionStore'
import { ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

defineProps<{
  name: string
  routeName: string
  description?: string
  imagePath: string
  clickFunc?: () => void
}>()

const isHovered = ref(false)
const router = useRouter()
const route = useRoute()
const resolution = useResolutionStore()
</script>

<style scoped></style>
