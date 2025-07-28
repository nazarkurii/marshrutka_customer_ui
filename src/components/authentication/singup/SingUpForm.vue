<template>
  <form
    @submit.prevent="sinup"
    class="flex flex-col py-[20px] mt-[40px] max-w-[470px] w-full items-center gap-[20px]"
  >
    <GoogleButton type="singup" />
    <p class="text-white text-lg">{{ t('authentication.or') }}</p>
    <div class="flex gap-[20px]">
      <Input
        :invalid="invalidParams.firstName"
        :violated="firstAtempt ? false : validation.violation.firstName || invalidParams.firstName"
        :name="t('authentication.singup.firstName')"
        v-model="singup.user.firstName"
        type="text"
        :model-function="
          () => {
            invalidParams.firstName = false
          }
        "
      />
      <Input
        :invalid="invalidParams.lastName"
        :name="t('authentication.singup.lastName')"
        :violated="firstAtempt ? false : validation.violation.lastName"
        type="text"
        v-model="singup.user.lastName"
        :model-function="
          () => {
            invalidParams.lastName = false
          }
        "
      />
    </div>
    <div class="flex flex-col sm:flex-row gap-[20px] w-full">
      <PhoneNumberInput
        :violated="firstAtempt ? false : validation.violation.phoneNumber"
        :invalid="invalidParams.phoneNumber"
        :preload="singup.user.phoneNumber"
        @model="
          (phoneNumber: string) => {
            singup.user.phoneNumber = phoneNumber
            invalidParams.phoneNumber = false
          }
        "
      />
      <input
        v-model="singup.user.dateOfBirth"
        @change="
          () => {
            invalidParams.dateOfBirth = false
          }
        "
        type="date"
        :class="{
          inputUssual: firstAtempt
            ? true
            : !validation.violation.dateOfBirth && !invalidParams.dateOfBirth,
          inputRed: !firstAtempt && (validation.violation.dateOfBirth || invalidParams.dateOfBirth),
          inputWhite: !validation.violation.dateOfBirth && !invalidParams.dateOfBirth,
        }"
        class="flex input text-re bg-zinc-800 h-[45px] mx-auto sm:mx-0"
      />
    </div>
    <Input
      :invalid="invalidParams.password"
      :violated="firstAtempt ? false : validation.violation.password"
      image-path="/password.svg"
      :is-password="true"
      :name="t('authentication.password')"
      type="password"
      v-model="singup.user.password"
      :model-function="
        () => {
          invalidParams.password = false
        }
      "
    />
    <div
      v-if="requestProblem && !successfullSingup"
      class="flex flex-col p-[20px] bg-zinc-800 rounded-xl w-full h-fit items-center"
    >
      <p v-for="(message, i) in invalidMessages" :key="i" class="text-red-500 text-lg text-center">
        {{ message }}
      </p>
    </div>

    <ActiveButton
      :is-loading="requesting"
      :active="validation.isValid"
      :is-successfull="successfullSingup"
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
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  identifyInvalidParams,
  validate,
  type UnloggedinTicketSelectionAttemt,
} from '@/scripts/authentication'
import PhoneNumberInput from './PhoneNumberInput.vue'
import { useSingupStore } from '@/stores/singup'
import { Problem } from '@/scripts/errors'
import { useCookies } from 'vue3-cookies'
import { useAppStore } from '@/stores/app'
import axios from 'axios'
defineProps<{
  changeForm: () => void
}>()

const { t } = useI18n()
const router = useRouter()

const validation = computed(() => {
  const requestErrorOccured = Object.values(invalidParams).some((v) => v)
  const result = validate(singup.user)

  result.isValid == result.isValid && !requestErrorOccured

  return result
})

let invalidParams = reactive({
  firstName: false,
  lastName: false,
  dateOfBirth: false,
  phoneNumber: false,
  password: false,
  emailToken: false,
})

let invalidMessages = ref<String[]>([])

const firstAtempt = ref(true)
const requesting = ref(false)
const requestProblem = ref<undefined | Problem>(undefined)
const successfullSingup = ref(false)
const singup = useSingupStore()

async function sinup() {
  firstAtempt.value = false
  if (validation.value.isValid) {
    requesting.value = true
    const response = await singup.do()
    invalidMessages.value = []
    if (response.problem) {
      const params = identifyInvalidParams(response.problem)
      setTimeout(() => {
        requestProblem.value = response.problem
        requesting.value = false

        invalidParams.firstName = params.firstName
        invalidParams.lastName = params.lastName
        invalidParams.dateOfBirth = params.dateOfBirth
        invalidParams.phoneNumber = params.phoneNumber
        invalidParams.password = params.password
        invalidParams.emailToken = params.emailToken

        if (invalidParams.dateOfBirth) {
          invalidMessages.value.push(t('authentication.singup.dateOfBirthProblem'))
        }
        if (invalidParams.phoneNumber) {
          invalidMessages.value.push(t('authentication.singup.phoneNumberProblem'))
        }
      }, 2000)
    } else {
      successfullSingup.value = true
      cookies.remove('emailVerificationToken')
      cookies.remove('emailToVerify')
      cookies.set('token', response.token, '30d')
      axios.defaults.headers.common.Authorization = response.token
      const app = useAppStore()
      app.login(true)
    }
  }
}

const { cookies } = useCookies()

onBeforeMount(() => {
  if (!singup.user.email) {
    const email = cookies.get('emailToVerify')
    singup.user.email = email ? email : ''
  }

  if (!singup.emailVerificationToken) {
    const token = cookies.get('emailVerificationToken')
    singup.emailVerificationToken = token ? token : ''
  }
})
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
