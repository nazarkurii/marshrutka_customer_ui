<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="choose"
    :class="{
      ' bg-blue-500 hover:bg-orange-500 mx-auto cursor-pointer':
        connection.usable && connection.luggageVolumeLeft >= parcel.volume,
      ' bg-red-600/80 hover:bg-red-600 mx-auto cursor-default':
        connection.usable && connection.luggageVolumeLeft < parcel.volume,
      'cursor-default': !connection.usable,
      relative: resolution.width > 770,
    }"
    class="flex flex-col relative aspect-square mx-auto transition-all duration-200 h-full w-[46px] text-lg rounded-xl"
    :key="connection.id"
  >
    <p
      :class="{
        'text-green-500': parcel.volume <= connection.luggageVolumeLeft,
        'text-red-500': parcel.volume > connection.luggageVolumeLeft,
      }"
      v-if="connection.usable"
      class="absolute w-fit left-1/2 -translate-x-1/2 bottom-[50px]"
    >
      {{ parcel.volume <= connection.luggageVolumeLeft ? parcel.calcPrice(connection) : 0 }}€
    </p>
    <p
      :class="{
        'text-white': connection.isCurrentMonth,
        'text-red-500/60': !connection.isCurrentMonth,
      }"
      class="tracking-[2px] m-auto textSize"
    >
      {{ connection.dayMonth }}
    </p>

    <DateDescription
      :shadow="true"
      class="absolute w-fit left-1/2 -translate-x-1/2 bottom-[60px]"
      :connection="connection"
      :active="resolution.width >= 770 && hovered"
    />
  </div>
  <TransparentBackground
    :close="
      () => {
        chosen = false
      }
    "
    :condition="resolution.width < 770 && chosen"
  >
    <div class="flex flex-col gap-[10px] max-w-[300px] w-full px-[10px]">
      <h1 class="textSize text-white font-bold mx-auto">
        {{ formatDateWithDay(connection.departureTime) }}
      </h1>
      <DateDescription class="" :shadow="false" :connection="connection" :active="true" />

      <ActiveButton class="w-full" :name="t('choose')" :active="true" @click="forseChoose()" />
      <CancelButton
        class="text-lg"
        :func="
          () => {
            chosen = false
          }
        "
      />
    </div>
  </TransparentBackground>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import DateDescription from './DateDescription.vue'
import { useParcelStore } from '@/stores/parcel'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useRoute, useRouter } from 'vue-router'
import type { ConnectionParcel } from '@/scripts/connections'
import TransparentBackground from '@/components/utils/TransparentBackground.vue'
import CancelButton from '@/components/global/utils/CancelButton.vue'
import { formatDateWithDay } from '@/scripts/time'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  connection: ConnectionParcel
  i: number
}>()

const hovered = ref(false)
const parcel = useParcelStore()
const resolution = useResolutionStore()
const router = useRouter()
const route = useRoute()
const chosen = ref(false)
const { t } = useI18n()

function choose() {
  if (!props.connection.usable) return

  if (resolution.width > 770) {
    if (props.connection.luggageVolumeLeft >= parcel.volume) {
      forseChoose()
    }
  } else {
    chosen.value = true
  }
}

function forseChoose() {
  router.push({
    name: 'parcelOrder',
    params: {
      connectionID: props.connection.id,
      width: route.params.width,
      height: route.params.height,
      length: route.params.length,
      weight: route.params.weight,
      type: parcel.type,
      retry: 'false',
    },
  })
}
</script>

<style lang="scss" scoped>
.textSize {
  font-size: clamp(15px, 4vw, 17px);
}
</style>
