<template>
  <div class="size-[100%] flex justify-center w-full items-center m-auto">
    <transition name="content" mode="out-in">
      <Loader v-if="requesting && !leaving" />

      <div
        v-else-if="!leaving"
        :class="{
          'border border-zinc-700 p-[30px] ': resolution.width > 550,
        }"
        class="flex gap-[60px] relative flex-col w-full rounded-2xl"
      >
        <h1
          :class="{
            'mx-auto': resolution.width <= 550,
          }"
          class="text-white text-3xl font-bold"
        >
          {{ user.firstName + ' ' + user.lastName }}
        </h1>
        <Section
          :name="t('profile.general.basicInfo.name')"
          :description="t('profile.general.basicInfo.description')"
          :edit-func="
            () => {
              edit.basic = true
            }
          "
          :info="[
            {
              name: t('profile.general.basicInfo.info.name'),
              data: user.firstName + ' ' + user.lastName,
            },
            {
              name: t('profile.general.basicInfo.info.dateOfBirth'),
              data: user.dateOfBirth.slice(0, 10),
            },
          ]"
        />

        <Section
          :name="t('profile.general.contactInfo.name')"
          :description="t('profile.general.contactInfo.description')"
          :edit-func="
            () => {
              edit.contact = true
            }
          "
          :info="[
            {
              name: t('profile.general.contactInfo.info.email'),
              data: user.email,
            },
            {
              name: t('profile.general.contactInfo.info.phoneNumber'),
              data: formatWithParentheses(user.phoneNumber),
            },
          ]"
        />

        <div
          :class="{
            'flex-col': resolution.width <= 550,
          }"
          class="flex gap-[10px] items-center"
        >
          <h1 class="text-lg font-bold text-white">{{ t('profile.general.registered') }}:</h1>
          <p class="text-zinc-500">{{ user.createdAt.slice(0, 10) }}</p>
        </div>
        <transition name="editor">
          <BasicEdit
            @updated="updatedBasicEdit"
            v-if="edit.basic"
            :close-func="
              () => {
                edit.basic = false
              }
            "
            :first-name="user.firstName"
            :last-name="user.lastName"
            :date-of-birth="user.dateOfBirth"
          />
        </transition>
        <transition name="editor">
          <ContactEdit
            v-if="edit.contact"
            @updated="updatedContactEdit"
            :close-func="
              () => {
                edit.contact = false
              }
            "
            :email="user.email"
            :phone-number="user.phoneNumber"
          />
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Problem } from '@/scripts/errors'
import { type User, userTemplate } from '@/scripts/user'
import axios from 'axios'
import { onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Section from './general/Section.vue'
import Loader from '../utils/Loader.vue'
import parsePhoneNumberFromString from 'libphonenumber-js'
import { useResolutionStore } from '@/stores/resolutionStore'
import BasicEdit from './general/BasicEdit.vue'
import ContactEdit from './general/ContactEdit.vue'
import { useAppStore } from '@/stores/app'
import { onBeforeRouteLeave } from 'vue-router'

const requesting = ref(false)

let user: User = reactive<User>(userTemplate)

onBeforeMount(getUserInfo)

async function getUserInfo() {
  requesting.value = true
  try {
    const { data }: { data: { user: User } } = await axios.get('')
    Object.assign(user, data.user)
  } catch (err) {
    new Problem(err)
  } finally {
    const app = useAppStore()
    if (resolution.height > 940) {
      app.footerON()
    }
    requesting.value = false
  }
}

const { t } = useI18n()

function formatWithParentheses(phone: string): string {
  if (!phone) return t('profile.general.contactInfo.info.emptyPhoneNumber')
  const parsed = parsePhoneNumberFromString(phone)
  if (!parsed) throw new Error('Invalid phone number')

  const national = parsed.formatNational() // e.g. "(415) 555-2671"
  return `${parsed.countryCallingCode ? '+' + parsed.countryCallingCode : ''} ${national}`
}

const resolution = useResolutionStore()
const edit = reactive({
  basic: false,
  contact: false,
})

function updatedBasicEdit(data: { firstName: string; lastName: string; dateOfBirth: string }) {
  user.firstName = data.firstName
  user.lastName = data.lastName
  user.dateOfBirth = data.dateOfBirth
}

function updatedContactEdit(data: { email: string; phoneNumber: string }) {
  user.email = data.email
  user.phoneNumber = data.phoneNumber
}

const leaving = ref(false)
onBeforeRouteLeave(() => {
  leaving.value = true
})
</script>

<style scoped>
.content-leave-active {
  transition: all 0.1s ease-in;
}
.content-enter-active {
  transition: all 0.2s ease-in;
}

.content-leave-to,
.content-enter-from {
  scale: 0.9;
  opacity: 0;
}
</style>
