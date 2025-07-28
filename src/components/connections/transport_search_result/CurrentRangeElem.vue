<template>
  <button
    class="flex flex-col items-center justify-center h-[70px] top-[-5px] z-[10] bg-zinc-600 border-b-[3px] scale-105 shadow-2xl shadow-black/70 border-b-purple-700 w-[190px] cursor-pointer select-none rounded-xl transition-all duration-200"
  >
    <p class="text-green-500 font-bold text-lg">
      {{ value.minPrice ? value.minPrice / 100 + ' €' : '' }}
    </p>
    <div class="flex gap-[5px] justify-center items-center">
      <p class="text-orange-500 text-lg">{{ '( ' + value.number + ' )' }}</p>
      <p class="text-white">
        {{ formatDateWithDay(value.date.slice(0, 10)) }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { ConnectionsRange } from '@/scripts/connections'
import { formatDateWithDay } from '@/scripts/time'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  value: ConnectionsRange
}>()
</script>

<style scoped></style>
