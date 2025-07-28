<template>
  <div class="flex flex-col items-center">
    <div class="flex relative">
      <img src="/luggage.webp" alt="" class="size-[190px] opacity-70" />
      <div
        class="absolute flex w-[30px] border-r-[2px] text-white h-[120px] border-dashed border-white top-[64px] left-[35px]"
      >
        <p class="rotate-90 size-fit text-l my-auto font-bold pt-[15px]">
          {{ '50' + t('cm') }}
        </p>
      </div>
      <div
        class="absolute flex w-[80px] border-t-[2px] rotate-[-3deg] text-white h-fit bottom-[-18px] left-[66px] border-dashed border-white"
      >
        <p class="size-fit text-l font-bold mx-auto pl-[10px]">
          {{ '40' + t('cm') }}
        </p>
      </div>
      <div
        class="absolute flex w-[30px] rotate-[30deg] border-t-[2px] text-white h-fit bottom-[-11px] left-[31px] border-dashed border-white"
      >
        <p class="size-fit text-l font-bold mx-auto">
          {{ '30' + t('cm') }}
        </p>
      </div>
    </div>
    <IncresesInput
      class="mt-[40px]"
      :decrease="
        () => {
          if (ticket.smallLuggage > 0) {
            ticket.smallLuggage--
          }
        }
      "
      :increase="
        () => {
          if (ticket.connection.luggageVolumeLeft > (ticket.smallLuggage + 1) * 60000) {
            ticket.smallLuggage++
          }
        }
      "
      :value="ticket.smallLuggage"
    />
    <div
      class="flex gap-[3px] input-bg mt-[10px] w-fit px-[10px] justify-center rounded-lg py-[5px]"
    >
      <p class="text-white text-2xl font-bold">
        + {{ ((ticket.smallLuggage * ticket.connection.smallLuggagePrice) / 100).toFixed(2) }}
      </p>
      <p class="mt-auto mb-[2px] text-green-600 font-bold">€</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IncresesInput from '../../transport_search/IncresesInput.vue'
import { useTicketStore } from '@/stores/ticket'

const { t } = useI18n()
const ticket = useTicketStore()
</script>

<style scoped></style>
