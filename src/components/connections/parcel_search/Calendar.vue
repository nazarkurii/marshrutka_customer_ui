<template>
  <div
    :class="{
      'overflow-y-auto': resolution.width < 770,
    }"
    class="flex w-full pb-[30px] my-auto"
  >
    <div class="grid grid-cols-7 gap-[20px] min-w-[400px] h-full w-full flex-col px-[10px]">
      <p
        class="w-full mb-[10px] textSize justify-center flex text-white/40"
        :key="value"
        v-for="value in [1, 2, 3, 4, 5, 6, 7]"
      >
        {{ t('daysShort.' + value) }}
      </p>

      <Date
        v-for="(connection, i) in parcel.response.connections"
        :connection="connection"
        :i="i"
        :key="i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentMonthYear } from '@/scripts/time'

import { useParcelStore } from '@/stores/parcel'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

import { useResolutionStore } from '@/stores/resolutionStore'
import Date from './Date.vue'

const parcel = useParcelStore()
const resolution = useResolutionStore()

const { t } = useI18n()
</script>
