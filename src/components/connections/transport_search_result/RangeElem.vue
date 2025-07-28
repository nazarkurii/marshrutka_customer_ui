<template>
  <div
    v-if="!current"
    @click="
      () => {
        if (value.available) {
          request.time = value.date.slice(0, 10)
          request.search()
        }
      }
    "
    :class="{
      'cursor-default ': !value.available,
      'cursor-pointer': value.available,
    }"
    class="flex flex-col items-center bg-white/8 hover:bg-white/15 justify-center h-[70px] min-w-[200px] select-none rounded-xl transition-all duration-200"
  >
    <p
      :class="{
        'text-red-600/80 ': !value.available,
        'text-green-600 ': value.available,
      }"
      class="font-bold text-lg"
    >
      {{ value.minPrice ? value.minPrice / 100 + ' €' : '' }}
    </p>
    <div class="flex gap-[5px] justify-center items-center">
      <p class="text-orange-500 text-lg">{{ '( ' + value.number + ' )' }}</p>
      <p class="text-white">
        {{ formatDateWithDay(value.date.slice(0, 10)) }}
      </p>
    </div>
  </div>

  <button
    v-else
    class="flex flex-col items-center justify-center h-[70px] min-w-[200px] top-[-5px] z-[10] bg-zinc-600 border-b-[3px] scale-105 shadow-2xl shadow-black/70 border-b-purple-700 w-[190px] select-none rounded-xl transition-all duration-200"
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
import { useConnectionRequestStore } from '@/stores/search'

defineProps<{
  value: ConnectionsRange
  current: boolean
}>()

const request = useConnectionRequestStore()
</script>

<style scoped></style>
