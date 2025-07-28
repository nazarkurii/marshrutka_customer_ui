<template>
  <div
    :style="{
      minHeight: route.path.includes('parcel')
        ? resolution.width >= 770
          ? '1100px'
          : '900px'
        : '1000px',
    }"
    class="flex flex-col h-fit gap-[40px] mb-[20px] transition-all duration-200"
  >
    <transition name="fromtop" appear>
      <p
        v-if="!leave"
        :class="{
          'max-h-[120px]': route.path.includes('connections'),
          'max-h-[20px] opacity-0 scale-0': !route.path.includes('connections'),
        }"
        class="font-extrabold text-white description text-4xl mb-[20px] transition-all duration-200 mx-[10px] h-fit"
      >
        {{ t('connections.search.description') }}
      </p>
    </transition>

    <transition name="fromtop" appear>
      <Menue v-if="!leave" />
    </transition>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Menue from '@/components/connections/Menue.vue'

import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useConnectionRequestStore } from '@/stores/search'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const resolution = useResolutionStore()
const app = useAppStore()
const searchStore = useConnectionRequestStore()
const leave = ref(false)

onBeforeRouteLeave((to, from, next) => {
  if (!to.path.includes('connections')) {
    leave.value = true
  }
  next()
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

/* === TRANSITION STYLES === */
/* .title-enter-active,
.title-leave-active {
  transition: all 0.3s ease;
}

.title-enter-from,
.title-leave-to {
  opacity: 0;

  height: 0;
}

.title-enter-to,
.title-leave-from {
  opacity: 1;
  transform: scale(1);
} */

.fromtop-enter-active,
.fromtop-leave-active {
  transition: all 0.15s 0.1s ease-out;
}
.fromtop-enter-from,
.fromtop-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
