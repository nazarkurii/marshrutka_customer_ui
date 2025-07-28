<template>
  <div class="h-[85px] z-[21]">
    <div class="flex fixed top-0 left-0 w-[calc(100%-20px)] h-[65px] bg-neutral-900"></div>

    <transition name="header" appear>
      <div
        class="flex fixed w-full max-w-[1530px] bg-neutral-900 top-0 h-[65px] py-[10px] items-center justify-between"
      >
        <div>
          <div
            @click="
              ((profileStore.menueOpened = !profileStore.menueOpened),
              route.path.includes('profile') ? false : router.push({ name: 'profile' }))
            "
            v-if="resolution.width <= 1150"
            :class="{
              'bg-white/10': profileStore.menueOpened,
            }"
            class="flex fixed top-[10px] left-[10px] size-[48px] hover:bg-white/10 hover rounded-xl p-[10px] flex-col transion-all duration-200 cursor-pointer gap-[8px]"
          >
            <p
              v-for="value in [1, 2, 3]"
              :key="value"
              class="w-full h-[4px] m-auto bg-white rounded-lg"
            ></p>
          </div>
          <Logo v-if="route.path.includes('profile') ? resolution.width > 300 : true" />
        </div>
        <div class="flex gap-[10px]">
          <Support />
          <LanguageCurrency />
          <Profile />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'
import LanguageCurrency from './components/LanguageCurrency.vue'
import Logo from './components/Logo.vue'
import Profile from './components/Profile.vue'
import Support from './components/Support.vue'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useRoute, useRouter } from 'vue-router'

const profileStore = useProfileStore()
const resolution = useResolutionStore()
const route = useRoute()
const router = useRouter()
</script>

<style scoped>
.header-enter-from {
  transform: translateY(-100px);
  opacity: 0;
}

.header-enter-active,
.header-leave-active {
  transition: transform 0.3s ease;
}
</style>
