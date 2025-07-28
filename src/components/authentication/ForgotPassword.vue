<template>
  <transition name="fade-down" appear>
    <div>
      <p class="text-3xl text-white mt-[40px] font-bold text-center">
        {{ t('authentication.login.forgotPassword.name') }}
      </p>
      <p class="text-gray-500 text-lg mt-[10px] text-center">
        {{ t('authentication.description') }}
      </p>
    </div>
  </transition>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Input from '../utils/Input.vue'

const { t } = useI18n()
</script>

<style scoped>
.fade-down-enter-active {
  transition: all 0.3s ease-in;
}

.fade-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
