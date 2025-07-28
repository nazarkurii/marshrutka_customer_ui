<template>
  <HeaderSimplified />
  <div class="flex py-[20px] max-w-[550px] w-full items-center flex-col px-[10px]">
    <RouterView></RouterView>
    <transition appear name="fade-up">
      <div class="flex flex-col gap-[5px] items-center">
        <p class="text-gray-400 text-center">{{ t('authentication.legalMessage') }}</p>
        <a
          class="text-blue-500 underline hover:text-blue-600 cursor-pointer"
          @click="router.push({ name: 'legalPolicy' })"
        >
          {{ t('authentication.termsLink') }}
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import GoBack from '@/components/global/go_back/GoBack.vue'
import LanguageCurrency from '@/components/global/header/components/LanguageCurrency.vue'
import Logo from '@/components/global/header/components/Logo.vue'
import HeaderSimplified from '@/components/global/header/HeaderSimplified.vue'
import { watch } from 'vue'

import { useI18n } from 'vue-i18n'

import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()

const router = useRouter()
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.3s ease-in;
}

.fade-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}
</style>
