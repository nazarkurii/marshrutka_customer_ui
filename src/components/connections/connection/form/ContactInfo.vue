<template>
  <div
    class="flex flex-col bg-zinc-800 w-full max-w-[980px] p-[15px] rounded-2xl h-fit justify-center gap-[20px] overflow-x-auto mt-[10px]"
  >
    <div class="flex flex-col gap-[20px] w-full title justify-between">
      <div class="flex gap-[10px] mr-auto">
        <p
          class="flex size-[40px] rounded-lg bg-blue-600 justify-center items-center text-xl text-white font-bold"
        >
          4
        </p>
        <p class="text-white text-2xl font-bold mt-[2px]">
          {{ name ? name : t('connection.contactInfo') }}
        </p>
      </div>
      <div v-if="!requesting" class="grid contact mt-[10px] gap-[20px] mx-auto">
        <Input
          :input-bg="true"
          :violated="false"
          :invalid="ticket.firstTry ? false : !ticket.contactInfoValid.email"
          image-path="/email.svg"
          name="Email"
          type="email"
          v-model="ticket.email"
        />

        <PhoneNumberInput
          :input-bg="true"
          :height="55"
          :violated="false"
          :invalid="ticket.firstTry ? false : !ticket.contactInfoValid.phoneNumber"
          :preload="ticket.phoneNumber"
          @model="
            (phoneNumber: string) => {
              ticket.phoneNumber = phoneNumber
            }
          "
        />
      </div>
      <Loader v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import PhoneNumberInput from '@/components/authentication/singup/PhoneNumberInput.vue'
import Input from '@/components/utils/Input.vue'
import Loader from '@/components/utils/Loader.vue'
import { Problem } from '@/scripts/errors'
import type { User } from '@/scripts/user'
import { useTicketStore } from '@/stores/ticket'
import axios from 'axios'
import { ref } from 'vue'

import { onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  name?: string
}>()

const { t } = useI18n()
const ticket = useTicketStore()
const requesting = ref(true)
onBeforeMount(async () => {
  try {
    const { data }: { data: { user: User } } = await axios.get('')
    ticket.phoneNumber = data.user.phoneNumber
    ticket.email = data.user.email
  } catch (err) {
    new Problem(err)
  } finally {
    setTimeout(() => {
      requesting.value = false
    }, 600)
  }
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
}

@media (min-width: 680px) {
  .contact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
