<template>
  <div class="flex justify-center items-center inset-0 absolute input-bg rounded-xl">
    <Loader v-if="requesting" />
    <Error v-else-if="errorOccured" class="scale-75" />
    <div v-else-if="success" class="flex gap-[10px] size-[100px]">
      <img src="/success.svg" alt="" />
    </div>
    <div v-else class="flex flex-col items-center gap-[20px]">
      <p class="text-white">
        {{ t('areYouSure') }}
      </p>
      <div class="flex gap-[10px]">
        <button
          @click.stop="cancel"
          class="flex hover:bg-zinc-500/10 w-[100px] ml-auto text-zinc-400 justify-center hover:text-white items-center h-[40px] rounded-lg cursor-pointer transition-all duration-200 border border-zinc-700"
        >
          {{ t('cancel') }}
        </button>
        <button
          @click.stop="submitDelete"
          class="flex hover:bg-red-500/60 hover:border-red-500/60 w-[100px] ml-auto text-zinc-400 justify-center hover:text-white items-center h-[40px] rounded-lg cursor-pointer transition-all duration-200 border border-zinc-700"
        >
          {{ t('delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loader from '@/components/utils/Loader.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Error from './Error.vue'
import type { Problem } from '@/scripts/errors'

const props = defineProps<{
  submit: () => Promise<Problem | null>
  cancel: () => void
}>()

const { t } = useI18n()
const requesting = ref(false)
const errorOccured = ref(false)
const success = ref(false)

async function submitDelete() {
  requesting.value = true
  const problem = await props.submit()

  if (problem) {
    errorOccured.value = true
  } else {
    success.value = true
  }

  setTimeout(() => {
    requesting.value = false
    setTimeout(() => {
      props.cancel()
    }, 1000)
  }, 1000)
}
</script>

<style scoped></style>
