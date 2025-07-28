<template>
  <button
    @click="onClick"
    class="flex flex-col h-[60px] justify-center items-center w-[140px] rounded-xl cursor-pointer"
  >
    <p class="text-gray-300/80 font-bold text-xl">{{ name }}</p>
    <p class="text-gray-500">{{ value }}</p>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  value: string
  onClick: () => void
}>()
</script>

<style scoped></style>
