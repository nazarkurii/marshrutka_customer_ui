<template>
  <div
    class="flex w-full input-bg text-white text-xl font-bold items-center rounded-lg justify-center"
  >
    {{ displayCountry }}
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { adressTemplate } from '@/scripts/adresses'
import { countries } from '@/scripts/countries'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  country: string
}>()

const { t } = useI18n()
const emit = defineEmits(['model'])

// Reactive address object
const adress = reactive(adressTemplate)

// Countries list with flags

// Watch for changes in the address and emit model updates
watch(adress, () => {
  emit('model', adress)
})

// Computed property to get the display text with flag
const displayCountry = computed(() => {
  const countryObj = countries.find((c) => c.name === props.country)
  return countryObj ? `${countryObj.flag} ${t('countries.' + countryObj.name)}` : props.country
})
</script>
