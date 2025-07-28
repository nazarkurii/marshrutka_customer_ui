<template>
  <div class="flex flex-col gap-[20px] items-center px-[10px] max-w-[800px]">
    <img src="/crying-face.webp" alt="" class="size-[200px] rounded-full" />
    <h1 class="text-3xl font-bold text-white text-center">
      {{ t('connection.unavailableTicket.title') }}
    </h1>
    <p v-if="ticket.alreadyUnavailableError" class="text-2xl font-bold text-gray-400 text-center">
      {{ t('connection.unavailableTicket.alreadyBought') }}
    </p>

    <p v-if="ticket.tooManyPassengersError" class="text-2xl font-bold text-gray-400 text-center">
      {{ t('connection.unavailableTicket.tooManyPassengers') }}
    </p>
    <p v-if="ticket.takenSeatsError" class="text-2xl font-bold text-gray-400 text-center">
      {{ t('connection.unavailableTicket.takenSeats') }}
    </p>

    <div class="max-w-[300px] w-full gap-[10px] flex flex-col">
      <button
        v-if="(ticket.takenSeatsError || ticket.retry) && !ticket.tooManyPassengersError"
        @click="((ticket.takenSeatsError = false), (ticket.retry = false))"
        class="flex resolution text-white cursor-pointer bg-blue-600 hover:bg-blue-700 h-[55px] justify-center items-center rounded-xl text-xl font-bold transition-all duration-200"
      >
        {{ ticket.retry ? t('tryAgain') : t('connection.unavailableTicket.checkSeats') }}
      </button>
      <ActiveButton
        :active="true"
        :name="t('back')"
        v-if="ticket.tooManyPassengersError || ticket.alreadyUnavailableError || ticket.retry"
        @click="
          router.push({
            name: 'connectionsResult',
            params: {
              from: ticket.connection.departureCountry,
              to: ticket.connection.destinationCountry,
              date: formatToDateLocal(ticket.connection.departureTime),
              adults: route.params.adults,
              teenagers: route.params.teenagers,
              children: route.params.children,
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
import { useConnectionRequestStore } from '@/stores/search'
import { useTicketStore } from '@/stores/ticket'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const ticket = useTicketStore()
const route = useRoute()
</script>

<style scoped></style>
