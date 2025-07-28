<template>
  <div
    :class="{
      'items-center pt-[20px]': resolution.width > 770,
    }"
    class="flex min-h-[600px] flex-col w-full transition-all duration-300"
  >
    <transition name="searchbar" appear>
      <SearchBar
        class="mb-[70px]"
        v-if="
          !isLeaving && (route.name == 'popularDestinations' || route.name == 'connectionsResult')
        "
      />
    </transition>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Menue from '@/components/connections/Menue.vue'
import PopularDestinations from './transport_search/PopularDestinations.vue'
import SearchBar from './transport_search/SearchBar.vue'
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useConnectionRequestStore } from '@/stores/search'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const route = useRoute()
const resolution = useResolutionStore()
const router = useRouter()
const isLeaving = ref(false)
const populatDestinations = ref(true)
const searchBar = ref(true)
onBeforeRouteLeave(() => {
  isLeaving.value = true
})

const app = useAppStore()

onMounted(async () => {
  const container = document.getElementById('appContainer')
  container?.scrollTo({
    top: 0, // scrolls to the very bottom
    behavior: 'smooth', // smooth animation
  })
})
</script>

<style scoped>
.description {
  font-size: 30px;
  line-height: 30px;
  text-align: center;
}

@media (min-width: 400px) {
  .description {
    font-size: 7vw;
    line-height: 7vw;
  }
}

@media (min-width: 670px) {
  .description {
    font-size: 50px;
    line-height: 50px;
  }
}

.leave-leave-active {
  transition: all 0.2s 0.2s ease-out;
}
.leave-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.searchbar-leave-active,
.searchbar-enter-active {
  transition: transform 0.25s ease;
}

.searchbar-leave-to,
.searchbar-enter-from {
  transform: scaleY(0);
}
</style>
