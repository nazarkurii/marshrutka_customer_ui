<template>
  <div class="flex w-full justify-center h-fit">
    <div
      class="flex ticket cursor-default transition-all hover:translate-y-[-10px] min-h-[260px] shadow-2xl shadow-black order-bg select-none duration-300 relative max-w-[730px] rounded-2xl w-full"
    >
      <p
        :class="{
          'bg-green-500': !expired,
          'bg-red-600': expired,
        }"
        class="text-white font-bold text-lg rounded-2xl size-fit py-[5px] px-[10px] absolute top-[-20px] left-[15px]"
      >
        {{ expired ? t('profile.tickets.expired') : t('connections.result.cheapest') }}
      </p>
      <div
        class="flex flex-col h-full p-[15px] justify-around items-center py-[30px] gap-[10px] buy-part"
      >
        <div class="flex flex-col gap-[10px] items-center">
          <img :src="`data:image/png;base64,${ticket.qrCode}`" alt="" class="rounded-2xl" />
        </div>
      </div>
      <div class="flex w-full relative flex-col p-[15px] description bg">
        <div v-if="resolution.width > 400" class="flex w-full gap-[9px] items-center">
          <img src="/favicon.svg" alt="" class="size-[40px]" />
          <p class="text-white text-lg font-bold">Marshrutka</p>
          <div class="flex ml-auto gap-[5px]">
            <p class="text-white text-lg">{{ t('connections.result.connection') }}:</p>
            <p class="text-orange-500 font-bold text-xl">{{ connection.line }}</p>
          </div>
        </div>
        <div class="flex items-center time h-fit gap-[10px] w-full my-auto pb-[20px]">
          <div class="flex flex-col departure-time">
            <p class="text-white text-2xl">{{ connection.departureTime.slice(11, 16) }}</p>
            <p class="text-white/50">{{ t('countries.' + connection.departureCountry) }}</p>
            <p class="text-white/50">{{ formatDateWithDay(connection.departureTime) }}</p>
          </div>
          <div class="flex flex-col flex-1 mb-[20px] gap-[6px]">
            <div class="flex gap-[10px] mx-auto">
              <p class="text-white/50">{{ t('connections.result.travelTime') }}:</p>
              <p class="text-blue-600">
                {{ connection.estimatedDuration / 60 + ' ' + t('connections.result.hours') }}
              </p>
            </div>
            <div class="flex gap-[1px]">
              <div class="border-[3px] rounded-full border-white/30 flex-1"></div>
              <div class="border-[1px] my-auto h-0 border-white/30 flex-1"></div>
              <div class="border-[3px] rounded-full border-white/30 flex-1"></div>
            </div>
          </div>
          <div class="flex flex-col arrival-time">
            <p class="text-white text-2xl">{{ connection.arrivalTime.slice(11, 16) }}</p>
            <p class="text-white/50">{{ t('countries.' + connection.destinationCountry) }}</p>
            <p class="text-white/50">{{ formatDateWithDay(connection.arrivalTime) }}</p>
          </div>
        </div>
        <div
          v-if="resolution.width >= 750"
          class="flex w-full bg-gradient-to-r max-w-[520px] to-purple-800 h-[30px] absolute bottom-0 right-0 rounded-br-2xl"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SeatType,
  type ConnectionFull,
  type ConnectionSimplified,
  type ResponseSeat,
} from '@/scripts/connections'
import type { Ticket } from '@/scripts/tickets'
import { formatDateWithDay, formatFullDate } from '@/scripts/time'
import { useResolutionStore } from '@/stores/resolutionStore'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  connection: ConnectionSimplified
  ticket: Ticket
  expired?: boolean
}>()

const resolution = useResolutionStore()

const { t } = useI18n()

console.log(props.ticket.qrCode)
</script>

<style scoped>
.ticket {
  flex-direction: column-reverse;
}
.buy-part {
  border-right: 1px;
  width: 100%;
}

.buy-button {
  width: 90%;
}

.description {
  padding-top: 30px;
}
@media (min-width: 750px) {
  .ticket {
    flex-direction: row;
  }
  .buy-button {
    width: 185px;
  }

  .description {
    padding-top: 15px;
  }
  .buy-part {
    width: 230px;
    border-style: var(--tw-border-style);
    border-right-width: 1px;
    border-color: color-mix(in oklab, var(--color-white) /* #fff = #ffffff */ 10%, transparent);
    height: 100%;
  }
}

.time {
  flex-direction: column;
}

.departure-time {
  align-items: center;
}

.arrival-time {
  align-items: center;
}

@media (min-width: 400px) {
  .time {
    flex-direction: row;
  }

  .arrival-time {
    align-items: flex-end;
  }

  .departure-time {
    align-items: flex-start;
  }
}
</style>
