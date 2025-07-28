<template>
  <div class="flex flex-col items-center">
    <div class="flex relative w-[240px]">
      <img src="/luggage.webp" alt="" class="h-[240px] w-[240px] opacity-70" />
      <div
        class="absolute flex w-[30px] border-r-[2px] text-white h-[155px] border-dashed border-white top-[80px] left-[55px]"
      >
        <p class="rotate-90 size-fit text-l my-auto font-bold pt-[15px]">
          {{ '100' + t('cm') }}
        </p>
      </div>
      <div
        class="absolute flex w-[100px] border-t-[2px] rotate-[-4deg] text-white h-fit bottom-[-15px] left-[84px] border-dashed border-white"
      >
        <p class="size-fit text-l font-bold mx-auto pl-[10px]">
          {{ '50' + t('cm') }}
        </p>
      </div>
      <div
        class="absolute flex w-[30px] rotate-[30deg] border-t-[2px] text-white h-fit bottom-[-9px] left-[50px] border-dashed border-white"
      >
        <p class="size-fit text-l font-bold mx-auto">
          {{ '40' + t('cm') }}
        </p>
      </div>
    </div>
    <IncresesInput
      class="mt-[40px]"
      :decrease="
        () => {
          if (ticket.largeLuggage > 0) {
            ticket.largeLuggage--
          }
        }
      "
      :increase="
        () => {
          if (ticket.connection.luggageVolumeLeft > (ticket.largeLuggage + 1) * 200000) {
            ticket.largeLuggage++
          }
        }
      "
      :value="ticket.largeLuggage"
    />
    <div
      class="flex gap-[3px] input-bg mt-[10px] w-fit px-[10px] justify-center rounded-lg py-[5px]"
    >
      <p class="text-white text-2xl font-bold">
        +
        {{
          (
            ((ticket.largeLuggage <= ticket.passengers.length
              ? 0
              : ticket.largeLuggage - ticket.passengers.length) *
              ticket.connection.largeLuggagePrice) /
            100
          ).toFixed(2)
        }}
      </p>
      <p class="mt-auto mb-[2px] text-green-600 font-bold">€</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IncresesInput from '../../transport_search/IncresesInput.vue'
import { useTicketStore } from '@/stores/ticket'

const { t } = useI18n()
const ticket = useTicketStore()
</script>

<style scoped></style>
