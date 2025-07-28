<template>
  <transition name="fade-down" appear>
    <div class="flex flex-col">
      <p class="text-3xl text-white mt-[40px] font-bold text-center">
        {{ t('authentication.login.message') }}
      </p>
      <p class="text-gray-500 text-lg mt-[10px] text-center">
        {{ t('authentication.description') }}
      </p>
    </div>
  </transition>
  <form
    @submit.prevent="incorrectData ? false : login()"
    class="flex flex-col py-[20px] mt-[40px] max-w-[470px] w-full items-center gap-[20px]"
  >
    <GoogleButton type="login" />
    <p class="text-white text-lg">{{ t('authentication.or') }}</p>
    <Input
      image-path="/email.svg"
      name="Email"
      type="email"
      :violated="firstTry ? false : !validation.email"
      :invalid="incorrectData"
      v-model="credentials.email"
      :model-function="
        () => {
          incorrectData = false
        }
      "
    />
    <div class="flex w-full relative">
      <Input
        image-path="/password.svg"
        :is-password="true"
        :violated="firstTry ? false : !validation.password"
        :name="t('authentication.password')"
        :invalid="incorrectData"
        type="password"
        v-model="credentials.password"
        :model-function="
          () => {
            incorrectData = false
          }
        "
      />
      <a
        v-if="resolution.width > 350"
        class="text-blue-500 underline hover:text-blue-600 cursor-pointer absolute bottom-[5px] right-[10px]"
        @click="router.push({ name: 'forgotPassword' })"
        >{{ t('authentication.login.forgotPassword.link') }}</a
      >
    </div>

    <div
      v-if="incorrectData"
      class="flex flex-col p-[20px] bg-zinc-800 rounded-xl w-full h-fit items-center"
    >
      <p class="text-red-500 text-lg text-center">
        {{ t('authentication.login.problem') }}
      </p>
    </div>

    <ActiveButton
      :is-loading="processing"
      type="submit"
      :active="validation.email && validation.password && !incorrectData"
      :name="t('authentication.login.name')"
    />
    <div class="flex gap-[5px] changeForm items-center">
      <a
        v-if="resolution.width <= 350"
        class="text-blue-500 underline hover:text-blue-600 cursor-pointer"
        @click="router.push({ name: 'forgotPassword' })"
        >{{ t('authentication.login.forgotPassword.link') }}</a
      >
      <p class="text-white">{{ t('authentication.login.changeFormMessage') }}</p>
      <a
        class="text-blue-500 underline hover:text-blue-600 cursor-pointer"
        @click="router.push({ name: 'singup' })"
        >{{ t('authentication.singup.name') }}</a
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GoogleButton from './general/GoogleButton.vue'
import Input from '../utils/Input.vue'
import ActiveButton from '../global/utils/ActiveButton.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Problem } from '@/scripts/errors'
import { useAppStore } from '@/stores/app'
import { useCookies } from 'vue3-cookies'
import { useResolutionStore } from '@/stores/resolutionStore'
import type { UnloggedinTicketSelectionAttemt } from '@/scripts/authentication'

const { t } = useI18n()
const router = useRouter()

const credentials = reactive({
  password: '',
  email: '',
})

const processing = ref(false)
const firstTry = ref(true)
const incorrectData = ref(false)

const validation = computed(() => {
  const emailValid = /^[A-Za-z0-9._]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/.test(credentials.email)

  return { email: emailValid, password: credentials.password.length > 0 }
})

async function login() {
  firstTry.value = false
  if (validation.value.email && validation.value.password) {
    incorrectData.value = false
    processing.value = true

    try {
      const { data }: { data: { token: string } } = await axios.post('/login', credentials)
      const { cookies } = useCookies()
      cookies.set('token', data.token, '30d')
      axios.defaults.headers.common.Authorization = data.token
      const app = useAppStore()
      app.login(true)
    } catch (err) {
      const problem = new Problem(err)
      if (problem.status == 400 || problem.status == 401) {
        setTimeout(() => {
          incorrectData.value = true
          processing.value = false
        }, 1000)
      } else {
        router.push({ name: 'internalServerError' })
      }
    }
  }
}

const resolution = useResolutionStore()
</script>

<style scoped>
@media (max-width: 350px) {
  .changeForm {
    flex-direction: column;
  }
}
.fade-down-enter-active {
  transition: all 0.3s ease-in;
}

.fade-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
