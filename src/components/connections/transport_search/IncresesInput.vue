<template>
  <div class="flex justify-between">
    <div class="flex flex-col">
      <p class="text-white">{{ name }}</p>
      <p class="text-white/50 text-sm">{{ description }}</p>
    </div>
    <div class="flex gap-[10px] h-fit my-auto items-center">
      <button
        @click="decrease"
        class="text-white/70 text-2xl bg-white/10 px-[13px] h-fit font-bold rounded-lg cursor-pointer hover:bg-white/20 hover:text-white pb-[3px] active:scale-90 transition-all duration-200"
      >
        -
      </button>
      <p class="text-white font-bold text-lg">{{ value }}</p>
      <button
        @click="increase"
        class="text-white/70 text-2xl px-[11px] h-fit rounded-lg cursor-pointer bg-blue-600/80 hover:bg-blue-600 hover:text-white pb-[2px] pt-[1px] active:scale-90 transition-all duration-200"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number
  increase: () => void
  decrease: () => void
  name?: string
  description?: string
}>()
</script>

<style scoped></style>
