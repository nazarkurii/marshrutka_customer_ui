<template>
  <div class="flex flex-col rounded-2xl w-full h-full max-w-[730px]">
    <transition-group
      @enter="enter"
      @before-enter="beforeEnter"
      @leave="leave"
      @before-leave="beforeLeave"
      appear
    >
      <ContactInfo
        :data-index="0"
        :name="t('package.contactInfo.sender')"
        :key="3"
        v-if="!isLeaving"
        :step="3"
        :preload-user="true"
        :invalid="{
          phoneNumber: parcel.errors.senderInfo.phoneNumber || parcel.senderPhoneNumber.length < 1,
          email: parcel.errors.senderInfo.email || parcel.senderEmail.length < 6,
          firstName: parcel.errors.senderInfo.firstName || parcel.senderFirstName.length < 1,
          lastName: parcel.errors.senderInfo.lastName || parcel.senderLastName.length < 1,
        }"
        v-model:email="parcel.senderEmail"
        v-model:phone-number="parcel.senderPhoneNumber"
        v-model:first-name="parcel.senderFirstName"
        v-model:last-name="parcel.senderLastName"
        @update:email="
          () => {
            parcel.errors.senderInfo.email = false
          }
        "
        @update:phone-number="
          () => {
            parcel.errors.senderInfo.phoneNumber = false
          }
        "
        @update:first-name="
          () => {
            parcel.errors.senderInfo.firstName = false
          }
        "
        @update:last-name="
          () => {
            parcel.errors.senderInfo.lastName = false
          }
        "
      />
      <ContactInfo
        :data-index="1"
        :name="t('package.contactInfo.reciever')"
        :key="3"
        v-if="!isLeaving"
        :step="4"
        :invalid="{
          phoneNumber:
            parcel.errors.recieverInfo.phoneNumber || parcel.recieverPhoneNumber.length < 1,
          email: parcel.errors.recieverInfo.email || parcel.recieverEmail.length < 6,
          firstName: parcel.errors.recieverInfo.firstName || parcel.recieverFirstName.length < 1,
          lastName: parcel.errors.recieverInfo.lastName || parcel.recieverLastName.length < 1,
        }"
        :preload-user="false"
        v-model:email="parcel.recieverEmail"
        v-model:phone-number="parcel.recieverPhoneNumber"
        v-model:first-name="parcel.recieverFirstName"
        v-model:last-name="parcel.recieverLastName"
        @update:email="
          () => {
            parcel.errors.recieverInfo.email = false
          }
        "
        @update:phone-number="
          () => {
            parcel.errors.recieverInfo.phoneNumber = false
          }
        "
        @update:first-name="
          () => {
            parcel.errors.recieverInfo.firstName = false
          }
        "
        @update:last-name="
          () => {
            parcel.errors.recieverInfo.lastName = false
          }
        "
      />
      <AdressComponent
        search-i-d="search1"
        :coutry-name="parcel.connection.departureCountry"
        mapID="map1"
        v-if="!isLeaving"
        :name="t('connection.fromAdress')"
        :step-number="5"
        :data-index="2"
        :key="3"
        class="z-[2]"
        :adress="parcel.pickUpAddress"
        :first-try="parcel.firstTry"
        :country="defineCountryByName(parcel.connection.departureCountry)"
        :handle-func="
          (adress: Adress) => {
            parcel.pickUpAddress.city = adress.city
            parcel.pickUpAddress.street = adress.street
            parcel.pickUpAddress.houseNumber = adress.houseNumber
            parcel.pickUpAddress.googleMapsID = adress.googleMapsID
          }
        "
      />
      <AdressComponent
        search-i-d="search2"
        mapID="map2"
        :adress="parcel.dropOffAddress"
        v-if="!isLeaving"
        :coutry-name="parcel.connection.destinationCountry"
        :name="t('connection.toAdress')"
        :step-number="6"
        :data-index="3"
        :first-try="parcel.firstTry"
        :key="4"
        class="z-[1]"
        :country="defineCountryByName(parcel.connection.destinationCountry)"
        :handle-func="
          (adress: Adress) => {
            parcel.dropOffAddress.city = adress.city
            parcel.dropOffAddress.street = adress.street
            parcel.dropOffAddress.houseNumber = adress.houseNumber
            parcel.dropOffAddress.googleMapsID = adress.googleMapsID
          }
        "
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import gsap from 'gsap'

import { defineCountryByName } from '@/scripts/countries'

import type { Adress } from '@/scripts/adresses'
import type { ConnectionFull } from '@/scripts/connections'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ContactInfo from './ContactInfo.vue'
import { useParcelStore } from '@/stores/parcel'
import AdressComponent from '../connection/form/Adress.vue'
import { onBeforeRouteLeave } from 'vue-router'

const props = defineProps<{
  connection: ConnectionFull
}>()

const { t } = useI18n()

const parcel = useParcelStore()

const isLeaving = ref(false)

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

onBeforeRouteLeave(() => {
  isLeaving.value = true
})
</script>
