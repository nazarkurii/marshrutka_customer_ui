<template>
  <div
    class="flex transition-all duration-200 flex-col bg-zinc-800 w-full max-w-[980px] rounded-2xl h-fit justify-center gap-[20px] mt-[10px]"
  >
    <div class="flex z-10 w-full title justify-between bg-zinc-800 rounded-2xl px-[15px] pt-[15px]">
      <div class="flex gap-[10px]">
        <p
          class="flex size-[40px] rounded-lg bg-blue-600 justify-center items-center text-xl text-white font-bold"
        >
          {{ step }}
        </p>
        <p class="text-gray-50/70 textSize font-bold my-auto">{{ name }}</p>
      </div>
      <button
        v-if="button"
        @click="buttonAction"
        class="flex text-white/50 border-white/50 h-[45px] text-lg border-[1px] rounded-lg w-[150px] justify-center items-center cursor-pointer transition-all duration-200 hover:text-white hover:border-white"
      >
        {{ t('edit') }}
      </button>
    </div>
    <div
      class="flex gap-[20px] transition-all relative duration-200 px-[15px] pb-[10px] w-full mx-auto mb-[10px]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResponseSeat } from '@/scripts/connections'
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    step: number
    name: string
    button?: boolean
    buttonAction?: () => void
  }>(),
  {
    button: false,
    buttonAction: () => {},
  },
)

const { t } = useI18n()
</script>

<style scoped>
.textSize {
  font-size: clamp(15px, 4vw, 23px);
}
</style>
