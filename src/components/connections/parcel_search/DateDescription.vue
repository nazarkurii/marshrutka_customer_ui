<template>
  <transition name="discription">
    <div
      v-if="connection.usable && active"
      :class="{
        ' shadow-2xl shadow-black': shadow,
      }"
      class="flex flex-col text-lg shadow-2xl input-bg rounded-xl z-[50] p-[10px]"
    >
      <div
        v-if="parcel.volume <= connection.luggageVolumeLeft"
        class="article items-center gap-[10px] justify-center"
      >
        <p class="w-fit text-green-500 font-bold">{{ parcel.calcPrice(connection) }}€</p>
      </div>

      <div class="article items-center gap-[10px] justify-between">
        <p class="text-nowrap text-white/60">{{ t('package.maxWidth') }}:</p>
        <p class="text-orange-600 font-bold">{{ connection.maxWidth + t('cm') }}</p>
      </div>
      <div class="article items-center gap-[10px] justify-between">
        <p class="text-nowrap text-white/60">{{ t('package.maxHeight') }}:</p>
        <p class="text-orange-600 font-bold">
          {{ connection.maxHeight + t('cm') }}
        </p>
      </div>
      <div class="article items-center gap-[10px] justify-between">
        <p class="text-nowrap text-white/60">{{ t('package.maxLength') }}:</p>
        <p class="text-orange-600 font-bold">
          {{ connection.maxLength + t('cm') }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { ConnectionParcel } from '@/scripts/connections'
import { useParcelStore } from '@/stores/parcel'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useI18n } from 'vue-i18n'

defineProps<{
  connection: ConnectionParcel
  active: boolean
  shadow: boolean
}>()

const { t } = useI18n()
const resolution = useResolutionStore()
const parcel = useParcelStore()
</script>

<style scoped>
.discription-leave-to,
.discription-enter-from {
  opacity: 0;
  transform: translateY(50px);
  scale: 0;
}

.discription-leave-active,
.discription-enter-active {
  transition: all 0.2s ease-in;
}

.article {
  display: flex;
}

@media (max-width: 310px) {
  .article {
    flex-direction: column;
  }
}
</style>
