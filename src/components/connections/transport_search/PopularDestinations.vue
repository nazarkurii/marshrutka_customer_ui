<template>
  <transition name="component" appear>
    <div class="px-[10px] mx-autto" v-if="!leave">
      <div class="bg pt-[20px] rounded-3xl w-full max-w-[700px]">
        <h1 class="text-3xl ml-[20px] font-bold text-white">
          {{ (t('connections.popular.name'), 'Pasha hello') }}
        </h1>
        <h2 class="text-2xl ml-[20px] text-white/80">{{ t('connections.popular.description') }}</h2>
        <div class="flex w-full px-[20px] pb-[20px] overflow-x-auto scroll-">
          <div class="flex gap-[15px] mt-[20px] w-[660px] cursor-pointer">
            <div
              @mouseenter="hovered = i"
              @click="
                () => {
                  request.setPopular(destination.country)
                }
              "
              @mouseleave="hovered = -1"
              v-for="(destination, i) in destinations"
              class="flex flex-col w-[154px]"
            >
              <div class="flex rounded-2xl overflow-hidden bg-red-400">
                <img
                  :class="{
                    'scale-125': hovered == i,
                  }"
                  class="transition-all duration-300 size-[154px] flex"
                  :src="destination.smalImage"
                  :alt="destination.country"
                  :key="i"
                />
              </div>
              <h1
                :class="{
                  'bg-white/10': hovered == i || request.to == destination.country,
                }"
                class="text-xl text-white px-[10px] rounded-t-lg transition-all duration-200 font-semibold mt-[10px]"
              >
                {{ t('countries.' + destination.country) }}
              </h1>
              <div
                :class="{
                  'bg-white/10': hovered == i || request.to == destination.country,
                }"
                class="flex gap-[5px] px-[10px] rounded-b-lg items-center transition-all duration-200"
              >
                <h1 class="text-white/90 font-bold text-lg mb-[3px]">
                  {{ destination.flag + ' ' + t('from') }} {{ destination.price }} €
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useConnectionRequestStore } from '@/stores/search'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'

const { t } = useI18n()

const hovered = ref(-1)
const resolution = useResolutionStore()
const request = useConnectionRequestStore()
const app = useAppStore()
onMounted(() => {
  app.footerON()
})
const destinations: {
  country: string
  flag: string
  smalImage: string
  price: number
}[] = [
  {
    country: 'Poland',
    flag: '🇵🇱',

    smalImage: '/warsaw-small.webp',
    price: 100,
  },
  {
    country: 'Germany',
    flag: '🇩🇪',

    smalImage: '/germany-small.webp',
    price: 200,
  },
  {
    country: 'Estonia',
    flag: '🇪🇪',

    smalImage: '/estonia-small.webp',
    price: 150,
  },
  {
    country: 'Czechia',
    flag: '🇨🇿',

    smalImage: '/prague-small.webp',
    price: 150,
  },
]

const leave = ref(false)

onBeforeRouteLeave(() => {
  leave.value = true
})
</script>

<style scoped>
.bg {
  background-color: #2e3035be;
}

.grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.component-leave-active,
.component-enter-active {
  transition: all 0.2s ease-in;
}

.component-leave-to,
.component-enter-from {
  transform: translateY(100px);
  opacity: 0;
  scale: 0.9;
}
</style>
