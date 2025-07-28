<template>
  <div
    :class="{
      'items-center pt-[20px]  flex-col': resolution.width >= 770,
      ' flex-col-reverse ': resolution.width < 770,
    }"
    :style="{
      minHeight: `${route.name == 'parcelDate' ? (resolution.width >= 770 ? 780 : 600) : 630}px`,
    }"
    class="flex w-full transition-all duration-300"
  >
    <SearchBar
      v-if="resolution.width >= 770 ? true : route.name == 'parcelSize'"
      :class="{
        ' mt-[30px] ': resolution.width < 770,
        ' mb-[70px]': resolution.width >= 770,
      }"
      :package-size="parcel"
    />
    <div
      :class="{
        ' items-center ': resolution.width < 770,
        ' gap-[100px]': resolution.width >= 770,
      }"
      class="flex w-full h-fit max-w-[950px] con px-[10px]"
    >
      <div
        :class="{
          'mt-[60px] gap-[70px]': resolution.width >= 770,
        }"
        class="flex w-full max-w-[400px] flex-col"
      >
        <div v-if="resolution.width >= 770">
          <transition name="package" appear mode="out-in">
            <ParcelMessurements v-if="parcel.type == 'package' && !leave" />
            <img src="/documents-parcel.svg" alt=" " v-else-if="!leave" />
          </transition>
        </div>
        <transition appear name="resize">
          <button
            @click="router.push({ name: 'parcelSize' })"
            v-if="route.name == 'parcelDate' && !leave"
            class="text-white/50 rounded-2xl font-bold text-lg p-[10px] hover:bg-white/10 hover:text-white border-[1px] border-white/20 cursor-pointer transition-all duration-200"
          >
            {{ parcel.type == 'package' ? t('package.resize') : t('back') }}
          </button>
        </transition>
      </div>

      <div class="mb-auto w-full">
        <transition appear name="redactor" mode="out-in">
          <RouterView></RouterView>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResolutionStore } from '@/stores/resolutionStore'

import { nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import ParcelSizeRedactor from './parcel_search/ParcelSizeRedactor.vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import SearchBar from './parcel_search/SearchBar.vue'
import { useAppStore } from '@/stores/app'
import { useParcelStore } from '@/stores/parcel'
import ParcelMessurements from './parcel_search/ParcelMessurements.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const resolution = useResolutionStore()
const parcel = useParcelStore()
const app = useAppStore()
onBeforeMount(async () => {
  setTimeout(() => {
    app.footer = false
  }, 310)
})

const route = useRoute()

const leave = ref(false)
onBeforeRouteLeave(() => {
  leave.value = true
})
</script>

<style scoped>
.textsize {
  font-size: clamp(17px, 4vw, 25px);
}

.redactor-enter-from,
.redactor-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.package-enter-from,
.package-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.resize-enter-from,
.resize-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.resize-enter-active,
.resize-laave-active,
.package-enter-active,
.package-leave-active,
.redactor-enter-active,
.redactor-leave-active {
  transition: all 0.2s ease-in;
}

.con {
  flex-direction: column;
}

@media (min-width: 770px) {
  .con {
    flex-direction: row;
  }
}
</style>
