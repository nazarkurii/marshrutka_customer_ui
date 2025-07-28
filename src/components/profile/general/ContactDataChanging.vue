<template>
  <form @submit.prevent="save" class="flex flex-col gap-[20px] max-w-[470px] w-full items-center">
    <Input
      v-model="data.email"
      image-path="/email.svg"
      name="Email"
      type="email"
      :violated="errors.email ? true : !data.email"
      :model-function="
        (email: string) => {
          errors.email = ''
        }
      "
    />
    <PhoneNumberInput
      :preload="data.phoneNumber"
      :violated="errors.phoneNumber ? true : !data.phoneNumber"
      @model="
        (phoneNumber: string) => {
          errors.phoneNumber = ''
          data.phoneNumber = phoneNumber
        }
      "
      :invalid="false"
    />

    <ActiveButton
      :active="isValid"
      :name="t('save')"
      :is-loading="requesting"
      :is-successfull="successful"
      type="submit"
    />
    <div
      v-if="errors.email || errors.phoneNumber"
      class="flex flex-col gap-[20px] p-[20px] bg-zinc-800 rounded-xl w-full h-fit justify-center"
    >
      <p v-if="errors.email" class="text-red-500 text-lg text-center">
        {{ errors.email }}
      </p>
      <p v-if="errors.phoneNumber" class="text-red-500 text-lg text-center">
        {{ errors.phoneNumber }}
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import PhoneNumberInput from '@/components/authentication/singup/PhoneNumberInput.vue'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import Input from '@/components/utils/Input.vue'
import { Problem } from '@/scripts/errors'
import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  exisitingEmail: string
  exisitingPhoneNumber: string
  verificationToken: string
}>()

const data = reactive({
  email: props.exisitingEmail,
  phoneNumber: props.exisitingPhoneNumber,
})

const errors = reactive({
  email: '',
  phoneNumber: '',
})

const isValid = computed(() => {
  console.log(errors)
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phoneNumber.length > 5 &&
    errors.email == '' &&
    errors.phoneNumber == ''
  )
})

const requesting = ref(false)
const successful = ref(false)
const { t } = useI18n()

async function save() {
  if (isValid && !requesting.value) {
    requesting.value = true
    try {
      await axios.put('/contact-info', data, {
        headers: {
          'X-Customer-Update-Token': props.verificationToken,
        },
      })

      setTimeout(() => {
        requesting.value = false
        successful.value = true
        setTimeout(() => {
          emit('updated')
        }, 600)
      }, 600)
    } catch (err) {
      const problem = new Problem(err)
      if (problem.status != 400) {
        setTimeout(() => {
          emit('error')
        }, 600)
      } else {
        setTimeout(() => {
          if (problem.invalidParams?.length) {
            if (problem.invalidParams.findIndex((param) => param.name == 'phoneNumber') != -1) {
              errors.phoneNumber = t('profile.general.contactInfo.info.edit.phoneNumberError')
            }
          } else {
            errors.email = t('profile.general.contactInfo.info.edit.emailError')
          }
          requesting.value = false
        }, 600)
      }
    }
  }
}

const emit = defineEmits(['updated', 'error'])
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 0.7;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s 2s ease-in;
}
</style>
