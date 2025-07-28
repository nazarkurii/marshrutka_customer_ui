<template>
  <div
    id="container"
    @click="closeFunc"
    :class="{
      absolute: !fixed,
      fixed: fixed,
    }"
    class="flex backGround py-[60px] overflow-y-auto backdrop-blur-sm bg-neutral-900/50 p-[20px] justify-center items-center"
  >
    <div @click.stop class="flex flex-col gap-[20px] m-auto h-fit overflow-y-auto">
      <div class="overflow-x-clip">
        <slot></slot>
      </div>

      <transition name="fade" appear>
        <button
          v-if="!hideCancel"
          type="button"
          @click="closeFunc"
          :style="{
            width: '100%',
          }"
          class="flex hover:bg-zinc-500/20 px-[10px] ml-auto z-10 text-zinc-400 justify-center hover:text-white items-center h-[50px] py-[10px] rounded-xl cursor-pointer transition-all transition-[width] duration-200 border border-zinc-700"
        >
          {{ t('cancel') }}
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    closeFunc: () => void

    hideCancel?: boolean
    fixed?: boolean
  }>(),
  {
    hideCancel: false,
    fixed: false,
  },
)

const { t } = useI18n()
</script>

<style scoped>
.backGround {
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  top: -30px;
  left: -30px;
}

@media (min-width: 900px) {
  .backGround {
    border-radius: var(--radius-2xl);
    width: 100%;
    height: 100%;
    top: calc(var(--spacing) * 0);
    left: calc(var(--spacing) * 0);
  }
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 0.7;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease-in;
}
</style>
