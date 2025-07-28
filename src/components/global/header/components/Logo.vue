<template>
  <a
    @click.prevent="
      route.name != 'popularDestinations' ? router.push({ name: 'popularDestinations' }) : false
    "
    :href="href"
    :class="{
      'ml-[60px]': resolution.width <= 1150,
      'ml-[10px]': resolution.width < 1540,
    }"
    class="flex items-center cursor-pointer select-none opacity-90"
  >
    <img src="/logo.svg" alt="marshrutka" class="flex size-[40px]" />
    <p
      v-if="resolution.width > 770"
      class="text-white font-bold text-3xl font-stretch-50% trnasition-all duration-200"
    >
      Marshrutka
    </p>
  </a>
</template>

<script setup lang="ts">
import { useResolutionStore } from '@/stores/resolutionStore'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const resolution = useResolutionStore()
const href = import.meta.env.VITE_APP_UR + '/connections'
</script>

<style scoped></style>
