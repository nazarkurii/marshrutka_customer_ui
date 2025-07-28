<template>
  <transition name="searchbar" appear>
    <div v-if="!leave" class="grid gap-[4px] px-[10px] w-full max-w-[1200px]">
      <FromCountryInput
        :position-disabled="true"
        :exclude="request.to"
        :preload="request.from"
        @model="
          (value: string) => {
            request.from = value
          }
        "
      />
      <ToCountryInput
        :position-disabled="true"
        :from="request.from"
        :preload="request.to"
        @model="
          (value: string) => {
            request.to = value
          }
        "
      />

      <button
        :class="{
          'bg-amber-600 hover:bg-amber-700 cursor-pointer':
            !parcel.validation.height &&
            !parcel.validation.weight &&
            !parcel.validation.width &&
            !parcel.validation.length,
          'bg-gray-600':
            parcel.validation.height ||
            parcel.validation.weight ||
            parcel.validation.width ||
            parcel.validation.length,
        }"
        @click="search"
        class="search h-[60px] transition-all duration-200 text-white text-2xl font-bold rounded-r-2xl"
      >
        {{ t('search') }}
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { computed, onBeforeMount, reactive, ref, watchEffect } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import ToCountryInput from '../transport_search/ToCountryInput.vue'
import FromCountryInput from '../transport_search/FromCountryInput.vue'
import { useParcelStore } from '@/stores/parcel'

const { t } = useI18n()

const request = reactive({
  from: 'Ukraine',
  to: 'Poland',
})
const leave = ref(false)
onBeforeRouteLeave((to, from, next) => {
  if (String(to.name) != 'package') {
    leave.value = true
  }
  next()
})

const parcel = useParcelStore()
const router = useRouter()
function search() {
  if (
    !parcel.validation.height &&
    !parcel.validation.weight &&
    !parcel.validation.width &&
    !parcel.validation.length
  ) {
    router.push({
      name: 'parcelDate',
      params: {
        type: parcel.type,
        from: request.from,
        to: request.to,
        width: parcel.width,
        height: parcel.height,
        length: parcel.length,
        weight: parcel.weight,
      },
    })
  }
}
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 770px) {
  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .search {
    border-radius: var(--radius-2xl) var(--radius-2xl) var(--radius-2xl) var(--radius-2xl);
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
