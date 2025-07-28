<template>
  <img
    src="/delete-white.svg"
    alt=""
    class="flex bg-zinc-700/60 hover:bg-red-600 image size-[40px] rounded-lg cursor-pointer transition-all duration-200 p-[7px] opacity-60 hover:opacity-100"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>

<style scoped>
.image {
  width: 100%;
}
@media (min-width: 300px) {
  .image {
    width: 40px;
  }
}
</style>
