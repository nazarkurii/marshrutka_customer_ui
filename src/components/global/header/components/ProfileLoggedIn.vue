<template>
  <div
    :class="{
      'w-[250px] ': route.path.includes('profile') && resolution.width > 700,
      'w-[140px] ': !route.path.includes('profile') && resolution.width > 700,
      'w-[100px] ': route.path.includes('profile') && resolution.width <= 700,
      'w-[50px] ': !route.path.includes('profile') && resolution.width <= 700,
    }"
    class="flex gap-[10px] mr-[20px] transition-all duration-300"
  >
    <div
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="!route.path.includes('profile') ? router.push({ name: 'general' }) : ''"
      :class="{
        'w-[45px] rounded-full': resolution.width <= 700,
        'bg-white/10': (isHovered || route.path.includes('profile')) && resolution.width <= 700,
      }"
      class="flex gap-[10px] rounded-xl transition-all justify-center duration-200 select-none cursor-pointer relative"
    >
      <div>
        <p
          v-if="resolution.width > 700 && user.firstName"
          :class="{
            'bg-white/10': isHovered || route.path.includes('profile'),
          }"
          class="text-white font-bold min-w-[90px] mr-[25px] rounded-xl p-[10px] pr-[33px]"
        >
          {{ user.firstName }}
        </p>
        <Loader class="mr-[70px] mt-[5px]" v-else-if="resolution.width > 700" :size="33" />
      </div>
      <img
        :class="{
          'size-[50px] right-0 top-[-4px]': resolution.width > 700,
          'size-[30px] top-[5px]': resolution.width <= 700,
        }"
        :src="'/avatar.webp'"
        alt="profile2"
        class="absolute"
      />
    </div>
    <transition name="logout">
      <div
        v-if="route.path.includes('profile')"
        @click="logout"
        class="flex gap-[10px] hover:bg-white/10 rounded-xl p-[10px] h-[50px] transition-all duration-200 select-none cursor-pointer"
      >
        <img src="/logout.png" alt="profile" class="size-[25px]" />
        <p v-if="resolution.width > 700" class="text-white font-bold">{{ t('navbar.logout') }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Loader from '@/components/utils/Loader.vue'
import { Problem } from '@/scripts/errors'
import { userTemplate, type User } from '@/scripts/user'
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'
import axios from 'axios'
import { onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const router = useRouter()
const route = useRoute()
const resolution = useResolutionStore()

const { t } = useI18n()

const isHovered = ref(false)
let user = reactive<User>(userTemplate)

onBeforeMount(async () => {
  try {
    const { data }: { data: { user: User } } = await axios.get('')
    user.imageUrl = data.user.imageUrl
    user.firstName = data.user.firstName
  } catch (err) {
    new Problem(err)
  }
})

function logout() {
  const app = useAppStore()
  app.logout()
  const { cookies } = useCookies()
  cookies.remove('token')
  router.push({ name: 'connections' })
}
</script>

<style scoped>
.logout-leave-active,
.logout-enter-active {
  transition: all 0.2s ease-in;
}

.logout-leave-to,
.logout-enter-from {
  opacity: 0;
  width: 0;
  font-size: 0;
  overflow: clip;
}
</style>
