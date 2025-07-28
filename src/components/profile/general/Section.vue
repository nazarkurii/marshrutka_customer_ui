<template>
  <div
    :class="{
      'mx-auto input-bg rounded-2xl px-[10px] py-[20px] w-full': resolution.width <= 550,
    }"
    class="flex flex-col"
  >
    <div class="flex w-full justify-between items-center">
      <h1
        :class="{
          'mx-auto': resolution.width <= 550,
        }"
        class="text-white font-bold title"
      >
        {{ name }}
      </h1>
      <button
        v-if="resolution.width > 550"
        @click="editFunc"
        class="text-blue-500 absolute right-[20px] cursor-pointer transition-all duration-200 hover:bg-zinc-800 rounded-xl py-[10px] px-[10px]"
      >
        {{ t('profile.general.edit') }}
      </button>
    </div>
    <p v-if="resolution.width > 550" class="description text-zinc-500 mr-[100px]">
      {{ description }}
    </p>
    <div
      :class="{
        'px-[20px]': resolution.width > 550,
        'px-[10px]': resolution.width <= 550,
      }"
      class="grid info mt-[20px] gap-[20px]"
    >
      <div
        v-for="(row, i) in info"
        :key="i"
        :class="{
          'mr-auto bg-':
            (i % 2 == 0 && resolution.width >= 1050) ||
            (resolution.width < 1050 && resolution.width > 550),
          'ml-auto': i % 2 != 0 && resolution.width >= 1050,

          '  w-full ': resolution.width <= 550,
        }"
        class="truncate"
      >
        <h1 class="text-white font-bold text-lg">{{ row.name }}</h1>
        <p class="text-zinc-500">{{ row.data }}</p>
      </div>
    </div>
    <button
      v-if="resolution.width <= 550"
      @click="editFunc"
      class="text-gray-300 font-bold bg-blue-600 cursor-pointer w-full mt-[10px] transition-all duration-200 rounded-xl py-[10px] justify-center"
    >
      {{ t('profile.general.edit') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useResolutionStore } from '@/stores/resolutionStore'
import { useI18n } from 'vue-i18n'

defineProps<{
  name: string
  description: string
  editFunc: () => void
  info: { name: string; data: string }[]
}>()

const { t } = useI18n()

const resolution = useResolutionStore()
</script>

<style scoped>
.info {
  width: 100%;
}

@media (min-width: 431px) {
  .info {
    width: fit-content;
  }
}

.title {
  font-size: var(--text-xl) /* 1.25rem = 20px */;
  line-height: var(--tw-leading, var(--text-xl--line-height) /* calc(1.75 / 1.25) ≈ 1.4 */);
}
@media (min-width: 1050px) {
  .info {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }
}

@media (min-width: 750px) {
  .title {
    font-size: var(--text-2xl) /* 1.5rem = 24px */;
    line-height: var(--tw-leading, var(--text-2xl--line-height) /* calc(2 / 1.5) ≈ 1.3333 */);
  }
  .description {
    font-size: var(--text-lg) /* 1.125rem = 18px */;
    line-height: var(--tw-leading, var(--text-lg--line-height) /* calc(1.75 / 1.125) ≈ 1.5556 */);
  }
}
</style>
