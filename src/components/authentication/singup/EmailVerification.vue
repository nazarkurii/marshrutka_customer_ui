<template>
  <form
    @submit.prevent="verifyCode"
    class="flex flex-col py-[20px] mt-[30px] max-w-[470px] w-full items-center gap-[20px]"
  >
    <p class="text-white text-xl text-center mb-[20px]">
      {{ t('authentication.singup.email.verificationMessage') }}
    </p>
    <EmailVerificationCodeInput
      @model="
        (value: string) => {
          code = value
        }
      "
    />
    <div
      v-if="requestError"
      class="flex p-[20px] bg-zinc-800 rounded-xl w-full h-fit justify-center"
    >
      <p class="text-red-500 text-lg text-center">
        {{ t('authentication.singup.email.verificationCodeError') }}
      </p>
    </div>

    <ActiveButton
      :is-loading="requesting"
      :active="isValid"
      type="submit"
      :name="t('authentication.singup.email.sendCodeButton')"
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
import { computed, onBeforeMount, ref } from 'vue'
import EmailVerificationCodeInput from '../../utils/EmailVerificationCodeInput.vue'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { useSingupStore } from '@/stores/singup'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Problem } from '@/scripts/errors'
import { useCookies } from 'vue3-cookies'

const code = ref('')
const isValid = computed(() => {
  return code.value.length == 6
})

const { t } = useI18n()
const { cookies } = useCookies()
const router = useRouter()
const singup = useSingupStore()

const requestError = ref<undefined | Problem>(undefined)
const requesting = ref(false)

async function verifyCode() {
  if (isValid && !requesting.value) {
    requestError.value = undefined
    requesting.value = true
    const problem = await singup.verifyEmailCode(code.value)

    if (problem) {
      if (problem.status == 400 || problem.status == 422) {
        setTimeout(() => {
          requesting.value = false
          requestError.value = problem
        }, 2000)
      } else {
        cookies.remove('emailVerificationToken')
        cookies.remove('emailToVerify')
        cookies.remove('emailCodeVerificationLink')
        router.push('internalServerError')
      }
    } else {
      cookies.set('emailVerificationToken', singup.emailVerificationToken, '15min')
      cookies.set('emailToVerify', singup.user.email, '15min')
      cookies.remove('emailCodeVerificationLink')
      router.push({ name: 'singupForm' })
    }
  }
}

onBeforeMount(() => {
  if (!singup.emailCodeVerificationLink) {
    const link = cookies.get('emailCodeVerificationLink')
    if (link) {
      singup.emailCodeVerificationLink = link
    } else {
      router.push({ name: 'singupEmail' })
    }
  }
  if (!singup.user.email) {
    const email = cookies.get('emailToVerify')
    if (email) {
      singup.user.email = email
    } else {
      router.push({ name: 'singupEmail' })
    }
  }
})
</script>

<style scoped></style>
