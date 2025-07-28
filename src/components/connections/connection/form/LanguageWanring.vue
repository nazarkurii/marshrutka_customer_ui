<template>
  <div class="flex gap-[10px] items-end mt-auto ml-[10px] h-fit">
    <p class="text-gray-400 text-xl">{{ t('connection.languageWarning') }}</p>
    <p class="text-amber-600 text-xl">{{ app.language.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const app = useAppStore()
const { t } = useI18n()
</script>

<style scoped></style>
