<template>
  <div class="flex flex-1 flex-col max-w-[1530px] gap-[30px] w-full">
    <Header />

    <router-view></router-view>

    <Footer v-if="resolution.width > 1150 && resolution.height" />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/global/footer/Footer.vue'
import Header from '@/components/global/header/Header.vue'
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'

const resolution = useResolutionStore()
const app = useAppStore()
</script>

<style scoped>
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  transition: all 05s ease-in;
}
</style>
