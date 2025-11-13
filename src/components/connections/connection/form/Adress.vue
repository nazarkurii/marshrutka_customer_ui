<template>
  <FormStep :name="name" :step="stepNumber">
    <div class="adress w-full h-fitrelative">
      <div class="flex flex-col gap-[10px] justify-between">
        <gmp-basic-place-autocomplete
          :id="searchID"
          @click="searchSelected = true"
          class="rounded-xl input-bg h-[55px] mapMaxWidth"
          :included-region-codes="defineCountryByName(coutryName).code"
          included-primary-types="street_address"
          placeHolder="formatedAdress"
          @gmp-select="handlePlaceSelect"
        ></gmp-basic-place-autocomplete>
        <p class="text-white/50 ml-[2px]">{{ t('connection.searchAdressExample') }}</p>
        <Input
          class="z-0"
          :input-bg="true"
          :unavailable-message="t('connection.city')"
          :name="t('connection.city')"
          type="text"
          :available="false"
          v-model="adress.city"
          :invalid="firstTry ? false : !adress.city"
        />
        <Input
          :unavailable-message="t('connection.street')"
          class="z-0"
          :input-bg="true"
          :name="t('connection.street')"
          type="text"
          :available="false"
          v-model="adress.street"
          :invalid="firstTry ? false : !adress.street"
        />

        <div class="flex gap-[10px]">
          <Input
            class="z-0"
            :input-bg="true"
            :name="t('connection.houseNumber')"
            :unavailable-message="t('connection.houseNumber')"
            type="text"
            :available="false"
            v-model="adress.houseNumber"
            :invalid="firstTry ? false : !adress.houseNumber"
          />
        </div>
      </div>
      <div class="flex flex-col size-full gap-[10px] h-[280px]">
        <CountryTitle :country="coutryName" class="h-[50px] mx-auto w-full mapMaxWidth" />

        <div :id="mapID" class="map mapMaxWidth"></div>
      </div>
    </div>
  </FormStep>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import FormStep from './utils/FormStep.vue'
import { defineCountryByName, type Country } from '@/scripts/countries'
import CountryTitle from './CountryTitle.vue'
import Input from '@/components/utils/Input.vue'
import { useI18n } from 'vue-i18n'
import { type Adress } from '@/scripts/adresses'
import { useTicketStore } from '@/stores/ticket'
import axios from 'axios'

import { useAppStore } from '@/stores/app'

import { Problem } from '@/scripts/errors'


const props = defineProps<{
  mapID: string
  searchID: string
  name: string
  stepNumber: number
  coutryName: string
  adress: Adress
  handleFunc: (adress: Adress) => void
  firstTry: boolean
}>()

const streetSearch = ref('10 maidan')

const placeDetailsRef = ref<HTMLElement | null>(null)

const { t } = useI18n()
const map = ref<google.maps.Map | null>(null)
const searchSelected = ref(false)
const formatedAdress = ref('')
onMounted(async () => {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary
  await google.maps.importLibrary('places')

  const mapElement = document.getElementById(props.mapID)
  if (!mapElement) {
    console.error(`Map element with ID '${props.mapID}' not found.`)
    return
  }

  const currentCountry = defineCountryByName(props.coutryName)
  map.value = new Map(mapElement, {
    center: { lat: currentCountry.lat, lng: currentCountry.lng },
    zoom: 10,
    disableDefaultUI: true,
    draggable: true,
    keyboardShortcuts: false,
    clickableIcons: true,
  })
})
const marker = ref<google.maps.Marker | null>(null)

const app = useAppStore()
async function handlePlaceSelect(event: { place: { id: string } }) {
  if (placeDetailsRef.value) {
    const placeRequest = placeDetailsRef.value.querySelector('gmp-place-details-place-request')
    if (placeRequest) {
      placeRequest.setAttribute('placeid', event.place.id)
    }
  }
  try {
    const fields = ['displayName', 'formattedAddress', 'addressComponents', 'location']

    const {
      data,
    }: {
      data: {
        formattedAddress: string
        addressComponents: Array<{
          longText: string
          types: Array<string>
        }>

        location: {
          latitude: number
          longitude: number
        }
      }
    } = await axios.get(`https://places.googleapis.com/v1/places/${event.place.id}`, {
      params: {
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        fields: fields.join(','),
        languageCode: app.language.code,
      },
    })

    const getComponent = (type: string): string | 'N/A' => {
      const component = data.addressComponents?.find((comp: any) => {
        return comp.types.includes(type)
      })
      return component ? component.longText : 'N/A'
    }

    map.value?.setCenter({
      lat: data.location.latitude,
      lng: data.location.longitude,
    })

    map.value?.setZoom(16)

    if (!marker.value) {
      marker.value = new google.maps.Marker({
        position: {
          lat: data.location.latitude,
          lng: data.location.longitude,
        },
        map: map.value,
        title: data.formattedAddress,
      })
    } else {
      marker.value.setPosition({
        lat: data.location.latitude,
        lng: data.location.longitude,
      })
      marker.value.setTitle(data.formattedAddress)
    }

    const contentString = `
  <div class="flex  gap-[10px]">
    <div class="input-bg p-[5px] rounded-full size-[40px] mx-auto">
      <img src="/logo.svg" class="size-[30px]" />
    </div>
    <div style="flex: 1">
      <h3 class="text-gray-800 text-m text-center">${data.formattedAddress}</h3>
    </div>
  </div>
`
    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    })

    infoWindow.open(map.value, marker.value)
    marker.value.addListener('click', () => {
      infoWindow.open(map.value, marker.value)
    })
    props.handleFunc({
      country: props.coutryName,
      city: getComponent('locality'),
      street: getComponent('route'),
      houseNumber: getComponent('street_number'),
      googleMapsID: event.place.id,
      formated: data.formattedAddress,
    })
    formatedAdress.value = data.formattedAddress
    searchSelected.value = false

    const search = document.getElementById(props.searchID) as HTMLElement
    const searchInput = search as any
    const internalInput = searchInput.Cg || searchInput.Uj?.querySelector('input')

    if (internalInput) {
      internalInput.value = formatedAdress.value
    }
  } catch (error: unknown) {
    new Problem(error, true)
  }
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.getElementById('searchResult')
  const search = document.getElementById(props.searchID) as HTMLElement
  const searchInput = search as any
  const internalInput = searchInput.Cg || searchInput.Uj?.querySelector('input')

  if (
    dropdown ? !dropdown.contains(event.target as Node) : !search.contains(event.target as Node)
  ) {
    searchSelected.value = false

    if (internalInput) {
      internalInput.value = formatedAdress.value
    }
  } else {
    search.focus()
    if (internalInput) {
      internalInput.value = ''
    }
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.autocomplete-input {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 300px;
  background: white;
  border-radius: 30px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.adress {
  display: flex;
  gap: 20px;
  flex-direction: column;
}

@media (min-width: 700px) {
  .adress {
    flex-direction: row;
  }
}

.input:focus,
input:hover {
  outline: none;
  border-color: rgba(129, 140, 248);

  box-shadow: 0 0 0 5px rgb(129 140 248 / 30%);
}

.mapMaxWidth {
  max-width: calc(100%);
}

@media (min-width: 750px) {
  .mapMaxWidth {
    width: calc(340px);
  }
}
</style>
