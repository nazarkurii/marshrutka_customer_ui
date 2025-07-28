<template>
  <Loader v-if="codeSending" />

  <form
    v-else
    @submit.prevent="verify"
    class="flex flex-col max-w-[470px] gap-[20px] w-full items-center"
  >
    <p class="flex text-white text-xl w-full text-center">
      {{ t('profile.general.contactInfo.info.edit.codeDescription') }}
    </p>
    <EmailVerificationCodeInput
      @model="
        (value: string) => {
          code = value
        }
      "
    />

    <div
      v-if="errorOccured"
      class="flex p-[20px] bg-zinc-800 rounded-xl w-full h-fit justify-center"
    >
      <p class="text-red-500 text-lg text-center">
        {{ t('authentication.singup.email.verificationCodeError') }}
      </p>
    </div>

    <ActiveButton
      :active="validation"
      :name="t('send')"
      :is-loading="requesting"
      :is-successfull="successful"
      type="submit"
    />
  </form>
</template>

<script setup lang="ts">
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import EmailVerificationCodeInput from '@/components/utils/EmailVerificationCodeInput.vue'
import Loader from '@/components/utils/Loader.vue'
import { Problem } from '@/scripts/errors'
import type { Link } from '@/scripts/request'
import axios from 'axios'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  cancel: () => void
}>()

const code = ref('')
const validation = computed(() => {
  return code.value.length == 6
})
const requesting = ref(false)
const successful = ref(false)
const errorOccured = ref(false)
const { t } = useI18n()

const emit = defineEmits(['verified', 'error', 'loading'])

async function verify() {
  if (validation && !requesting.value) {
    requesting.value = true

    try {
      const {
        data,
      }: {
        data: {
          token: string
        }
      } = await axios.post(verificationLink.value, {
        code: code.value,
      })

      setTimeout(() => {
        requesting.value = false
        successful.value = true
        setTimeout(() => {
          emit('verified', data.token)
        }, 600)
      }, 600)
    } catch (err) {
      const problem = new Problem(err)

      if (problem.status == 400 || problem.status == 422) {
        setTimeout(() => {
          requesting.value = false
          errorOccured.value = true
        }, 600)
      } else {
        router.push({ name: 'internalServerError' })
      }
    }
  }
}
const router = useRouter()
const verificationLink = ref('')
const codeSending = ref(true)
onBeforeMount(async () => {
  try {
    emit('loading', true)
    const {
      data,
    }: {
      data: {
        exists: boolean
        links: {
          verifyEmailCode: Link
        }
      }
    } = await axios.post('/verify-update')

    verificationLink.value = data.links.verifyEmailCode.href

    setTimeout(() => {
      emit('loading', false)
      codeSending.value = false
    }, 600)
  } catch (err) {
    new Problem(err)
    emit('error')
  }
})
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 0.7;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease-in;
}
</style>
