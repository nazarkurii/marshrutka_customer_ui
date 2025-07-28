<template>
  <div class="flex m-auto flex-col items-center gap-[10px] text-zinc-400 text-xl">
    <img src="/crying-face.webp" alt="sad-face" class="size-[100px] rounded-full" />
    <p>{{ t('error') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped></style>
