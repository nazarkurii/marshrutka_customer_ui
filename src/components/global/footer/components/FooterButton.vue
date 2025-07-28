<template>
  <button
    @click="router.push({ name: routeName })"
    class="text-white text-xl hover:text-blue-400 transition-all duration-200 cursor-pointer"
  >
    {{ name }}
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  name: string
  routeName: string
}>()

const router = useRouter()
</script>

<style scoped></style>
