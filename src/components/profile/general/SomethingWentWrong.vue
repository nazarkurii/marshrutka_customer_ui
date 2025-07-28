<template>
  <img src="/crying-face.webp" class="size-[150px] mx-auto" alt="" />
  <p class="text-white text-xl text-center">
    {{ t('profile.general.contactInfo.info.edit.error') }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped></style>
