<template>
  <div
    @click="app.setLanguage(language, localization.locale)"
    v-for="(language, i) in languages"
    :key="i"
    class="flex gap-[10px] items-center px-[10px]"
  >
    <img class="size-[40px] rounded-lg" :src="language.imagePath" alt="language-flag" />
    <p
      :class="{
        'font-bold': app.language.name == language.name,
      }"
      class="text-gray-300/80 text-lg"
    >
      {{ language.name }}
    </p>
    <img
      v-if="app.language.name == language.name"
      class="h-[17px] ml-auto"
      src="/tick.svg"
      alt="active"
    />
  </div>
</template>

<script setup lang="ts">
import { languages } from '@/scripts/languages'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const app = useAppStore()
const localization = useI18n()
</script>

<style scoped></style>
