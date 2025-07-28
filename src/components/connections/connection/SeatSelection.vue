<template>
  <div
    class="flex flex-col w-full max-w-[500px] mx-auto shadow-2xl ml-auto rounded-2xl bg-zinc-800"
  >
    <div
      class="p-[20px] relative overflow-clip text-white text-2xl font-bold text-center w-full border-b-[1px] border-white/30"
    >
      {{ t('connection.seatReservation') }}
    </div>
    <div class="flex flex-col pt-[60px] gap-[20px] justify-between w-full p-[15px]">
      <div
        class="flex w-full justify-between gap-[20px]"
        v-for="(row, i) in bus.structure"
        :key="i"
      >
        <div v-for="(seat, i) in row" :key="i" class="flex w-full aspect-square">
          <Seat
            @click="
              seat.taken
                ? false
                : ticket.seats.includes(seat)
                  ? ticket.unselectSeat(seat)
                  : ticket.selectSeat(seat)
            "
            :direction="seat.direction"
            :taken="seat.taken"
            :selected="ticket.seats.findIndex((ticketSeat) => seat.id == ticketSeat.id) != -1"
            v-if="seat.type != SeatType.Space && seat.type != SeatType.Table"
            :number="seat.number"
          />

          <div
            @mouseenter="tableHovered = true"
            @mouseleave="tableHovered = false"
            v-if="seat.type == SeatType.Table"
            class="flex w-full h-[80%] my-auto bg-zinc-700 border-b-[5px] border-white/10 rounded-3xl"
          >
            <p v-if="tableHovered" class="text-white font-bold text-2xl m-auto">
              {{ t('connection.table') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type CustomerBus, type ResponseSeat, SeatType } from '@/scripts/connections'
import { useI18n } from 'vue-i18n'
import Seat from './Seat.vue'
import { ref, watch } from 'vue'
import { useTicketStore } from '@/stores/ticket'

const props = defineProps<{
  bus: CustomerBus
}>()

const { t } = useI18n()

const tableHovered = ref(false)

const ticket = useTicketStore()
</script>

<style scoped>
.allert {
  animation: moveBox 3s forwards;
}
@keyframes moveBox {
  0% {
    transform: translateY(100px);
  }
  20% {
    transform: translateX(0px);
  }
  80% {
    transform: translateX(0px);
  }
  100% {
    transform: translateY(100px);
  }
}
</style>
