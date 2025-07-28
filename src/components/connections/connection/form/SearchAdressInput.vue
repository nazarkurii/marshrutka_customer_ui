<template>
  <form @submit.prevent="enterPressed" ref="dropdownRef" class="flex flex-col relative">
    <Input
      @click="available ? (searchActive = true) : false"
      :input-bg="true"
      :name="name"
      :available="available"
      :unavailable-message="unavailableMessage"
      type="text"
      v-model="localValue"
      :invalid="firstTry ? false : localValue == ''"
      class="z-30"
    />
    <div
      v-if="searchActive && localValue?.length"
      class="flex w-full text-gray-300 text-xm rounded-b-xl h-fit bg-zinc-700 absolute top-[40px] z-20 flex-col p-[10px]"
    >
      <div v-if="!searching" class="flex w-full text-gray-300 text-xm h-fit flex-col mt-[20px]">
        <div v-if="searchResults.length" class="flex w-full flex-col">
          <pc
            @click="
              () => {
                emit('update:modelValue', result)
                emitedValue = result.description
                localValue = result.description
                searchActive = false
                searchResults = []
              }
            "
            class="cursor-pointer hover hover:bg-zinc-600/60 h-[50px] rounded-lg px-[10px] items-center flex transition-all duration-200"
            v-for="result in searchResults"
            >{{ result.description }}</pc
          >
        </div>
        <div v-else class="flex gap-[20px] items-center mx-auto">
          <p class="text-xl font-bold">{{ nonExistingMessage }}</p>
          <img src="/crying-face.webp" alt="" class="size-[40px] rounded-full" />
        </div>
      </div>
      <Loader v-else="localValue?.length && searching" :size="50" class="mt-[20px]" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Input from '@/components/utils/Input.vue'
import Loader from '@/components/utils/Loader.vue'
import type { SearchResult } from '@/scripts/countries'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Named model support (city or street)
const props = defineProps<{
  modelValue?: string
  firstTry: boolean
  name: string
  available: boolean
  unavailableMessage?: string
  nonExistingMessage: string
  searchFunc: (searchVal: string | undefined) => Promise<SearchResult[]>
}>()

const emit = defineEmits(['update:modelValue', 'update:city', 'update:street'])

// Use one of the props depending on which v-model is used
const localValue = ref(props.modelValue)
const emitedValue = ref('')
const searchActive = ref(false)
const searching = ref(false)
const searchResults = ref<SearchResult[]>([])

async function search() {
  if (!searchActive.value) return
  searching.value = true
  const results = await props.searchFunc(localValue.value)
  searchResults.value = results
  searching.value = false
}

function enterPressed() {
  if (searchActive.value && searchResults.value.length) {
    emit('update:modelValue', searchResults.value[0])
    emitedValue.value = searchResults.value[0].description
    localValue.value = searchResults.value[0].description
    searchActive.value = false
    searchResults.value = []
  }
}

const dropdownRef = ref<HTMLElement | null>(null)
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    searchActive.value = false
    if (!emitedValue.value) {
      localValue.value = ''
    }
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

watch(localValue, () => {
  if (!localValue.value) {
    emit('update:modelValue', '')
    emitedValue.value = 'result.value'
    localValue.value = ''
    searchResults.value = []
  } else {
    search()
  }
})

watch(
  () => props.available,
  () => {
    emit('update:modelValue', '')
    emitedValue.value = 'result.value'
    localValue.value = ''
    searchActive.value = false
    searchResults.value = []
  },
)
</script>

<style scoped></style>
