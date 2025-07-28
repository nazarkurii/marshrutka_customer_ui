<template>
  <div class="flex flex-col € items-center">
    <div class="flex relative">
      <img src="/backpack.webp" alt="" class="size-[120px] opacity-70" />
      <div
        class="absolute flex w-[30px] border-r-[2px] text-white h-[95%] border-dashed border-white top-[4px] left-[13px] rotate-[-3deg]"
      >
        <p class="rotate-90 size-fit text-xl my-auto font-bold pt-[15px]">
          {{ '40' + t('cm') }}
        </p>
      </div>
      <div
        class="absolute flex w-[60px] border-t-[2px] text-white h-fit top-[115px] left-[45px] border-dashed border-white"
      >
        <p class="size-fit text-l font-bold ml-auto">
          {{ '30' + t('cm') }}
        </p>
      </div>
      <div
        class="absolute flex w-[30px] rotate-15 border-t-[2px] text-white h-fit top-[110px] left-[12px] border-dashed border-white"
      >
        <p class="size-fit text-l font-bold mx-auto">
          {{ '20' + t('cm') }}
        </p>
      </div>
    </div>
    <IncresesInput
      class="mt-[40px]"
      :decrease="
        () => {
          if (ticket.backPacks > 0) {
            ticket.backPacks--
          }
        }
      "
      :increase="
        () => {
          if (ticket.connection.luggageVolumeLeft > (ticket.backPacks + 1) * 24000) {
            ticket.backPacks++
          }
        }
      "
      :value="ticket.backPacks"
    />
    <div
      class="flex gap-[3px] input-bg mt-[10px] w-fit px-[10px] justify-center rounded-lg py-[5px]"
    >
      <p class="text-white text-2xl font-bold">
        +
        {{
          (
            ((ticket.backPacks <= ticket.passengers.length
              ? 0
              : ticket.backPacks - ticket.passengers.length) *
              ticket.connection.backpackPrice) /
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
import { onBeforeMount, ref } from 'vue'
import { useTicketStore } from '@/stores/ticket'

const { t } = useI18n()

const ticket = useTicketStore()
</script>

<style scoped></style>
