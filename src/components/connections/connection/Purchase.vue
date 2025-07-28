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
          {{ ticket.price }} €
        </p>
      </div>
      <p class="flex w-full bg-white/20 h-[1px]"></p>
      <div
        :class="{
          'text-xl': resolution.width > 380,
          'text-m': resolution.width <= 380,
          ' absolute': passenger.number == 0,
        }"
        class="flex justify-between w-full items-center"
        v-for="passenger in passengers"
      >
        <div class="flex gap-[5px]" v-if="passenger.number > 0">
          <p class="text-white/70">{{ `${passenger.name} x ${passenger.number}` }}</p>
        </div>

        <p class="text-white/70" v-if="passenger.number > 0">
          {{ ((ticket.connection.price * passenger.number) / 100).toFixed(2) }} €
        </p>
      </div>
      <p class="flex w-full bg-white/20 h-[1px]"></p>
      <div
        :class="{
          'text-xl': resolution.width > 380,
          'text-m': resolution.width <= 380,
        }"
        class="flex justify-between w-full items-center"
        v-for="luggageUnit in luggage"
      >
        <div class="flex gap-[5px]">
          <p class="text-white/70">{{ `${luggageUnit.name} x ${luggageUnit.number}` }}</p>
        </div>

        <p class="text-white/70">{{ luggageUnit.price }} €</p>
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
        <input type="checkbox" v-model="ticket.policyAccepted" class="size-[30px]" />
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
        (!ticket.requesting && ticket.allValid ? ticket.purchase() : false,
        (ticket.firstTry = false))
      "
      :class="{
        'bg-zinc-700': (!ticket.allValid || ticket.requesting) && !ticket.firstTry,
        'bg-orange-600 hover:bg-orange-700 cursor-pointer active:scale-90':
          (ticket.allValid || ticket.firstTry) && !ticket.requesting,
        'mx-auto': resolution.width < 1420,
        'ml-auto': resolution.width >= 1420,
      }"
      class="flex w-full max-w-[500px] transition duration-200 mb-[20px] justify-center items-center rounded-2xl h-[80px] text-3xl text-white font-bold"
    >
      <p v-if="!ticket.requesting">
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

const ticket = useTicketStore()
const { t } = useI18n()
const router = useRouter()
const app = useAppStore()
const infantsNote = computed(() => {
  ticket
})
const resolution = useResolutionStore()

function defineName(type: 'Adult' | 'Teenager' | 'Child'): string {
  if (type == 'Adult') {
    return t('connection.adult')
  } else if (type == 'Teenager') {
    return t('connection.teenager')
  } else if (type == 'Child') {
    return t('connection.cild')
  } else {
    return ''
  }
}

const luggage = computed(() => {
  return [
    {
      name: t('connection.backpack'),
      number: ticket.backPacks,
      price: (
        (ticket.connection.backpackPrice *
          (ticket.backPacks <= ticket.passengers.length
            ? 0
            : ticket.backPacks - ticket.passengers.length)) /
        100
      ).toFixed(2),
    },
    {
      name: t('connection.smallLuggage'),
      number: ticket.smallLuggage,
      price: ((ticket.connection.smallLuggagePrice * ticket.smallLuggage) / 100).toFixed(2),
    },
    {
      name: t('connection.largeLuggage'),
      number: ticket.largeLuggage,
      price: (
        (ticket.connection.largeLuggagePrice *
          (ticket.largeLuggage <= ticket.passengers.length
            ? 0
            : ticket.largeLuggage - ticket.passengers.length)) /
        100
      ).toFixed(2),
    },
  ]
})

const route = useRoute()
const passengers = computed(() => {
  const result: Array<{
    name: string
    number: number
  }> = [
    {
      name: t('connection.adult'),
      number: 0,
    },
    {
      name: t('connection.teenager'),
      number: 0,
    },
    {
      name: t('connection.child'),
      number: 0,
    },
  ]

  ticket.passengers.map((passenger) => {
    if (passenger.type == 'Adult') {
      result[0].number++
    } else if (passenger.type == 'Teenager') {
      result[1].number++
    } else if (passenger.type == 'Child') {
      result[2].number++
    }
  })
  return result
})
</script>

<style scoped></style>
