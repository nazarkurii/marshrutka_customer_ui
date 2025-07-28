<template>
  <div
    v-if="!app.loggedIn"
    @click="
      app.loggedIn
        ? !route.path.includes('profile')
          ? router.push({ name: 'general' })
          : ''
        : router.push({ name: 'login' })
    "
    :class="{
      'bg-white/10': route.name == 'profile',
    }"
    class="flex gap-[10px] hover:bg-white/10 rounded-xl p-[10px] transition-all duration-200 select-none mr-[20px] cursor-pointer"
  >
    <img src="/profile.svg" alt="profile" class="size-[25px]" />
    <p v-if="resolution.width > 470" class="text-white font-bold">{{ t('navbar.profile') }}</p>
  </div>
  <ProfileLoggedIn v-else />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'

import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ProfileLoggedIn from './ProfileLoggedIn.vue'
const router = useRouter()
const { t } = useI18n()

const resolution = useResolutionStore()
const route = useRoute()
const app = useAppStore()
</script>

<style scoped></style>
