<template>
  <div class="mb-[70px] h-[90px]">
    <transition appear :name="'range'">
      <SearchResultRange
        v-if="!isLeaving && !requestingFirstTime"
        :requesting="requesting"
        :left="result.leftRange"
        :right="result.rightRange"
        :current="{
          date: route.params.date as string,
          number: result.connections.length,
          minPrice: result.connections.length
            ? result.connections.reduce((prev, curr) => {
                return prev.price > curr.price ? prev : curr
              }).price
            : 0,
          available: result.connections.findIndex((value) => value.available) != -1,
        }"
      />
    </transition>
  </div>

  <div class="flex min-h-[270px]">
    <transition name="result" mode="out-in">
      <Loader v-if="requesting && !isLeaving" class="my-auto" />
      <div
        v-else-if="!result.connections.length && !requesting && !isLeaving"
        class="flex flex-col gap-[20px] items-center"
      >
        <img src="/crying-face.webp" alt="" class="size-[200px] rounded-full" />
        <p class="text-white text-3xl text-wrap text-center px-[20px] font-bold">
          {{ t('connections.result.empty') }}
        </p>
      </div>
      <div v-else-if="!requesting && !isLeaving" class="flex flex-col gap-[30px]">
        <FoundConnectionElem
          :connection="connection"
          v-for="connection in result.connections"
          :key="connection.id"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  emptyFindConnectionsResponse,
  type ConnectionsRange,
  type FoundConnection,
} from '@/scripts/connections'

import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import SearchResultRange from './SearchResultRange.vue'
import Loader from '@/components/utils/Loader.vue'
import { Problem } from '@/scripts/errors'
import axios from 'axios'
import FoundConnectionElem from '../transport_search/FoundConnection.vue'
import { useI18n } from 'vue-i18n'
import { previousRouteName } from '@/router'
import { useConnectionRequestStore } from '@/stores/search'
import { useAppStore } from '@/stores/app'

const requesting = ref(true)
const result = reactive(emptyFindConnectionsResponse)
const route = useRoute()
const requestingFirstTime = ref(true)
const searchStore = useConnectionRequestStore()
onBeforeMount(search)
const { t } = useI18n()
const app = useAppStore()
async function search() {
  try {
    requesting.value = true
    const {
      data,
    }: {
      data: {
        connections: FoundConnection[] | null
        leftRange: ConnectionsRange[] | null
        rightRange: ConnectionsRange[] | null
      }
    } = await axios.get(
      `connections/${route.params.from}/${route.params.to}/${route.params.date}/${route.params.adults}/${route.params.children}/${route.params.teenagers}`,
      {
        params: {
          range: 3,
        },
      },
    )

    result.connections = data.connections ? data.connections : []
    result.leftRange = data.leftRange ? data.leftRange : []
    result.rightRange = data.rightRange ? data.rightRange : []
  } catch (err) {
    new Problem(err)
  } finally {
    requesting.value = false

    requestingFirstTime.value = false
  }
}

watch(() => route.params, search)

var isLeaving = ref(false)
onBeforeRouteLeave(() => {
  isLeaving.value = true
})

onMounted(async () => {
  const container = document.getElementById('appContainer')
  container?.scrollTo({
    top: 0, // scrolls to the very bottom
    behavior: 'smooth', // smooth animation
  })
})
</script>

<style scoped>
.result-leave-active,
.result-enter-active {
  transition: all 0.2s ease-in;
}

.result-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  scale: 0.8;
}
.result-enter-from {
  opacity: 0;
  transform: translateY(100px);
  scale: 0.8;
}

.range-leave-active,
.range-enter-active {
  transition: all 0.2s ease-in;
}
.range-leave-to,
.range-enter-from {
  opacity: 0;
  transform: scaleX(0);
}
</style>
