<template>
  <div class="flex items-center cursor-default gap-[20px]">
    <img src="/logo-blue.svg" alt="marshrutka" class="flex size-[80px] rounded-2xl" />
    <div class="flex flex-col gap-[5px]">
      <p class="text-white font-bold text-2xl font-stretch-50%">Marshrutka</p>
      <p class="text-gray-300">{{ t('footer.logoMessage') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
</script>

<style scoped></style>
