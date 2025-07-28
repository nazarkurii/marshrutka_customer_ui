<template>
  <div class="grid gap-[4px] px-[10px] w-full max-w-[1200px]">
    <FromCountryInput
      :exclude="request.to"
      :preload="request.from"
      @model="
        (value: string) => {
          request.from = value
        }
      "
    />
    <ToCountryInput
      :from="request.from"
      :preload="request.to"
      @model="
        (value: string) => {
          request.to = value
        }
      "
    />
    <DepartureTimeInput />
    <Passengers />
    <button
      :class="{
        'bg-amber-600 hover:bg-amber-700 cursor-pointer':
          request.passengers.adults > 0 || request.passengers.teenagers > 0,
        'bg-gray-600': request.passengers.adults < 1 && request.passengers.teenagers < 1,
      }"
      @click="
        request.passengers.adults > 0 || request.passengers.teenagers > 0 ? request.search() : ''
      "
      class="search h-[60px] transition-all duration-200 text-white text-2xl font-bold rounded-r-2xl"
    >
      {{ t('search') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FromCountryInput from './FromCountryInput.vue'
import ToCountryInput from './ToCountryInput.vue'
import DepartureTimeInput from './DepartureTimeInput.vue'
import Passengers from './Passengers.vue'
import { useConnectionRequestStore } from '@/stores/search'
import { Problem } from '@/scripts/errors'
import axios from 'axios'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()

const request = useConnectionRequestStore()
const route = useRoute()
onBeforeMount(() => {
  if (route.params.from) {
    request.from = route.params.from as string
  }
  if (route.params.to) {
    request.to = route.params.to as string
  }
})
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

@media (max-width: 1050px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .search {
    grid-column: span 2 / span 2;
    border-radius: var(--radius-2xl);
  }
}

@media (max-width: 770px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.searchbar-leave-active,
.searchbar-enter-active {
  transition: transform 0.25s ease;
}

.searchbar-leave-to,
.searchbar-enter-from {
  transform: scaleY(0);
}
</style>
