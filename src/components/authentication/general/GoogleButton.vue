<template>
  <button
    type="button"
    @click="errorOccured ? '' : signInWithGoogle()"
    :class="{
      'bg-zinc-700 cursor-default': errorOccured,
      'cursor-pointer bg': !errorOccured,
    }"
    class="flex w-full relative rounded-xl justify-center h-[60px] sm:h-[55px] items-center transition-all duration-200"
  >
    <img
      src="/google.webp"
      alt="google"
      class="size-[40px] left-[6px] bg-white p-[3px] rounded-full absolute"
    />
    <p class="text-white text-lg ml-[40px] sm:mx-auto">
      {{ getName() }}
    </p>
  </button>

  <div
    v-if="errorWindow"
    @click.s="errorWindow = false"
    class="flex absolute inset-0 bg-black/70 z-30 px-[10px]"
  >
    <div
      @click.stop
      class="flex flex-col bg-zinc-700 gap-[20px] items-center p-[20px] rounded-xl size-fit m-auto mb-[26%] mt-[100px] max-w-[470px] w-full"
    >
      <img src="/crying-face.webp" alt="" class="size-[200px] rounded-full" />
      <p class="text-white w-full text-center text-lg">{{ t('authentication.googleError') }}</p>
      <ActiveButton
        @click="errorWindow = false"
        :active="true"
        :name="t('activeButton.continue')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import type { UnloggedinTicketSelectionAttemt } from '@/scripts/authentication'

import { useAppStore } from '@/stores/app'
import axios from 'axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const props = defineProps<{
  type: string
}>()

const { t } = useI18n()
function getName(): string {
  if (props.type == 'login') {
    return t('authentication.login.google')
  } else if (props.type == 'singup') {
    return t('authentication.singup.google')
  }
  return 'error'
}

import { googleSdkLoaded } from 'vue3-google-login'

const errorOccured = ref(false)
const errorWindow = ref(false)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const router = useRouter()
const signInWithGoogle = async () => {
  try {
    googleSdkLoaded((google) => {
      if (!google?.accounts?.oauth2?.initCodeClient) {
        console.error('Google Identity Services SDK not loaded')
        return
      }

      google.accounts.oauth2
        .initCodeClient({
          client_id: clientId,
          scope: 'email profile',
          redirect_uri: 'postmessage',
          callback: async (response) => {
            if (response) {
              try {
                const { data }: { data: { token: string } } = await axios.post('/google-oauth', {
                  code: response.code,
                })

                const { cookies } = useCookies()
                cookies.set('token', data.token, '30d')
                axios.defaults.headers.common.Authorization = data.token
                const app = useAppStore()
                app.login(true)
              } catch (error) {
                console.log(error)
                errorWindow.value = true
                errorOccured.value = true
              }
            }
          },
        })
        .requestCode()
    })
  } catch {}
}
</script>

<style scoped>
.bg {
  background: #1668e3;
}

.bg:hover {
  background: #0d4eaf;
}
</style>
