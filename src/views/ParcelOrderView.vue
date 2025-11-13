<template>
  <Loader v-if="fetching" class="mb-[calc(100%/2.7)]" />
  <div v-else class="flex connection px-[10px] h-fit w-full gap-[50px] mb-[50px]">
    <div class="flex w-full h-full form flex-col gap-[10px] max-w-[980px]">
      <transition name="back">
        <GoBack v-if="!isLeaving" />
      </transition>
      <ParcelForm :connection="parcel.connection" />
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
          <Parcel
            :connection="parcel.connection"
            :parcel="{
              width: parcel.width,
              length: parcel.length,
              height: parcel.height,
              price: parcel.price,
              weight: parcel.weight,
              type: parcel.type,
            }"
            v-if="!isLeaving"
          />
        </transition>

        <transition name="ticket" appear>
          <Purchase v-if="!isLeaving" />
        </transition>
      </div>
    </div>
  </div>

  <TransparentBackground
    :close="() => {}"
    :condition="
      (parcel.errors.notEnoughSpaceAlready ||
        parcel.retry ||
        parcel.volume > parcel.connection.luggageVolumeLeft) &&
      !fetching
    "
  >
    <FormError />
  </TransparentBackground>
</template>

<script setup lang="ts">
import Loader from '@/components/utils/Loader.vue'

import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

import GoBack from '@/components/connections/connection/GoBack.vue'

import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useParcelStore } from '@/stores/parcel'
import ParcelForm from '@/components/connections/parcel/ParcelForm.vue'
import Parcel from '@/components/connections/parcel/Parcel.vue'
import Purchase from '@/components/connections/parcel/Purchase.vue'
import TransparentBackground from '@/components/utils/TransparentBackground.vue'
import FormError from '@/components/connections/parcel/FormError.vue'
import { useResolutionStore } from '@/stores/resolutionStore'

const resolution = useResolutionStore()
const route = useRoute()
const fetching = ref(true)
const parcel = useParcelStore()
const app = useAppStore()
const isLeaving = ref(false)

const handleBeforeUnload = () => {
  parcel.setCookies()
}

onBeforeMount(async () => {
  parcel.init(route)

  try {
    await parcel.getConnection(String(route.params.connectionID))
 
  } catch {
    router.push({ name: 'connections' })
  } finally {
    fetching.value = false
    parcel.getCookies()

    window.addEventListener('beforeunload', handleBeforeUnload)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteLeave(() => {
  isLeaving.value = true
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
