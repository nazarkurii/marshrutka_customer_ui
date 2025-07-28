<template>
  <button
    @click="router.back()"
    class="text-white/30 mr-auto ml-[10px] cursor-pointer border-white/30 border-[1px] w-[100px] rounded-lg p-[5px] hover:text-white transition-all duration-200 hover:translate-x-[-10px]"
  >
    {{ t('back') }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
</script>

<style scoped></style>
