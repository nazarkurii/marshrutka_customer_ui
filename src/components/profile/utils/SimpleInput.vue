<template>
  <input
    type="text"
    v-model="value"
    :placeholder="name"
    :class="{
      'text-white': value,
      'text-slate-400 placeholder-slate-400': !value && ticket.firstTry,
      red: !value && !ticket.firstTry,
    }"
    class="outline-none w-full disabled:cursor-not-allowed input-bg transition-all duration-200 flex items-center justify-between h-[40px] rounded-lg px-[10px]"
  />
</template>

<script setup lang="ts">
import { useTicketStore } from '@/stores/ticket'
import { onBeforeMount, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  type: string
  selected: string | undefined
}>()

const emit = defineEmits(['model'])
const value = ref('')

const ticket = useTicketStore()

watch(value, () => {
  emit('model', value.value)
})

onBeforeMount(() => {
  if (props.selected) {
    value.value = props.selected
  }
})
</script>

<style scoped>
.red {
  color: var(--color-red-500);
}
</style>
