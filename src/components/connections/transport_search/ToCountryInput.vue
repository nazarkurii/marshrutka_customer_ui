<template>
  <div
    :class="{
      'grid-position': !positionDisabled,
      'position-disabled ': positionDisabled,
      'outline-amber-600 outline-[3px]': focused,
    }"
    @click="focused = !focused"
    ref="dropdownRef"
    class="flex input-bg cursor-pointer px-[20px] w-full transition-all duration-100"
  >
    <select
      @change="
        () => {
          emit('model', value)
        }
      "
      v-model="value"
      class="text-white h-[60px] cursor-pointer outline-none w-full text-lg input"
    >
      <option v-if="from != 'Ukraine'" value="Ukraine">🇺🇦 {{ t('countries.Ukraine') }}</option>
      <option v-if="from != 'Poland' && from == 'Ukraine'" value="Poland">
        🇵🇱 {{ t('countries.Poland') }}
      </option>
      <option v-if="from != 'Germany' && from == 'Ukraine'" value="Germany">
        🇩🇪 {{ t('countries.Germany') }}
      </option>
      <option v-if="from != 'Czechia' && from == 'Ukraine'" value="Czechia">
        🇨🇿 {{ t('countries.Czechia') }}
      </option>
      <option v-if="from != 'Estonia' && from == 'Ukraine'" value="Estonia">
        🇪🇪 {{ t('countries.Estonia') }}
      </option>
      <option v-if="from != 'Latvia' && from == 'Ukraine'" value="Latvia">
        🇱🇻 {{ t('countries.Latvia') }}
      </option>
      <option v-if="from != 'Lithuania' && from == 'Ukraine'" value="Lithuania">
        🇱🇹 {{ t('countries.Lithuania') }}
      </option>
      <option v-if="from != 'Slovakia' && from == 'Ukraine'" value="Slovakia">
        🇸🇰 {{ t('countries.Slovakia') }}
      </option>
      <option v-if="from != 'Hungary' && from == 'Ukraine'" value="Hungary">
        🇭🇺 {{ t('countries.Hungary') }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useConnectionRequestStore } from '@/stores/search'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps<{
  from: string
  preload: string
  positionDisabled?: boolean
}>()

const { t } = useI18n()
const value = ref(props.preload)

const emit = defineEmits(['model'])
const focused = ref(false)
watch(
  () => props.from,
  (country: string) => {
    if (country != 'Ukraine') {
      value.value = 'Ukraine'
      emit('model', 'Ukraine')
    } else if (value.value == 'Ukraine') {
      value.value = 'Poland'
      emit('model', 'Poland')
    }
  },
)

const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    focused.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const request = useConnectionRequestStore()
watch(request, () => {
  value.value = request.to
})
</script>

<style scoped>
@media (max-width: 1050px) {
  .grid-position {
    grid-column: span 2 / span 2;
    border-radius: 0 var(--radius-2xl) var(--radius-2xl) 0;
  }
}

@media (max-width: 770px) {
  .grid-position {
    border-radius: 0;
  }

  .position-disabled {
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }
}
</style>
