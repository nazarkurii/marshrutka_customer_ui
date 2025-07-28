<template>
  <div
    @click="((active = !active), console.log(active))"
    :class="{
      'bg-white/10': active,
    }"
    class="flex gap-[10px] z-30 relative hover:bg-white/10 rounded-xl p-[10px] transition-all duration-200 select-none cursor-pointer"
  >
    <img src="/language-currency.svg" alt="language&currency" class="size-[25px]" />
    <p v-if="resolution.width > 460" class="text-white font-bold">
      {{ app.currency.abbreviation + ' · ' + app.language.abbreviation }}
    </p>
    <LanguageCurrencyMenue
      @close="
        () => {
          active = false
        }
      "
      :currency="currency"
      :active="active"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref } from 'vue'

import { useResolutionStore } from '@/stores/resolutionStore'
import LanguageCurrencyMenue from './LanguageCurrencyMenue.vue'

const app = useAppStore()
const active = ref(false)
const resolution = useResolutionStore()

withDefaults(
  defineProps<{
    currency?: boolean
  }>(),
  {
    currency: true,
  },
)
</script>

<style scoped></style>
