<template>
  <div class="size-[100%] flex justify-center items-center m-auto rounded-2xl h-full">
    <transition name="content" mode="out-in">
      <Loader v-if="requesting && currentPage < 2" class="m-auto" />
      <Error v-else-if="errorOccured" />
      <Empty v-else-if="totalPages < 1" :description="emptyDescription" />

      <div v-else class="flex flex-col w-full gap-[20px]">
        <div class="adressList w-full gap-[35px] pt-[30px]">
          <slot></slot>
        </div>
        <button
          v-if="!requesting && currentPage < totalPages"
          @click="showMore"
          class="flex mx-auto w-[150px] bg-zinc-700/60 hover:bg-zinc-500/60 min-w-[70px] text-zinc-400 justify-center hover:text-white px-[10px] items-center text h-[40px] rounded-lg cursor-pointer transition-all duration-200"
        >
          {{ t('showMore') }}
        </button>
        <div class=""><Loader v-if="requesting" class="m-auto" :size="50" /></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Error from './Error.vue'
import Empty from './Empty.vue'
import Loader from '@/components/utils/Loader.vue'
import type { Problem } from '@/scripts/errors'

const props = defineProps<{
  request: (page: number) => Promise<{ pages: number; error: Problem | null }>
  emptyDescription: string
}>()

const errorOccured = ref(false)
const requesting = ref(true)
const currentPage = ref(0)
const totalPages = ref(1)
onBeforeMount(async () => {
  await showMore()
})

async function showMore() {
  if (currentPage.value < totalPages.value) {
    requesting.value = true
    currentPage.value++
    const result = await props.request(currentPage.value)
    if (result.error) {
      if (result.error.status != 400) {
        errorOccured.value = true
      }
    }
    totalPages.value = result.pages

    requesting.value = false
  }
}

const { t } = useI18n()
</script>

<style scoped>
.adressList {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.content-leave-active {
  transition: all 0.2s ease-in;
}
.content-enter-active {
  transition: all 0.2s ease-in;
}

.content-leave-to,
.content-enter-from {
  scale: 0.9;
  opacity: 0;
}
</style>
