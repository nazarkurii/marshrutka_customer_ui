<template>
  <div
    @click="openBanner"
    class="flex opacity-85 bg- mx-auto xl:mx-0 transition-all duration-200 select-none cursor-pointer hover:opacity-100 gap-[20px] py-[10px] px-[15px] items-center bg-zinc-700 rounded-xl w-fit"
  >
    <div class="flex flex-col mb-[3px]">
      <p class="text-white text-lg font-bold">{{ t('footer.mobileApp.message') }}</p>
      <p class="text-gray-400">{{ t('footer.mobileApp.description') }}</p>
    </div>
    <img class="size-[70px]" src="/phone-blue.svg" alt="mobile-app" />
  </div>
</template>

<script setup lang="ts">
import TransparentBackground from '@/components/utils/TransparentBackground.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps<{
  openBanner: () => void
}>()
</script>

<style scoped></style>
