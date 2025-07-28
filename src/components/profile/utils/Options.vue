<template>
  <div class="flex options gap-[10px] h-fit">
    <button
      :class="{
        'bg-zinc-700/60 hover:bg-zinc-600/60 ': !selected,
        'bg-zinc-700/90 hover:bg-zinc-600/90': selected,
      }"
      @click.stop="editButtonAction"
      class="flex min-w-[70px] text-zinc-400 justify-center hover:text-white px-[10px] items-center h-[40px] rounded-lg cursor-pointer transition-all duration-200"
    >
      {{ t('edit') }}
    </button>
    <Delete @click.stop="deleterOpened = true" />
  </div>
  <Deleter
    @click.stop
    :cancel="
      () => {
        deleterOpened = false
      }
    "
    :submit="deleteSubmitAction"
    v-if="deleterOpened"
  />
</template>

<script setup lang="ts">
import type { Problem } from '@/scripts/errors'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Delete from './Delete.vue'
import Deleter from './Deleter.vue'

withDefaults(
  defineProps<{
    editButtonAction: () => void
    deleteSubmitAction: () => Promise<Problem | null>
    selected?: boolean
  }>(),
  {
    selected: false,
  },
)

const { t } = useI18n()

const deleterOpened = ref(false)
</script>

<style scoped>
.options {
  flex-direction: column;
}
@media (min-width: 300px) {
  .options {
    flex-direction: row;
    margin-left: auto;
  }
}
</style>
