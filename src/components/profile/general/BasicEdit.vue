<template>
  <Editor :close-func="closeFunc">
    <form @submit.prevent="save" class="flex flex-col gap-[20px] max-w-[300px] w-full items-center">
      <Input
        :preload="data.firstName"
        :invalid="false"
        :name="t('profile.general.basicInfo.info.edit.firstName')"
        type="text"
        v-model="data.firstName"
      />
      <Input
        :preload="data.lastName"
        :invalid="false"
        :name="t('profile.general.basicInfo.info.edit.lastName')"
        type="text"
        v-model="data.lastName"
      />

      <input
        v-model="data.dateOfBirth"
        @change="
          () => {
            errorOccured = false
          }
        "
        type="date"
        :class="{
          inputUssual: !data.dateOfBirth && !errorOccured,
          inputRed: errorOccured,
          inputWhite: data.dateOfBirth && !errorOccured,
        }"
        class="flex input bg-zinc-800 h-[50px] mx-auto"
      />

      <div
        v-if="errorOccured"
        class="flex flex-col p-[20px] bg-zinc-800 rounded-xl w-full h-fit items-center"
      >
        <p class="text-red-500 text-lg text-center">
          {{ t('profile.general.basicInfo.info.error') }}
        </p>
      </div>
    </form>
  </Editor>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Editor from '../utils/Editor.vue'
import Input from '@/components/utils/Input.vue'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { Problem } from '@/scripts/errors'
import axios from 'axios'

const props = defineProps<{
  firstName: string
  lastName: string
  dateOfBirth: string
  closeFunc: () => void
}>()

const { t } = useI18n()

const requesting = ref(false)
const validation = computed(() => {
  return data.firstName != '' && data.lastName != '' && data.dateOfBirth != ''
})
const successful = ref(false)
const errorOccured = ref(false)

const data = reactive({
  firstName: props.firstName,
  lastName: props.lastName,
  dateOfBirth: props.dateOfBirth.slice(0, 10),
})

async function save() {
  if (validation && !requesting.value) {
    requesting.value = true
    try {
      await axios.put('/personal-info', data)
      setTimeout(() => {
        requesting.value = false
        successful.value = true
        setTimeout(() => {
          emit('updated', data)
          props.closeFunc()
        }, 600)
      }, 600)
    } catch (err) {
      new Problem(err)
      setTimeout(() => {
        requesting.value = false
        errorOccured.value = true
      }, 600)
    }
  }
}

const emit = defineEmits(['updated'])
</script>

<style scoped>
.placeholderColor::placeholder {
  color: #94a3b8;
}
.input {
  width: 100%;
  height: 50px;
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
