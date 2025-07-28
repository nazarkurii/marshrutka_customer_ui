<template>
  <div
    id="range"
    :class="{
      'justify-center w-[calc(100vw-20px)]': resolution.width >= 1550,
      ' w-full': resolution.width < 1550,
    }"
    class="flex overflow-x-auto overflow-y-visible h-fit relative bg-zinc-800 gap-[20px] p-[10px]"
  >
    <RangeElem
      v-for="(value, i) in range"
      :key="i"
      :value="value"
      :current="value.date === current.date"
      :id="String(i)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import RangeElem from './RangeElem.vue'
import type { ConnectionsRange } from '@/scripts/connections'
import { nextTick } from 'vue'
import { useResolutionStore } from '@/stores/resolutionStore'

const props = defineProps<{
  left: ConnectionsRange[]
  right: ConnectionsRange[]
  current: ConnectionsRange
  requesting: boolean
}>()

const range = computed(() => {
  return [...props.left, props.current, ...props.right]
})

const changes = ref(0)
function changeRange() {
  range.value.forEach((_, i) => {
    const elem = document.getElementById(String(i))
    if (elem) {
      elem.style.animation = `none`
      setTimeout(() => {
        elem.style.animation = `change 0.4s ${0.1 * i}s forwards`
      }, 10)
    }
  })
  changes.value++
}

watch(
  () => props.requesting,
  (value: boolean) => {
    if (value) {
      changeRange()
    } else {
      setScroll()
    }
  },
)

const resolution = useResolutionStore()

async function setScroll() {
  await nextTick()

  const container = document.getElementById('range')
  if (container) {
    container.scrollTo({
      left: (container.scrollWidth - container.clientWidth) / 2,
      behavior: 'smooth',
    })
  }
}

onMounted(setScroll)

watch(() => resolution.width, setScroll)
</script>

<style>
@keyframes change {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-200px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
