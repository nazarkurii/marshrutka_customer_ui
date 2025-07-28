<template>
  <div
    @click="app.setCurrency(currency)"
    v-for="(currency, i) in currencies"
    :key="i"
    class="flex gap-[10px] items-center px-[10px]"
  >
    <p
      :class="{
        'font-bold': app.currency.name == currency.name,
      }"
      class="text-gray-300/80 text-lg"
    >
      {{ currency.abbreviation + ' | ' + currency.name }}
    </p>
    <img
      v-if="app.currency.name == currency.name"
      class="h-[17px] ml-auto"
      src="/tick.svg"
      alt="active"
    />
  </div>
</template>

<script setup lang="ts">
import { currencies } from '@/scripts/currencies'

import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const app = useAppStore()
const localization = useI18n()
</script>

<style scoped></style>
