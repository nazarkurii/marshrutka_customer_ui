<template>
  <div class="flex flex-col gap-[20px] items-center px-[10px] max-w-[800px]">
    <img src="/crying-face.webp" alt="" class="size-[200px] rounded-full" />
    <h1 class="text-3xl font-bold text-white text-center">
      {{ t('connection.unavailableTicket.title') }}
    </h1>
    <p
      v-if="parcel.errors.notEnoughSpaceAlready"
      class="text-2xl font-bold text-gray-400 text-center"
    >
      {{ t('package.alreadyUnavailableEror') }}
    </p>

    <p
      v-else-if="parcel.volume > parcel.connection.luggageVolumeLeft"
      class="text-2xl font-bold text-gray-400 text-center"
    >
      {{ t('package.tooBigError') }}
    </p>

    <div class="max-w-[300px] w-full gap-[10px] flex flex-col">
      <button
        v-if="parcel.retry"
        @click="parcel.retry = false"
        class="flex resolution text-white cursor-pointer bg-blue-600 hover:bg-blue-700 h-[55px] justify-center items-center rounded-xl text-xl font-bold transition-all duration-200"
      >
        {{ t('tryAgain') }}
      </button>
      <ActiveButton
        :active="true"
        :name="t('back')"
        @click="
          router.push({
            name: 'parcelDate',
            params: {
              from: parcel.connection.departureCountry,
              to: parcel.connection.destinationCountry,
              width: parcel.width,
              length: parcel.length,
              height: parcel.height,
              page: '1',
            },
          })
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { formatToDateLocal } from '@/scripts/time'
import { useParcelStore } from '@/stores/parcel'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const parcel = useParcelStore()
const route = useRoute()
</script>

<style scoped></style>
