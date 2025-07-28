<template>
  <FormStep :step="3" :name="t('connection.chooseSeats')" :button="true" :button-action="openForm">
    <div class="flex w-fit mx-auto h-[130px] overflow-x-auto min-w-[100px]">
      <div class="flex h-full gap-[20px]">
        <Seat
          @click="openForm"
          v-for="(seat, i) in ticket.seats"
          :direction="seat.direction"
          :key="i"
          :number="seat.number"
          :selected="true"
          :taken="false"
        />
      </div>
    </div>
  </FormStep>
</template>

<script setup lang="ts">
import type { ResponseSeat } from '@/scripts/connections'
import { useI18n } from 'vue-i18n'
import Seat from '../Seat.vue'
import FormStep from './utils/FormStep.vue'
import { useTicketStore } from '@/stores/ticket'

defineProps<{
  openForm: () => void
}>()

const ticket = useTicketStore()

const { t } = useI18n()

console.log(ticket.seats)
</script>

<style scoped></style>
