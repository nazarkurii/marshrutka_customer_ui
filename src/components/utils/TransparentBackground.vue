<template>
  <transition name="fade">
    <div
      v-if="condition"
      @click="close"
      class="flex fixed backdrop-blur-xs w-full h-full top-0 left-0 rounded-2xl items-center justify-center bg-black/50 z-[500]"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  close: () => void
  condition: boolean
}>()
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in;
}
</style>
