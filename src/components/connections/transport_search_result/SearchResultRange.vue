<template>
  <div
    id="range"
    :class="containerWidthClass"
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
import { computed, onMounted, nextTick, watch } from 'vue'
import RangeElem from './RangeElem.vue'
import type { ConnectionsRange } from '@/scripts/connections'
import { useResolutionStore } from '@/stores/resolutionStore'

/* ───────────────────────
   Props
──────────────────────── */
const props = defineProps<{
  left: ConnectionsRange[]
  right: ConnectionsRange[]
  current: ConnectionsRange
  requesting: boolean
}>()

/* ───────────────────────
   Browser detection
──────────────────────── */
function isChromium() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Chrome|Chromium|Edg/.test(ua) && !/Firefox/.test(ua)
}

/* ───────────────────────
   Conditional width class
──────────────────────── */
const containerWidthClass = computed(() => (isChromium() ? 'w-[calc(100vw-20px)]' : 'w-screen'))

/* ───────────────────────
   Range data
──────────────────────── */
const range = computed(() => {
  return [...props.left, props.current, ...props.right]
})

/* ───────────────────────
   Scroll logic
──────────────────────── */
async function setScroll() {
  await nextTick()
  const container = document.getElementById('range')
  if (!container) return

  container.scrollTo({
    left: (container.scrollWidth - container.clientWidth) / 2,
    behavior: 'smooth',
  })
}

/* ───────────────────────
   Watchers
──────────────────────── */
watch(
  () => props.requesting,
  (value) => {
    if (!value) {
      setScroll()
    }
  },
)

const resolution = useResolutionStore()
watch(() => resolution.width, setScroll)

/* ───────────────────────
   Lifecycle
──────────────────────── */
onMounted(setScroll)
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
