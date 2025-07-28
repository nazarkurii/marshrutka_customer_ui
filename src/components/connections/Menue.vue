<template>
  <div class="px-[10px]">
    <div class="flex h-[110px] py-[20px] bg rounded-2xl w-full max-w-[400px] mx-auto relative">
      <div
        :style="{
          transform: value == 'transport' ? 'translateX(10px)' : 'translateX(calc(100% + 30px))',
        }"
        class="absolute z-0 transition-all duration-200 w-[calc(50%-20px)] bg-white/9 h-[90px] top-[10px] rounded-2xl"
      ></div>
      <div
        @click="(router.push({ name: 'transport' }), (value = 'transport'))"
        @mouseenter="transportHovered = true"
        @mouseleave="transportHovered = false"
        class="flex w-full mx-[10px] cursor-pointer"
      >
        <div class="z-10 mx-auto size-[75px]">
          <img
            v-if="!transportHovered && !route.path.includes('transport')"
            src="/transport.svg"
            alt=""
          />
          <img v-else src="/transport-orange.svg" alt="" />
        </div>
      </div>

      <div
        @click="(router.push({ name: 'parcel' }), (value = 'parcel'))"
        @mouseenter="packageHovered = true"
        @mouseleave="packageHovered = false"
        class="flex w-full cursor-pointer mx-[10px]"
      >
        <div class="z-10 size-[72px] mx-auto">
          <img v-if="!packageHovered && !route.path.includes('parcel')" src="/package.svg" alt="" />
          <img v-else src="/package-orange.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

const transportHovered = ref(false)
const packageHovered = ref(false)
const route = useRoute()
const router = useRouter()

const value = ref('')
watchEffect(() => {
  value.value = route.path.includes('transport') ? 'transport' : 'parcel'
})
</script>

<style scoped>
.bg {
  background-color: #2e3035be;
}
</style>
