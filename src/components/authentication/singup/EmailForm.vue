<template>
  <form
    @submit.prevent="
      () => {
        if (!requesting) {
          verifyEmail()
        }
      }
    "
    class="flex flex-col py-[20px] mt-[40px] max-w-[470px] w-full items-center gap-[20px]"
  >
    <GoogleButton type="singup" />
    <p class="text-white text-lg">{{ t('authentication.or') }}</p>

    <Input
      :violated="firstAtempt ? false : requestError != undefined"
      image-path="/email.svg"
      name="Email"
      type="email"
      v-model="singup.user.email"
    />

    <div
      v-if="requestError || emailExists"
      class="flex p-[20px] bg-zinc-800 rounded-xl w-full h-fit justify-center"
    >
      <p v-if="requestError" class="text-red-500 text-lg text-center">
        {{ requestError?.detail }}
      </p>
      <p v-if="emailExists" class="text-green-500 text-lg text-center">
        {{ t('authentication.singup.email.emailExists') }}
      </p>
    </div>

    <ActiveButton
      :is-loading="requesting"
      :active="isValid.valueOf()"
      type="submit"
      :name="t('authentication.singup.name')"
    />
    <div class="flex gap-[5px]">
      <p class="text-white">{{ t('authentication.singup.changeFormMessage') }}</p>
      <a
        class="text-blue-500 underline hover:text-blue-600 cursor-pointer"
        @click="router.push({ name: 'login' })"
        >{{ t('authentication.login.name') }}</a
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GoogleButton from '../general/GoogleButton.vue'
import Input from '../../utils/Input.vue'
import ActiveButton from '../../global/utils/ActiveButton.vue'
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useSingupStore } from '@/stores/singup'

import type { Problem } from '@/scripts/errors'
import { useCookies } from 'vue3-cookies'

defineProps<{
  changeForm: () => void
}>()

const { t } = useI18n()
const router = useRouter()
const singup = useSingupStore()

const isValid = computed(() => {
  return (
    /^[A-Za-z0-9._]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/.test(singup.user.email) &&
    requestError.value == undefined
  )
})

const requestError = ref<undefined | Problem>(undefined)
const firstAtempt = ref(true)
const emailExists = ref(false)

const requesting = ref(false)
const { cookies } = useCookies()

async function verifyEmail() {
  firstAtempt.value = false
  if (isValid) {
    requestError.value = undefined
    emailExists.value = false
    requesting.value = true
    const singup = useSingupStore()
    const result = await singup.verifyEmail(singup.user.email)

    if (result.problem) {
      setTimeout(() => {
        requesting.value = false
        requestError.value = result.problem
      }, 2000)
    } else if (result.exists) {
      setTimeout(() => {
        requesting.value = false
        emailExists.value = true
      }, 2000)
    } else {
      cookies.set('emailCodeVerificationLink', singup.emailCodeVerificationLink, '10min')
      cookies.set('emailToVerify', singup.user.email, '10min')
      router.push({ name: 'emailVerification' })
    }
  }
}
</script>

<style scoped>
.placeholderColor::placeholder {
  color: #94a3b8;
}
.input {
  width: 150px;
  height: 45px;
  line-height: 30px;
  padding-left: 8px;
  padding-right: 8px;

  border: 2px solid transparent;
  border-radius: 10px;
  outline: none;
  color: white;
  transition: 0.5s ease;
}

.input:focus,
input:hover {
  outline: none;
  border-color: rgba(129, 140, 248);

  box-shadow: 0 0 0 5px rgb(129 140 248 / 30%);
}

.inputRed {
  color: #fb2c36;
}

.inputUssual {
  color: #94a3b8;
}

.inputWhite {
  color: #ffffff;
}
</style>
