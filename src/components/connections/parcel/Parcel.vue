<template>
  <div
    class="flex relative flex-col w-full max-w-[730px] mx-auto hover:translate-y-[-10px] transition-all duration-200"
  >
    <!-- <div v-if="profile" class="w-[calc(100%-20px)] mx-auto px-[10px] pb-[10px] pt-[40px] relative">
      <div
        class="input-bg w-full px-[10px] pt-[10px] pb-[60px] left-0 absolute top-0 rounded-t-2xl"
      ></div>
    </div> -->
    <div
      class="relative parcel pb-[10px] flex transition-all duration-200 hover:shadow-2xl shadow-black order-bg min-h-[300px] rounded-2xl text-white border border-white/10 max-w-[730px] w-full mx-auto"
    >
      <!-- Left Price / Volume Section -->
      <div
        class="flex flex-col box gap-[20px] items-center justify-between bg-input py-[23px] px-[20px] border-r-[1px] border-white/10"
      >
        <div v-if="!profile" class="text-2xl font-bold">{{ (parcel.price / 100).toFixed(2) }}€</div>
        <img
          v-if="parcel.type.toLocaleLowerCase() == 'package'"
          class="size-[150px] my-auto"
          src="/package-box.svg"
          alt=""
        />
        <img
          v-if="parcel.type.toLocaleLowerCase() == 'documents'"
          class="size-[150px] my-auto"
          src="/documents-parcel.svg"
          alt=""
        />
        <div v-if="parcel.qrCode" class="flex flex-col gap-[10px] max-w-[150px] items-center">
          <img :src="`data:image/png;base64,${parcel.qrCode}`" alt="" class="rounded-2xl" />
        </div>
        <div
          v-if="!profile"
          class="text-xs font-semibold bg-green-600/20 text-green-400 p-[10px] rounded-lg"
        >
          {{ t('package.fits') }}
        </div>
      </div>

      <!-- Right Info Section -->
      <div class="flex-1 flex flex-col justify-between pb-[10px] p-4 sm:p-6 relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="/favicon.svg" alt="parcel" class="w-6 h-6" />
            <p class="font-semibold text-lg tracking-wide">Marsrutka Parcel</p>
          </div>
        </div>

        <div class="flex flex-col h-full py-[10px] justify-around gap-[10px]">
          <div class="flex items-center time h-fit gap-[10px] w-full">
            <div class="flex flex-col departure-time">
              <p class="text-white text-2xl">{{ connection.departureTime.slice(11, 16) }}</p>
              <p class="text-white/50">{{ t('countries.' + connection.departureCountry) }}</p>
              <p class="text-white/50">{{ formatDateWithDay(connection.departureTime) }}</p>
            </div>
            <div class="flex flex-col flex-1 gap-[6px]">
              <div class="flex gap-[1px]">
                <div class="border-[3px] rounded-full border-white/30 flex-1"></div>
                <div class="border-[1px] my-auto h-0 border-white/30 flex-1"></div>
                <div class="border-[3px] rounded-full border-white/30 flex-1"></div>
              </div>
            </div>
            <div class="flex flex-col arrival-time">
              <p class="text-white text-2xl">{{ connection.arrivalTime.slice(11, 16) }}</p>
              <p class="text-white/50">{{ t('countries.' + connection.destinationCountry) }}</p>
              <p class="text-white/50">{{ formatDateWithDay(connection.arrivalTime) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 size gap-[10px]">
            <div class="flex justify-between">
              <span class="text-white/60"> {{ t('package.width') }}:</span>
              <span>{{ parcel.width }} {{ t('cm') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/60">{{ t('package.height') }}:</span>
              <span>{{ parcel.height }} {{ t('cm') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/60">{{ t('package.length') }}:</span>
              <span>{{ parcel.length }} {{ t('cm') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/60">{{ t('package.weight') }}:</span>
              <span>{{ parcel.weight }} {{ t('g') }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="resolution.width > 730"
          class="flex w-full bg-gradient-to-r max-w-[520px] to-green-700 h-[30px] absolute bottom-[-10px] right-0 rounded-br-2xl"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ConnectionFull } from '@/scripts/connections'
import ParcelMessurements from '../parcel_search/ParcelMessurements.vue'
import { useI18n } from 'vue-i18n'
import { formatDateWithDay } from '@/scripts/time'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useParcelStore } from '@/stores/parcel'
import type { Parcel } from '@/scripts/parcels'

const props = defineProps<{
  connection: ConnectionFull
  parcel: Parcel
  profile?: boolean
}>()

console.log(props.parcel)

const { t } = useI18n()
const resolution = useResolutionStore()
</script>

<style scoped>
.box {
  border-right-width: 1px;
}
@media (max-width: 730px) {
  .parcel {
    flex-direction: column-reverse;
  }

  .box {
    border-right-width: 0px;
    border-top-width: 1px;
    width: 100%;
  }
}

.ticket {
  flex-direction: column-reverse;
}
.buy-part {
  border-right: 1px;
  width: 100%;
}

.buy-button {
  width: 90%;
}

.description {
  padding-top: 30px;
}
@media (min-width: 750px) {
  .ticket {
    flex-direction: row;
  }
  .buy-button {
    width: 185px;
  }

  .description {
    padding-top: 15px;
  }
  .buy-part {
    width: 230px;
    border-style: var(--tw-border-style);
    border-right-width: 1px;
    border-color: color-mix(in oklab, var(--color-white) /* #fff = #ffffff */ 10%, transparent);
    height: 100%;
  }
}

.time {
  flex-direction: column;
}

.departure-time {
  align-items: center;
}

.arrival-time {
  align-items: center;
}

@media (min-width: 400px) {
  .time {
    flex-direction: row;
  }

  .arrival-time {
    align-items: flex-end;
  }

  .departure-time {
    align-items: flex-start;
  }

  .size {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.size {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
</style>
