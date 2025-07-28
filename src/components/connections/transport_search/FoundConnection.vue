<template>
  <div class="px-[10px] z-20">
    <div
      @click="connection.fits && !isBeforeNow(connection.sellBefore) ? select() : 0"
      class="flex ticket cursor-pointer transition-all hover:translate-y-[-10px] hover:shadow-2xl shadow-black select-none duration-300 relative max-w-[730px] rounded-2xl order-bg w-[calc(100vw-20px)] min-h-[260px]"
    >
      <p
        class="text-white font-bold z-[15] text-lg rounded-2xl bg-green-500 size-fit py-[5px] px-[10px] absolute top-[-20px] left-[15px]"
      >
        {{ t('connections.result.cheapest') }}
      </p>

      <div
        class="flex flex-col min-h-[260px] h-full p-[15px] justify-center items-center gap-[20px] buy-part"
      >
        <div class="flex gap-[5px]">
          <p class="text-white/50 text-xl mt-auto">{{ t('connections.result.ticketsLeft') }}:</p>
          <p
            :class="{
              'text-blue-600 ': connection.fits && !isBeforeNow(connection.sellBefore),
              'text-red-600 bounce': !connection.fits || isBeforeNow(connection.sellBefore),
            }"
            class="text-3xl font-bold"
          >
            {{ isBeforeNow(connection.sellBefore) ? 0 : connection.ticketsLeft }}
          </p>
        </div>
        <p class="text-white font-bold text-3xl mt-[10px]">{{ connection.price / 100 + ' €' }}</p>
        <button
          :class="{
            'bg-orange-500 hover:bg-orange-600 cursor-pointer':
              connection.fits && !isBeforeNow(connection.sellBefore),
            'bg-gray-500 cursor-default': !connection.fits || isBeforeNow(connection.sellBefore),
          }"
          class="buy-button transition-all duration-200 z-10 py-[15px] px-[20px] rounded-2xl text-white text-xl font-bold"
        >
          {{ t('connections.result.selectTicket') }}
        </button>
      </div>
      <div class="flex w-full relative flex-col gap-[20px] p-[15px] description">
        <div
          @click.stop
          v-if="!connection.fits && !seeAnyway"
          class="flex w-full px-[15px] h-full top-0 justify-center items-center flex-col z-10 gap-[10px] right-0 blurbg absolute bg-black/30 backdrop-blur-xs"
        >
          <img src="/crying-face.webp" alt="" class="size-[70px] rounded-full" />
          <div
            :class="{
              'flex-row': resolution.width > 500,
              'flex-col': resolution.width <= 500,
            }"
            class="flex items-center gap-[5px] whitespace-nowrap"
          >
            <p class="text-white text-wrap text-center">{{ t('connections.result.doesntFit1') }}</p>
            <p class="text-orange-500 font-bold">
              {{ request.passengers.adults + request.passengers.children }}
            </p>
            <p class="text-white">{{ t('connections.result.doesntFit2') }}</p>
          </div>

          <button
            @click="seeAnyway = true"
            class="p-[10px] cursor-pointer hover:bg-blue-700 transition-all duration-200 bg-blue-600/100 rounded-2xl text-white font-bold"
          >
            {{ t('connections.result.seeAnyway') }}
          </button>
        </div>
        <div class="flex logo w-full gap-[9px] items-center">
          <img src="/favicon.svg" alt="" class="size-[40px]" />
          <p class="text-white text-lg font-bold">Marshrutka</p>
          <div class="flex connection gap-[5px]">
            <p class="text-white text-lg">{{ t('connections.result.connection') }}:</p>
            <p class="text-orange-500 font-bold text-xl">{{ connection.line }}</p>
          </div>
        </div>
        <div class="flex items-center time h-fit gap-[10px] w-full my-auto mt-[30px]">
          <div class="flex flex-col departure-time">
            <p class="text-white text-2xl">{{ connection.departureTime.slice(11, 16) }}</p>
            <p class="text-white/50">{{ connection.departureCountry }}</p>
            <p class="text-white/50">{{ formatFullDate(connection.departureTime) }}</p>
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
            <p class="text-white/50">{{ connection.destinationCountry }}</p>
            <p class="text-white/50">{{ formatFullDate(connection.arrivalTime) }}</p>
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
import { unloggedinTicketSelect, type FoundConnection } from '@/scripts/connections'
import { formatFullDate, isBeforeNow } from '@/scripts/time'
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useConnectionRequestStore } from '@/stores/search'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Connection from '../connection/Connection.vue'
const props = defineProps<{
  connection: FoundConnection
}>()

const app = useAppStore()

const { t } = useI18n()
const request = useConnectionRequestStore()
const seeAnyway = ref(false)
const resolution = useResolutionStore()
const search = useConnectionRequestStore()
const router = useRouter()
var selected = ref(false)
const route = useRoute()
function select() {
  selected.value = true
  search.leave = true
  setTimeout(() => {
    router.push({
      name: 'connection',
      params: {
        id: props.connection.id,
        adults: route.params.adults,
        children: route.params.children,
        teenagers: route.params.teenagers,
        retry: 'false',
      },
    })
  }, 300)
}
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

.blurbg {
  border-radius: 16px 16px 0 0;
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
  }

  .blurbg {
    border-radius: 0 16px 16px 0;
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

.logo {
  flex-direction: column;
}
@media (min-width: 450px) {
  .logo {
    flex-direction: row;
  }

  .connection {
    margin-left: auto;
  }
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

.bounce {
  transform-origin: bottom;
  animation: bounce 3s ease infinite;
}
@keyframes bounce {
  0% {
    transform: translateY(0) scaleY(1);
  }
  10% {
    transform: translateY(0) scaleY(0.7); /* squash */
  }

  25% {
    transform: translateY(-20px) scale(1); /* jump up */
  }
  40% {
    transform: translateY(0) scaleY(0.95); /* land, compress slightly */
  }
  55% {
    transform: translateY(-10px) scaleY(1); /* smaller rebound */
  }
  70% {
    transform: translateY(0) scaleY(0.98); /* tiny squash */
  }
  80% {
    transform: translateY(-5px) scaleY(1); /* last tiny hop */
  }
  100% {
    transform: translateY(0) scaleY(1); /* rest */
  }
}

.selected {
  animation: select 0.1s ease-in forwards;
}
@keyframes select {
  0% {
    scale: 1;
  }

  100% {
    scale: 1.1;
  }
}

.sold {
  font-size: clamp(17px, 4vw, 300px);
}
</style>
