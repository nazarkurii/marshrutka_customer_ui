<template>
  <button
    @click="router.back()"
    class="cursor-pointer"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img v-if="isHovered" class="h-[31px]" src="/arrow-back-orange.svg" alt="" />
    <img v-else class="h-[31px]" src="/arrow-back-white.svg" alt="" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isHovered = ref(false)
const router = useRouter()
</script>

<style scoped></style>
