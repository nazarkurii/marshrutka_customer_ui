<template>
  <div
    @click="focusInput"
    ref="dropdownRef"
    :class="{
      'outline-amber-600 outline-[3px]': focused,
    }"
    class="flex input-bg px-[20px] cursor-pointer"
  >
    <input
      id="departure"
      ref="dateInput"
      v-model="request.time"
      @focus="focused = true"
      @blur="focused = false"
      @change="
        () => {
          focused = false
        }
      "
      type="date"
      class="flex inputWhite cursor-pointer input outline-none text-re h-[60px] w-full select-none mx-auto sm:mx-0"
    />
  </div>
</template>

<script setup lang="ts">
import { getNowLocalTimeForCountry } from '@/scripts/countries'
import { getToday } from '@/scripts/time'
import { useConnectionRequestStore } from '@/stores/search'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['model'])

const focused = ref(false)
const dateInput = ref<HTMLInputElement | null>(null)

// Focus the input when the div is clicked
function focusInput() {
  dateInput.value?.focus()
}

const request = useConnectionRequestStore()
const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    focused.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)

  const input = document.getElementById('departure') as HTMLInputElement

  const route = useRoute()

  if (route.name == 'transport') {
    const localTime = getNowLocalTimeForCountry('Ukraine')

    if (localTime) {
      input.min = localTime.slice(0, 10)
    }
  }

  if (route.name == 'connectionsResult') {
    const localTime = getNowLocalTimeForCountry(String(route.params.from))

    if (localTime) {
      input.min = localTime.slice(0, 10)
    }

    input.value = String(route.params.date)
  }
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.inputRed {
  color: #fb2c36;
}

.inputUssual {
  color: #94a3b8;
}

.inputWhite {
  color: #ffffff;
}

@media (max-width: 1050px) {
  .flex {
    border-radius: 0 0 0 var(--radius-2xl);
  }
}

@media (max-width: 400px) {
  .flex {
    grid-column: span 2 / span 2;
    border-radius: 0;
  }
}
</style>
