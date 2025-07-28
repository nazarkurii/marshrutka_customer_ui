z
<template>
  <FormStep :step="step" :name="name ? name : t('connection.contactInfo')">
    <div class="flex w-full min-h-[120px]">
      <div v-if="!requesting" class="grid gridContainer i w-full max-w-[600px] mx-auto">
        <div class="grid contact gap-[10px] column mx-auto w-full">
          <Input
            :input-bg="true"
            :invalid="parcel.firstTry ? false : invalid.firstName"
            :name="t('authentication.singup.firstName')"
            type="text"
            v-model="credentials.firstName"
          />
          <Input
            :input-bg="true"
            :invalid="parcel.firstTry ? false : invalid.lastName"
            :name="t('authentication.singup.lastName')"
            type="text"
            v-model="credentials.lastName"
          />
        </div>

        <div class="grid contact mt-[10px] w-full gap-[10px] mx-auto">
          <Input
            :input-bg="true"
            :invalid="parcel.firstTry ? false : invalid.email"
            image-path="/email.svg"
            name="Email"
            type="email"
            v-model="credentials.email"
          />

          <PhoneNumberInput
            :input-bg="true"
            :height="55"
            :violated="false"
            :invalid="parcel.firstTry ? false : invalid.phoneNumber"
            :preload="credentials.phoneNumber"
            @model="
              (phoneNumberValue: string) => {
                credentials.phoneNumber = phoneNumberValue
              }
            "
          />
        </div>
      </div>
      <Loader :size="50" v-else />
    </div>
  </FormStep>
</template>

<script setup lang="ts">
import PhoneNumberInput from '@/components/authentication/singup/PhoneNumberInput.vue'
import Input from '@/components/utils/Input.vue'
import Loader from '@/components/utils/Loader.vue'
import { Problem } from '@/scripts/errors'
import type { User } from '@/scripts/user'
import { useParcelStore } from '@/stores/parcel'
import { useTicketStore } from '@/stores/ticket'
import axios from 'axios'
import { reactive, ref, watch, watchEffect } from 'vue'

import { onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import FormStep from '../connection/form/utils/FormStep.vue'

const parcel = useParcelStore()

const props = defineProps<{
  name?: string
  step: number
  preloadUser?: boolean
  invalid: {
    phoneNumber: boolean
    email: boolean
    firstName: boolean
    lastName: boolean
  }
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}>()

const { t } = useI18n()
const requesting = ref(true)

onBeforeMount(async () => {
  if (props.preloadUser) {
    try {
      const { data }: { data: { user: User } } = await axios.get('')
      credentials.phoneNumber = data.user.phoneNumber
      credentials.email = data.user.email
    } catch (err) {
      new Problem(err, true)
    } finally {
      setTimeout(() => {
        requesting.value = false
      }, 300)
    }
  } else {
    requesting.value = false
  }
})
const credentials = reactive({
  firstName: props.firstName,
  lastName: props.lastName,
  email: props.email,
  phoneNumber: props.phoneNumber,
})

const emit = defineEmits([
  'update:firstName',
  'update:lastName',
  'update:email',
  'update:phoneNumber',
])

watchEffect(() => {
  emit('update:email', credentials.email)
})

watchEffect(() => {
  emit('update:phoneNumber', credentials.phoneNumber)
})

watchEffect(() => {
  emit('update:lastName', credentials.lastName)
})

watchEffect(() => {
  emit('update:firstName', credentials.firstName)
})
</script>

<style scoped>
.title {
  border-radius: var(--radius-2xl) /* 1rem = 16px */;
}
@media (max-width: 400px) {
  .title {
    flex-direction: column;
    gap: 10px;
    align-items: center;
    text-align: center;
    border-radius: 0px;
  }
}

.contact {
  grid-template-columns: repeat(1, minmax(0, 1fr));
  max-width: 370px;
}

@media (min-width: 680px) {
  .contact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 600px;
  }
}

.textSize {
  font-size: clamp(15px, 4vw, 17px);
}
</style>
