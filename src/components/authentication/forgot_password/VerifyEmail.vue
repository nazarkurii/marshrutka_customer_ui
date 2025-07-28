<template>
  <form
    @submit.prevent="verifyEmail"
    class="flex flex-col py-[20px] mt-[40px] max-w-[470px] w-full items-center gap-[20px]"
  >
    <Input
      image-path="/email.svg"
      name="Email"
      type="email"
      :violated="firstTry ? false : !validation"
      :invalid="requestError"
      v-model="forgotPassword.email"
      :model-function="
        () => {
          requestError = false
        }
      "
    />
    <div
      v-if="requestError"
      class="flex flex-col p-[20px] bg-zinc-800 rounded-xl w-full h-fit items-center"
    >
      <p class="text-red-500 text-lg text-center">
        {{ t('authentication.login.forgotPassword.nonExistingEmail') }}
      </p>
    </div>

    <ActiveButton
      :is-successfull="succcess"
      :is-loading="processing"
      type="submit"
      :active="validation && !requestError"
      :name="t('authentication.login.forgotPassword.sendCode')"
    />
    <div class="flex gap-[5px]">
      <p class="text-white">{{ t('authentication.login.forgotPassword.remember') }}</p>
      <a
        class="text-blue-500 underline hover:text-blue-600 cursor-pointer"
        @click="router.push({ name: 'login' })"
        >{{ t('authentication.login.name') }}</a
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import Input from '@/components/utils/Input.vue'
import { useI18n } from 'vue-i18n'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Problem } from '@/scripts/errors'
import { useAppStore } from '@/stores/app'
import { useCookies } from 'vue3-cookies'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useForgotPasswordStore } from '@/stores/forgotPassword'
defineProps<{
  changeForm: () => void
}>()

const { t } = useI18n()
const router = useRouter()

const forgotPassword = useForgotPasswordStore()

const processing = ref(false)
const firstTry = ref(true)
const requestError = ref(false)
const succcess = ref(false)

const validation = computed(() => {
  return /^[A-Za-z0-9._]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/.test(forgotPassword.email)
})

const { cookies } = useCookies()
async function verifyEmail() {
  firstTry.value = false

  if (validation.value && !processing.value) {
    requestError.value = false
    processing.value = true
    const problem = await forgotPassword.verifyEmail()

    if (problem) {
      setTimeout(() => {
        processing.value = false
        requestError.value = true
      }, 1000)
    } else {
      cookies.set(
        'emailChangePasswordCodeVerificationLink',
        forgotPassword.emailCodeVerificationLink,
        '10min',
      )
      cookies.set('emailChangePasswordToVerify', forgotPassword.email, '10min')

      setTimeout(() => {
        succcess.value = true
        setTimeout(() => {
          router.push({ name: 'changePasswordEmailCodeVerification' })
        }, 600)
      }, 600)
    }
  }
}
</script>

<style scoped>
@media (max-width: 350px) {
  .changeForm {
    flex-direction: column;
  }
}
</style>
