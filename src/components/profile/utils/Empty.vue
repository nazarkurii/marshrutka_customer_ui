<template>
  <div class="flex flex-col gap-[10px] m-auto items-center">
    <img src="/smile.webp" alt="smile" class="size-[100px] rounded-full" />
    <p class="text-zinc-500 text-xl">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<style scoped></style>
