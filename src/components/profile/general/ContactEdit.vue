<template>
  <Editor
    :close-func="props.closeFunc"
    :submit="() => {}"
    :w="400"
    :hide-cancel="emailVerifiactionLoading"
  >
    <transition name="fade" mode="out-in">
      <EmailVerificationCode
        v-if="!emailVerified && !errorOccured"
        :key="0"
        :cancel="props.closeFunc"
        @error="handleError"
        @verified="handleVerified"
        @loading="
          (value) => {
            console.log(value)
            emailVerifiactionLoading = value
          }
        "
      />

      <ContactDataChanging
        :key="2"
        v-else-if="!errorOccured"
        :verification-token="verificationToken"
        :exisiting-email="props.email"
        :exisiting-phone-number="props.phoneNumber"
        @updated="handleUpdated"
        @error="handleError"
      />
      <SomethingWentWrong :key="1" v-else />
    </transition>
  </Editor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmailVerificationCode from './EmailVerificationCode.vue'
import ContactDataChanging from './ContactDataChanging.vue'
import Editor from '../utils/Editor.vue'
import SomethingWentWrong from './SomethingWentWrong.vue'

const props = defineProps<{
  email: string
  phoneNumber: string
  closeFunc: () => void
}>()

const emit = defineEmits<{
  (e: 'updated', data: { email: string; phoneNumber: string }): void
}>()

const emailVerified = ref(false)
const errorOccured = ref(false)
const verificationToken = ref('')

// Functions moved to script and fully typed
function handleError() {
  errorOccured.value = true
}

function handleVerified(token: string) {
  emailVerified.value = true
  verificationToken.value = token
}
const emailVerifiactionLoading = ref(false)

function handleUpdated(data: { email: string; phoneNumber: string }) {
  props.closeFunc()
  emit('updated', data)
}
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
