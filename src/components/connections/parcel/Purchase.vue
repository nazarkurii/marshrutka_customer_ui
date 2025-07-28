<template>
  <div class="flex flex-col gap-[20px]">
    <div
      :class="{
        'w-[calc(100vw-20px)]': resolution.width <= 380,
        'mx-auto': resolution.width < 1420,
        'ml-auto': resolution.width >= 1420,
      }"
      class="rounded-2xl gap-[10px] max-w-[500px] flex flex-col p-[20px] bg-zinc-800"
    >
      <div
        :class="{
          'text-2xl': resolution.width > 380,
          'text-m': resolution.width <= 380,
        }"
        class="flex justify-between w-full items-center"
      >
        <div class="flex gap-[5px]">
          <p class="text-white font-bold">{{ t('connection.total') }}</p>
          <p class="text-white">{{ t('connection.vat') }}</p>
        </div>
        <p
          :class="{
            'text-3xl': resolution.width > 380,
            'text-xl': resolution.width <= 380,
          }"
          class="text-orange-500 font-bold"
        >
          {{ (parcel.price / 100).toFixed(2) }}
          €
        </p>
      </div>
      <p class="flex w-full bg-white/20 h-[1px]"></p>

      <div
        :class="{
          'text-xl': resolution.width > 380,
          'text-m': resolution.width <= 380,
        }"
        class="flex justify-between w-full items-center"
      >
        <div class="flex gap-[5px]">
          <p class="text-white/70">{{ `${t('package.name')} x 1` }}</p>
        </div>

        <p class="text-white/70">
          {{ (parcel.connection.minimalParcelPrice / 100).toFixed(2) }}
          €
        </p>
      </div>
      <p class="flex w-full bg-white/20 h-[1px]"></p>
      <div
        :class="{
          'text-xl': resolution.width > 380,
          'text-m': resolution.width <= 380,
        }"
        class="flex justify-between w-full items-center"
      >
        <div class="flex gap-[5px]">
          <p class="text-white/70">
            {{
              `${t('package.additionalVolume')} x ${
                (parcel.width - 20) * (parcel.length - 20) * (parcel.height - 20)
              }` + 'cm³'
            }}
          </p>
        </div>

        <p class="text-white/70">
          {{
            (
              ((parcel.width - 20) *
                (parcel.length - 20) *
                (parcel.height - 20) *
                (parcel.connection.parcelPricePerTenCm / 10)) /
              100
            ).toFixed(2)
          }}
          €
        </p>
      </div>
      <p class="flex w-full bg-white/20 h-[1px]"></p>

      <div
        :class="{
          'text-xl': resolution.width > 380,
          'text-m': resolution.width <= 380,
        }"
        class="flex justify-between w-full items-center"
      >
        <div class="flex gap-[5px]">
          <p class="text-white/70">{{ t('connection.serviceFee') }}</p>
        </div>
        <p class="text-white/70">00.00 €</p>
      </div>

      <div class="flex gap-[20px] w-full items-center">
        <input type="checkbox" v-model="parcel.policyAccepted" class="size-[30px]" />
        <div
          :class="{
            'text-lg': resolution.width > 380,
            'text-[15px]': resolution.width <= 380,
          }"
          class="gap-[5px]"
        >
          <span class="text-white">{{ t('connection.agreement1') }}</span>
          <a
            :href="app.legalPolicyHref()"
            target="_blank"
            class="ml-[5px] text-blue-500 hover:text-blue-600"
            >{{ t('connection.privatPolicy') }}</a
          >
          <span class="ml-[5px] text-white">{{ t('connection.agreement2') }}</span>
          <a
            :href="app.legalPolicyHref()"
            target="_blank"
            class="ml-[5px] text-blue-500 hover:text-blue-600"
            >{{ t('connection.booking') }}</a
          >
        </div>
      </div>
    </div>
    <button
      @click="
        (!parcel.reqesting && parcel.purchaseValidation ? parcel.purchase() : false,
        (parcel.firstTry = false))
      "
      :class="{
        'bg-zinc-700': parcel.reqesting || (!parcel.purchaseValidation && !parcel.firstTry),
        'bg-green-600 hover:bg-green-700 cursor-pointer active:scale-90':
          !parcel.reqesting && (parcel.purchaseValidation || parcel.firstTry),
        'mx-auto': resolution.width < 1420,
        'ml-auto': resolution.width >= 1420,
      }"
      class="flex w-full max-w-[500px] transition duration-200 mb-[20px] justify-center items-center rounded-2xl h-[80px] text-3xl text-white font-bold"
    >
      <p v-if="!parcel.reqesting">
        {{ t('connection.purchase') }}
      </p>
      <Loader v-else :size="50" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTicketStore } from '@/stores/ticket'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Passengers from '../transport_search/Passengers.vue'
import Loader from '@/components/utils/Loader.vue'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useAppStore } from '@/stores/app'
import { useParcelStore } from '@/stores/parcel'

const { t } = useI18n()
const parcel = useParcelStore()
const app = useAppStore()

const resolution = useResolutionStore()
</script>

<style scoped></style>
