<template>
  <div
    @click="focused = !focused"
    ref="dropdownRef"
    :class="{
      'grip-position': !positionDisabled,
      'position-disabled ': positionDisabled,
      'outline-amber-600 outline-[3px]': focused,
    }"
    class="flex rounded-l-2xl cursor-pointer input-bg px-[20px] w-full"
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
      <option value="Ukraine">🇺🇦 {{ t('countries.Ukraine') }}</option>
      <option value="Poland">🇵🇱 {{ t('countries.Poland') }}</option>
      <option value="Germany">🇩🇪 {{ t('countries.Germany') }}</option>
      <option value="Czechia">🇨🇿 {{ t('countries.Czechia') }}</option>
      <option value="Estonia">🇪🇪 {{ t('countries.Estonia') }}</option>
      <option value="Latvia">🇱🇻 {{ t('countries.Latvia') }}</option>
      <option value="Lithuania">🇱🇹 {{ t('countries.Lithuania') }}</option>
      <option value="Slovakia">🇸🇰 {{ t('countries.Slovakia') }}</option>
      <option value="Hungary">🇭🇺 {{ t('countries.Hungary') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useConnectionRequestStore } from '@/stores/search'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  exclude: string
  preload: string
  positionDisabled?: boolean
}>()

const value = ref(props.preload)
const emit = defineEmits(['model'])
const focused = ref(false)
const { t } = useI18n()

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
  value.value = request.from
})
</script>

<style scoped>
@media (max-width: 1050px) {
  .grip-position {
    grid-column: span 2 / span 2;
    border-radius: var(--radius-2xl) 0 0 0;
  }
}

@media (max-width: 770px) {
  .grip-position {
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  }

  .position-disabled {
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  }

  .search {
    grid-column: span 2 / span 2;
    border-radius: var(--radius-2xl);
  }
}
</style>
