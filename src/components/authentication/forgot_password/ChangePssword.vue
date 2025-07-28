<template>
  <form
    @submit.prevent="changePassword"
    class="flex flex-col py-[20px] max-w-[470px] w-full items-center gap-[20px]"
  >
    <p class="text-amber-500 text-lg">
      {{ t('authentication.login.forgotPassword.requierments') }}
    </p>
    <Input
      :violated="firstAtempt ? false : errorOccured"
      image-path="/password.svg"
      :name="t('authentication.login.forgotPassword.password')"
      :type="showPassword ? 'text' : 'password'"
      v-model="model.first"
    />
    <Input
      :violated="firstAtempt ? false : errorOccured"
      image-path="/password.svg"
      :name="t('authentication.login.forgotPassword.repeatPassword')"
      :type="showPassword ? 'text' : 'password'"
      v-model="model.second"
    />
    <div class="flex gap-[15px] mr-auto ml-[20px] mt-[6px]">
      <div class="flex relative">
        <label for="cbx" class="cbx">
          <div class="checkmark">
            <input v-model="showPassword" type="checkbox" id="cbx" />
            <div class="flip">
              <div class="front"></div>
              <div class="back">
                <svg viewBox="0 0 16 14" height="14" width="16">
                  <path d="M2 8.5L6 12.5L14 1.5"></path>
                </svg>
              </div>
            </div>
          </div>
        </label>
      </div>
      <h1 class="text-white tex-lgg mb-[1px]">
        {{ t('authentication.login.forgotPassword.showPasswords') }}
      </h1>
    </div>
    <p
      v-if="errorOccured"
      class="flex justify-center items-center w-full h-fit text-lg text-red-600"
    >
      {{ t('authentication.login.forgotPassword.passwordsDiffer') }}
    </p>

    <ActiveButton
      :is-loading="requesting"
      :active="validation.first && validation.second"
      :is-successfull="successfull"
      type="submit"
      :name="t('authentication.singup.name')"
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
import { useI18n } from 'vue-i18n'
import Input from '../../utils/Input.vue'
import ActiveButton from '../../global/utils/ActiveButton.vue'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import { useForgotPasswordStore } from '@/stores/forgotPassword'
defineProps<{
  changeForm: () => void
}>()

const { t } = useI18n()
const router = useRouter()
const showPassword = ref(false)
const forgotPassword = useForgotPasswordStore()
const model = reactive({
  first: '',
  second: '',
})
const validation = computed(() => {
  const first = /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(model.first)
  const second = /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(model.second)
  const same = model.first == model.second
  return {
    first: first,
    second: second,
    same: same,
    valid: first && second && same,
  }
})

const firstAtempt = ref(true)
const errorOccured = ref(false)
const requesting = ref(false)
const successfull = ref(false)

async function changePassword() {
  firstAtempt.value = false
  if (validation.value.valid && !requesting.value) {
    errorOccured.value = false
    requesting.value = true
    const problem = await forgotPassword.do(model.first)

    if (problem) {
      router.push({ name: 'internalServerError' })
    } else {
      setTimeout(() => {
        successfull.value = true
      }, 600)
      cookies.remove('emailChangePasswordAccessToken')
      cookies.remove('emailChangePasswordToVerify')
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 1000)
    }
  } else {
    errorOccured.value = true
  }
}

const { cookies } = useCookies()

onBeforeMount(() => {
  if (!forgotPassword.email) {
    const email = cookies.get('emailChangePasswordToVerify')
    if (email) forgotPassword.email = email
  }

  if (!forgotPassword.emailVerificationToken) {
    const token = cookies.get('emailChangePasswordAccessToken')
    if (token) forgotPassword.emailVerificationToken = token
  }
})
</script>

<style scoped>
/* From Uiverse.io by ozgeozkaraa01 */
.group {
  display: flex;
  line-height: 30px;
  align-items: center;
  position: relative;
  max-width: 100%;
}

.input {
  width: 100%;
  height: 55px;
  line-height: 30px;

  border: 2px solid transparent;
  border-radius: 10px;
  outline: none;

  transition: 0.5s ease;
}

.placeholderColor::placeholder {
  color: #94a3b8;
}

.input:focus,
input:hover {
  outline: none;
  border-color: rgba(129, 140, 248);

  box-shadow: 0 0 0 5px rgb(129 140 248 / 30%);
}

.icon {
  position: absolute;
  top: 12px;
  left: 9px;
  fill: none;
  width: 30px;
  height: 30px;
}
/* From Uiverse.io by SharpTH */
.cbx {
  -webkit-perspective: 20;
  perspective: 20;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -12px;
  background: #e8e8eb;
  border-radius: 4px;
  transform: translate3d(0, 0, 0);
  cursor: pointer;
  transition: all 0.3s ease;
}

.cbx:hover {
  border-color: #0b76ef;
}

.flip {
  display: block;
  transition: all 0.4s ease;
  transform-style: preserve-3d;
  position: relative;
  width: 20px;
  height: 20px;
}

#cbx {
  display: none;
}

#cbx:checked + .cbx {
  border-color: #0b76ef;
}

#cbx:checked + .flip {
  transform: rotateY(180deg);
}

.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 2px;
}

.front {
  background: #fff;
  z-index: 1;
}

.back {
  transform: rotateY(180deg);
  background: #0b76ef;
  text-align: center;
  color: #fff;
  line-height: 20px;
  box-shadow: 0 0 0 1px #0b76ef;
}

.back svg {
  margin-top: 3px;
  margin-left: 2px;
  fill: none;
}

.back svg path {
  stroke: #fff;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
