<template>
  <Loader v-if="fetching" class="mb-[calc(100%/2.7)]" />
  <div v-else class="flex connection px-[10px] h-fit w-full gap-[50px] pb-[30px]">
    <div class="flex w-full h-full form flex-col gap-[10px] max-w-[980px]">
      <transition name="back">
        <GoBack v-if="!app.changingRoute" />
      </transition>
      <TicketForm :connection="ticket.connection" />
    </div>
    <div class="flex w-full items-start justify-center">
      <div
        :class="{
          fixed: resolution.width >= 1420,
        
          'max-w-[730px]': resolution.width >= 1530,
        }"
        class="flex flex-col gap-[20px] w-full"
      >
        <transition name="ticket" appear>
          <Ticket :connection="ticket.connection" v-if="!app.changingRoute" />
        </transition>
        <transition name="ticket" appear>
          <Images :urls="ticket.connection.bus.imageURLs" v-if="!app.changingRoute" />
        </transition>
        <transition name="ticket" appear>
          <Purchase v-if="!app.changingRoute" />
        </transition>
      </div>
    </div>
  </div>
  <TransparentBackground
    :close="() => {}"
    :condition="
      ticket.alreadyUnavailableError ||
      ticket.tooManyPassengersError ||
      ticket.takenSeatsError ||
      ticket.retry
    "
  >
    <FormError />
  </TransparentBackground>
</template>

<script setup lang="ts">
import Loader from '@/components/utils/Loader.vue'
import { isSeat, type ConnectionFull } from '@/scripts/connections'
import { Problem } from '@/scripts/errors'
import axios from 'axios'
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import SeatSelection from './SeatSelection.vue'
import { useConnectionRequestStore } from '@/stores/search'
import TicketForm from './TicketForm.vue'
import GoBack from './GoBack.vue'
import FoundConnection from '../transport_search/FoundConnection.vue'

import { useTicketStore, type NewTicket } from '@/stores/ticket'
import Purchase from './Purchase.vue'
import { useCookies } from 'vue3-cookies'
import router from '@/router'
import { useResolutionStore } from '@/stores/resolutionStore'
import Ticket from './Ticket.vue'
import TransparentBackground from '@/components/utils/TransparentBackground.vue'
import AlreadyUnavailable from './utils/FormError.vue'
import FormError from './utils/FormError.vue'
import { useAppStore } from '@/stores/app'
import Images from './form/Images.vue'

const route = useRoute()
const fetching = ref(true)
const resolution = useResolutionStore()
const ticket = useTicketStore()
const { cookies } = useCookies()
const app = useAppStore()
onBeforeMount(async () => {
  ticket.$reset()
  ticket.retry = route.params.retry == 'true'

  const error = await ticket.getConnection(
    String(route.params.id),
    Number(route.params.adults) + Number(route.params.children) + Number(route.params.teenagers),
  )


  if (error) {
    router.push({ name: 'popularDestinations' })
  } else {
    fetching.value = false
  }
})

window.addEventListener('beforeunload', () => {
  cookies.set(
    'ticketForm',
    JSON.stringify({
      seats: ticket.seats,
      passengers: ticket.passengers,
      pickUpAddress: ticket.pickUpAddress,
      dropOffAddress: ticket.dropOffAddress,
      connection: {
        id: ticket.connection.id,
      },
    } as NewTicket),
    '10min',
  )
})

onBeforeRouteLeave((from, to, next) => {
  setTimeout(() => {
    next()
  }, 50)
  app.changeRoute()
})
</script>

<style scoped>
.connection {
  flex-direction: column;
  align-items: center;
}

.form {
  align-items: center;
}

@media (min-width: 1420px) {
  .connection {
    flex-direction: row;
    align-items: start;
  }

  .form {
    align-items: start;
  }
}

.back-leave-to,
.back-enter-from {
  opacity: 0;
  transform: translateX(-200px);
}

.back-leave-active,
.back-enter-active {
  transition: all 0.3s ease-in;
}

.ticket-leave-to,
.ticket-enter-from,
.purchase-enter-from,
.purchase-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.purchase-enter-active {
  transition: all 0.3s ease-in;
}

.ticket-enter-active {
  transition: all 0.3s ease-in;
}

.ticket-leave-active,
.purchase-leave-active {
  transition: all 0.2s ease-in;
}

.purchase-enter-to,
.purchase-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
