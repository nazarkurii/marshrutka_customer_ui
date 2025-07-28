<template>
  <div class="flex flex-col rounded-2xl w-full h-full max-w-[730px]">
    <transition-group
      @enter="enter"
      @before-enter="beforeEnter"
      @leave="leave"
      @before-leave="beforeLeave"
      appear
    >
      <Passengers v-if="!app.changingRoute" :data-index="0" :key="0" />

      <Luggage v-if="!app.changingRoute" :data-index="1" :key="1" />
      <SelectSeatsForm
        v-if="!app.changingRoute"
        :data-index="2"
        :key="2"
        :open-form="
          () => {
            resolution.fix()
            selecSeatFormOpened = true
          }
        "
      />
      <ContactInfo :data-index="3" :key="3" v-if="!app.changingRoute" />
      <AdressComponent
        search-i-d="search1"
        :coutry-name="ticket.connection.departureCountry"
        mapID="map1"
        v-if="!app.changingRoute"
        :name="t('connection.fromAdress')"
        :step-number="5"
        :data-index="3"
        :key="3"
        :first-try="ticket.firstTry"
        class="z-[2]"
        :adress="ticket.pickUpAddress"
        :country="defineCountryByName(ticket.connection.departureCountry)"
        :handle-func="
          (adress: Adress) => {
            ticket.pickUpAddress.city = adress.city
            ticket.pickUpAddress.street = adress.street
            ticket.pickUpAddress.houseNumber = adress.houseNumber
            ticket.pickUpAddress.googleMapsID = adress.googleMapsID
          }
        "
      />
      <AdressComponent
        :first-try="ticket.firstTry"
        search-i-d="search2"
        mapID="map2"
        :adress="ticket.dropOffAddress"
        v-if="!app.changingRoute"
        :coutry-name="ticket.connection.destinationCountry"
        :name="t('connection.toAdress')"
        :step-number="6"
        :data-index="4"
        :key="4"
        class="z-[1]"
        :country="defineCountryByName(ticket.connection.destinationCountry)"
        :handle-func="
          (adress: Adress) => {
            ticket.dropOffAddress.city = adress.city
            ticket.dropOffAddress.street = adress.street
            ticket.dropOffAddress.houseNumber = adress.houseNumber
            ticket.dropOffAddress.googleMapsID = adress.googleMapsID
          }
        "
      />
    </transition-group>
    <Editor
      v-show="selecSeatFormOpened"
      class="z-30"
      :close-func="
        () => {
          ;((selecSeatFormOpened = false), resolution.unfix()), ticket.fixSeats(true, ticket.seats)
        }
      "
      :fixed="true"
      :hide-cancel="true"
    >
      <div class="flex flex-col gap-[10px] bus">
        <SeatSelection :bus="connection.bus" />
        <ActiveButton
          :name="t('save')"
          :active="true"
          @click="
            (((selecSeatFormOpened = false), resolution.unfix()),
            ticket.fixSeats(true, ticket.seats))
          "
        />
      </div>
    </Editor>
  </div>
</template>

<script setup lang="ts">
import { SeatType, type ConnectionFull, type ResponseSeat } from '@/scripts/connections'
import Passengers from './form/Passengers.vue'
import { onBeforeMount, ref, watch, type Reactive } from 'vue'
import SeatSelection from './SeatSelection.vue'
import { useTicketStore, type NewTicket } from '@/stores/ticket'
import Editor from '@/components/profile/utils/Editor.vue'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { useI18n } from 'vue-i18n'
import SelectSeatsForm from './form/SelectSeatsForm.vue'
import { useResolutionStore } from '@/stores/resolutionStore'
import ContactInfo from './form/ContactInfo.vue'

import { useConnectionRequestStore } from '@/stores/search'
import type { User } from '@/scripts/user'
import axios from 'axios'
import { Problem } from '@/scripts/errors'
import gsap from 'gsap'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import type { Passenger } from '@/scripts/passengers'
import AdressComponent from './form/Adress.vue'
import { defineCountryByName } from '@/scripts/countries'
import { useAppStore } from '@/stores/app'
import type { Adress } from '@/scripts/adresses'
import { Language } from '@googlemaps/google-maps-services-js'
import Luggage from './form/Luggage.vue'
const props = defineProps<{
  connection: ConnectionFull
}>()

const ticket = useTicketStore()
const selecSeatFormOpened = ref(false)
const { t } = useI18n()

const resolution = useResolutionStore()
const route = useRoute()

onBeforeMount(async () => {
  const ticketForm = cookies.get('ticketForm') as NewTicket | null

  const ticketFormCorrect =
    ticketForm && ticket.connection.id == ticketForm.connection.id ? true : false

  fixPassengers(ticketFormCorrect, ticketForm?.passengers)
  ticket.fixSeats(ticketFormCorrect, ticketForm?.seats)
})

const app = useAppStore()

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  return gsap.to(element, {
    opacity: 1,
    x: 0,
    duration: 0.2,
    delay: 0.2 * Number(element.dataset.index),
    transition: 'ease-in',
  })
}
const leave = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  return gsap.to(element, {
    opacity: 0,
    x: -200,
    duration: 0.2,
    transition: 'ease-in',
  })
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '1'
  element.style.transform = 'translateX(0px)'
}

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  element.style.transform = 'translateX(-100px)'
}

const { cookies } = useCookies()

function fixPassengers(sameConnection: boolean = false, savedPassengers: Passenger[] = []) {
  const popPassenger = (passengerType: 'Adult' | 'Teenager' | 'Child') => {
    const index = savedPassengers.findIndex((pasenger) => pasenger.type == passengerType)
    if (index == -1) {
      ticket.passengers.push({
        type: passengerType,
        firstName: '',
        lastName: '',
      })
    } else {
      ticket.passengers.push(savedPassengers[index])
      savedPassengers.splice(index, 1)
    }
  }
  for (let i = 0; i < Number(route.params.adults); i++) {
    popPassenger('Adult')
  }
  for (let i = 0; i < Number(route.params.teenagers); i++) {
    popPassenger('Teenager')
  }
  for (let i = 0; i < Number(route.params.children); i++) {
    popPassenger('Child')
  }
}
</script>

<style scoped>
.bus {
  width: 450px;
}
@media (max-width: 500px) {
  .bus {
    width: 90vw;
  }
}
</style>
