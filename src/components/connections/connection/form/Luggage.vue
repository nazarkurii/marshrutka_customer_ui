<template>
  <FormStep :step="2" :name="t('connection.luggage')">
    <div class="flex w-full flex-col">
      <div class="grid grid-cols-2 luggage justify-center gap-[30px] min-h-[240px] w-full">
        <Backpack class="mt-auto w-full" />
        <LuggageBag class="mt-auto w-full" />
        <LuggageBagBig class="mt-auto w-full grid2 col-span-3" />
      </div>
    </div>
  </FormStep>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FormStep from './utils/FormStep.vue'
import Backpack from './Backpack.vue'
import LuggageBag from './LuggageBag.vue'
import LuggageBagBig from './LuggageBagBig.vue'
import { useTicketStore } from '@/stores/ticket'
const { t } = useI18n()
</script>

<style scoped>
.luggage {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid2 {
  grid-column: span 1 / span 1;
}

@media (min-width: 470px) {
  .luggage {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid2 {
    grid-column: span 2 / span 2;
  }
}

@media (min-width: 750px) {
  .luggage {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .grid2 {
    grid-column: span 1 / span 1;
  }
}
</style>
