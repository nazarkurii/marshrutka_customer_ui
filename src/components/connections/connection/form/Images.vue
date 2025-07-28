<template>
  <div class="flex w-full max-w-[730px] overflow-auto rounded-2xl mx-auto">
    <img class="h-[300px]" :src="url" alt="" :key="i" v-for="(url, i) in formatedUrls" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const props = defineProps<{
  urls: string[]
}>()

var formatedUrls = ref(props.urls.map((url) => import.meta.env.VITE_API_URL + url))
</script>

<style scoped></style>
