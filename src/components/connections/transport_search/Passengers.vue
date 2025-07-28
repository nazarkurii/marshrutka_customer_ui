<template>
  <div
    ref="dropdownRef"
    @click="focused = !focused"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="{
      'outline-amber-600 outline-[3px]': focused,
    }"
    class="flex passengers input-bg gap-[10px] relative w-full px-[20px] h-[60px] cursor-pointer justify-center items-center"
  >
    <p class="text-lg text-white select-none">{{ t('connections.search.passengers') }}:</p>
    <p class="text-xl font-bold text-amber-600">
      {{ request.passengers.adults + request.passengers.children + request.passengers.teenagers }}
    </p>
    <button class="ml-auto text-xs text-white rotate-90 scale-y-[130%] mr-[3px]">></button>

    <transition name="options">
      <div
        v-if="focused"
        @click.stop
        class="flex flex-col p-[20px] menue shadow-2xl shadow-black z-30 input-bg gap-[10px]"
      >
        <h1 class="text-white text-2xl font-bold mx-auto">
          {{ t('connections.search.passengersNumber') }}
        </h1>
        <IncresesInput
          :value="request.passengers.adults"
          :increase="
            () => {
              if (
                request.passengers.adults +
                  request.passengers.children +
                  request.passengers.teenagers <
                7
              ) {
                request.passengers.adults++
              }
            }
          "
          :decrease="
            () => {
              request.passengers.adults ? request.passengers.adults-- : ''
            }
          "
          :name="t('connections.search.adults.name')"
          :description="t('connections.search.adults.description')"
        />
        <hr class="hr" />

        <div class="text-orange-600/70 text-lg font-bold">
          {{ t('connections.search.children.requirement') }}
        </div>
        <IncresesInput
          :value="request.passengers.children"
          :increase="
            () => {
              if (
                request.passengers.adults +
                  request.passengers.children +
                  request.passengers.teenagers <
                7
              ) {
                request.passengers.children++
              }
            }
          "
          :decrease="
            () => {
              request.passengers.children ? request.passengers.children-- : ''
            }
          "
          :name="t('connections.search.teenagers.name')"
          :description="t('connections.search.teenagers.description')"
        />
        <hr class="hr" />
        <IncresesInput
          :value="request.passengers.teenagers"
          :increase="
            () => {
              if (
                request.passengers.adults +
                  request.passengers.children +
                  request.passengers.teenagers <
                7
              ) {
                request.passengers.teenagers++
              }
            }
          "
          :decrease="
            () => {
              request.passengers.teenagers ? request.passengers.teenagers-- : ''
            }
          "
          :name="t('connections.search.children.name')"
          :description="t('connections.search.children.description')"
        />

        <ActiveButton class="mt-auto" :name="t('save')" :active="true" @click="focused = false" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IncresesInput from './IncresesInput.vue'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { useConnectionRequestStore } from '@/stores/search'
import { useRoute } from 'vue-router'

const request = useConnectionRequestStore()
const { t } = useI18n()

const isHovered = ref(false)
const focused = ref(false)

const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    focused.value = false
  }
}

const route = useRoute()
onBeforeMount(() => {
  if (route.name == 'connectionsResult') {
    request.passengers.adults = Number(route.params.adults)
    request.passengers.children = Number(route.params.children)
    request.passengers.teenagers = Number(route.params.teenagers)
  }
})

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

watch(request.passengers, (value) => {
  if (value.adults == 0) {
    request.passengers.children = 0
  }
})
</script>

<style scoped>
.hr {
  color: white;
  opacity: 15%;
}

.menue {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

@media (min-width: 700px) {
  .menue {
    border-radius: var(--radius-2xl) /* 1rem = 16px */;
    position: absolute;
    width: 160%;
    height: fit-content;
    top: 67px;
    left: -60px;
  }
}

@media (max-width: 1050px) {
  .passengers {
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
  }
}

@media (max-width: 770px) {
  .passengers {
    border-radius: 0 0 var(--radius-2xl) 0;
  }
}

@media (max-width: 400px) {
  .passengers {
    grid-column: span 2 / span 2;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }
}

.options-leave-active,
.options-enter-active {
  transition: all 0.2s ease-in;
}

.options-leave-to,
.options-enter-from {
  opacity: 0;
  scale: 0.6;
  transform: translateY(-100px);
}
</style>
