<template>
  <transition name="content">
    <List v-if="!leaving" :empty-description="t('profile.parcels.empty')" :request="requestParcels">
      <Parcel
        :profile="true"
        v-for="(parcel, i) in parcels"
        :connection="parcel.connection"
        :parcel="parcel.parcel"
        :key="i"
      />
    </List>
  </transition>
</template>

<script setup lang="ts">
import type { ConnectionFull } from '@/scripts/connections'
import { onBeforeMount, ref } from 'vue'
import List from './utils/List.vue'
import axios from 'axios'
import type { Link } from '@/scripts/request'
import { Problem } from '@/scripts/errors'
import { useI18n } from 'vue-i18n'
import Ticket from './tickets/Ticket.vue'
import { useAppStore } from '@/stores/app'
import { onBeforeRouteLeave } from 'vue-router'
import type { CustomerParcel } from '@/scripts/parcels'
import Parcel from '../connections/parcel/Parcel.vue'
import { useResolutionStore } from '@/stores/resolutionStore'

const { t } = useI18n()
const parcels = ref<CustomerParcel[]>([])
const resolution = useResolutionStore()

async function requestParcels(page: number): Promise<{ pages: number; error: Problem | null }> {
  try {
    const { data }: { data: { parcels: CustomerParcel[]; links: Link } } = await axios.get(
      '/parcels?size=4&page=' + page,
    )

    if (data.parcels) {
      parcels.value = [...data.parcels]
    } else {
      parcels.value = []
    }

    return { pages: Object.keys(data.links).length, error: null }
  } catch (err) {
    const problem = new Problem(err, true)
    return { pages: 0, error: problem }
  } finally {
    setTimeout(() => {
      const app = useAppStore()
      if (resolution.height > 940) {
        app.footerON()
      }
    }, 300)
  }
}

const leaving = ref(false)

onBeforeRouteLeave(() => {
  leaving.value = true
})
</script>

<style scoped>
.content-leave-active {
  transition: all 0.1s ease-in;
}
.content-enter-active {
  transition: all 0.2s ease-in;
}

.content-leave-to,
.content-enter-from {
  scale: 0.9;
  opacity: 0;
}
</style>
