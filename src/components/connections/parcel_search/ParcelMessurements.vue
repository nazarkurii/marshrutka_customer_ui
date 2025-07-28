<template>
  <div v-if="!leave" class="flex w-full h-fit max-w-[400px] my-auto relative textsize font-bold">
    <img src="/package-box.svg" alt="" />
    <transition-group name="fade" appear>
      <p
        :key="0"
        :class="{
          'text-white': !parcel.validation.width,
          'text-red-600': parcel.validation.width,
        }"
        class="absolute bottom-[-10%] right-[-1%] textsize border-dashed border-t-[3px] w-[64%] justify-center flex rotate-[-8deg] border-white"
      >
        {{ Number(parcel.width).toFixed(1) + t('cm') }}
      </p>
      <p
        :key="1"
        :class="{
          'text-white': !parcel.validation.length,
          'text-red-600': parcel.validation.length,
        }"
        class="absolute bottom-[-4%] left-[-6%] textsize border-dashed border-t-[3px] w-[40%] justify-center flex rotate-[28.5deg] border-white"
      >
        {{ Number(parcel.length).toFixed(1) + t('cm') }}
      </p>
      <p
        :key="2"
        :class="{
          'text-white': !parcel.validation.height,
          'text-red-600': parcel.validation.height,
        }"
        class="absolute bottom-[29%] left-[-7%] textsize border-dashed border-b-[3px] w-[70%] justify-center flex rotate-[270deg] border-white"
      >
        {{ Number(parcel.height).toFixed(1) + t('cm') }}
      </p>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useParcelStore } from '@/stores/parcel'
import { useResolutionStore } from '@/stores/resolutionStore'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
const parcel = useParcelStore()

const { t } = useI18n()
const leave = ref(false)

onBeforeRouteLeave((to, from, next) => {
  if (String(to.name) != 'package') {
    leave.value = true
  }
  next()
})

const resolution = useResolutionStore()
const app = useAppStore()
onMounted(async () => {
  const container = document.getElementById('appContainer')
  if (resolution.width >= 770) {
    container?.scrollTo({
      top: container.scrollHeight, // scrolls to the very bottom
      behavior: 'smooth', // smooth animation
    })
  } else {
    container?.scrollTo({
      top: 420, // scrolls to the very bottom
      behavior: 'smooth', // smooth animation
    })
  }
})
</script>

<style scoped>
.textsize {
  font-size: clamp(10px, 100%, 30px);
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

.fade-enter-active,
.package-enter-active,
.package-leave-active,
.redactor-enter-active,
.redactor-leave-active {
  transition: all 0.2s ease-in;
}

.con {
  flex-direction: column-reverse;
  gap: 100px;
}

@media (min-width: 770px) {
  .con {
    flex-direction: row;
  }
}

.fade-enter-from {
  opacity: 0;
}
.fade-enter-t0 {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.2s 0.2s ease-in;
}
</style>
