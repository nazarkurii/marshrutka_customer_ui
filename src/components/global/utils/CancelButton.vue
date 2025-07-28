<template>
  <button
    type="button"
    @click="func"
    :style="{
      width: '100%',
    }"
    class="flex hover:bg-zinc-500/20 px-[10px] ml-auto z-10 text-zinc-400 justify-center hover:text-white items-center h-[50px] py-[10px] rounded-xl cursor-pointer transition-all transition-[width] duration-200 border border-zinc-700"
  >
    {{ t('cancel') }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  func: () => void
}>()
</script>

<style scoped></style>
