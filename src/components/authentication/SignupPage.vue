<template>
  <transition name="fade-down" appear>
    <div class="flex flex-col">
      <p :i="0" class="text-3xl text-white mt-[40px] font-bold text-center">
        {{ t('authentication.singup.message') }}
      </p>
      <p :i="1" class="text-gray-500 text-lg mt-[10px] text-center">
        {{ t('authentication.description') }}
      </p>
    </div>
  </transition>

  <RouterView />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.fade-down-enter-active {
  transition: all 0.2s ease-in;
}

.fade-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
