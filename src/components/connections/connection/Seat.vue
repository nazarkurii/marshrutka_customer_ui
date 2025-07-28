<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :class="{
      'bg-white/10 cursor-pointer hover:shadow-2xl': !hovered && !selected && !taken,
      'bg-orange-500 cursor-pointer shadow-2xl': hovered && !taken && !selected,
      'bg-green-500 cursor-pointer shadow-2xl': selected && !taken,
      'bg-blue-400': taken,
      'rotate-180': direction == SeatDirection.Backward,
    }"
    class="flex size-full max-w-[126.667px] aspect-square max-h-[126.667px] transition-all duration-200 flex-col rounded-b-2xl rounded-t-[50px]"
  >
    <div class="flex size-full h-[67%]">
      <p class="rounded-t-full h-[120%] w-[15px] bg-zinc-400"></p>
      <div
        :class="{
          ' text-3xl': !taken,
          'text-2xl': taken,
          'rotate-180': direction == SeatDirection.Backward,
        }"
        class="flex text-white font-bold justify-center items-center size-full"
      >
        {{ taken ? '' : number }}
      </div>
      <p class="rounded-t-full h-[120%] w-[15px] bg-zinc-400"></p>
    </div>
    <div
      :class="{
        'bg-zinc-600': !hovered && !selected && !taken,
        'bg-orange-700': hovered && !taken && !selected,
        'bg-green-700': selected && !taken,
        'bg-blue-500': taken,
      }"
      class="flex w-full h-[33%] transition-all duration-200 mt-auto rounded-2xl"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { SeatDirection } from '@/scripts/connections'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  number: number
  selected: boolean
  taken: boolean
  direction: SeatDirection
}>()

const hovered = ref(false)
const { t } = useI18n()
</script>

<style scoped></style>
