<template>
      <a
        href="https://web.telegram.org/
        "
        class="rounded-full"
        target="_blank"
      >
        <img
          src="/telegram.svg"
          alt=""
          class="size-[50px] z-20 shadow-lg shadow-black rounded-full  cursor-pointer transition-all duration-200 hover:scale-105 fixed bottom-[20px] right-[15px]"
        />
      </a>

      <img
      
        @click="callForm = true"
        src="/call.svg"
        alt=""
        class="size-[50px] shadow-lg shadow-black rounded-full z-20 hover:opacity-100 cursor-pointer transition-all duration-200 hover:scale-105 fixed bottom-[80px] right-[15px]"
      />

      <TransparentBackground
        :condition="callForm"
        :close="
          () => {
            callForm = false
          }
        "
      >
        <div
          @click.stop
          class="bg-neutral-900 p-[20px] rounded-2xl shadow-xl gap-[20px] flex flex-col shadow-black px-[10px]"
        >
          <img src="/center.svg" class="w-full max-w-[300px]" alt="" />
          <Input
            v-model="model"
            type="text"
            :available="true"
            :name="t('profile.general.contactInfo.info.phoneNumber')"
          />
          <Input
            v-model="model"
            type="text"
            :available="true"
            placeholder="+38(050)0688763"
            :name="t('profile.general.basicInfo.info.name')"
          />
          <ActiveButton
            @click="confirm"
            :name="t('send')"
            :active="true"
            :is-successfull="confirmed"
          />
        </div>
      </TransparentBackground>

</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'


import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useResolutionStore } from '@/stores/resolutionStore'
import Input from '@/components/utils/Input.vue'
import ActiveButton from '../utils/ActiveButton.vue'
import TransparentBackground from '@/components/utils/TransparentBackground.vue'

const resolution = useResolutionStore()
const route = useRoute()
const scroll = ref(false)

const callForm = ref(false)
const model = ref('')
const confirmed = ref(false)
function confirm() {
  confirmed.value = true
  setTimeout(() => {
    callForm.value = false
    confirmed.value = false
  }, 500)
}
const { t } = useI18n()
</script>


<style scoped>

</style>