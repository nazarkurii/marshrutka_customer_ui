<template>
  <div class="flex form">
    <input
      autocomplete="off"
      :onmousedown="forbidFocus"
      v-for="(value, index) in inputs"
      :key="index"
      :id="'input' + String(index)"
      v-model="inputs[index]"
      class="input bg-zinc-800 text-white rounded-lg text-2xl text-center shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600"
      type="text"
      inputmode="numeric"
      maxlength="5"
      @input="handleInput(index)"
      @keydown="handleKeyDown(index, $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

onMounted(() => {
  const input = document.getElementById('input0')
  input?.focus()
})

const inputs = ref<string[]>(['', '', '', '', '', ''])

function forbidFocus(): boolean {
  for (let index = 0; index < inputs.value.length; index++) {
    const inputElement = document.getElementById('input' + String(index))
    if (inputs.value[index] == '') {
      inputElement?.focus()
      return false
    }
  }
  const inputElement = document.getElementById('input5')
  inputElement?.focus()
  return false
}
function handleInput(index: number): void {
  const value = inputs.value[index]

  // Clear non-numeric input
  if (isNaN(Number(value))) {
    inputs.value[index] = ''
    return
  }

  // Allow 6-digit paste
  if (value.length === 6) {
    const pasteCode = value

    for (let i = 0; i < 6; i++) {
      inputs.value[i] = pasteCode[i] || ''
    }

    const lastInput = document.querySelectorAll('input')[5] as HTMLInputElement | null
    lastInput?.focus()
    return
  }

  // If trying to enter more than 1 digit (but not a paste), reject
  if (value.length > 1) {
    inputs.value[index] = ''
    return
  }

  // Move to next if all good and not the last input
  if (index < 5 && value.length === 1) {
    const nextInput = document.querySelectorAll('input')[index + 1] as HTMLInputElement | null
    nextInput?.focus()
  }

  // If this is the last input, do nothing if all inputs are filled correctly
  if (index === 5) {
    const allFilled = inputs.value.every((v) => v.length === 1 && !isNaN(Number(v)))
    if (allFilled && value.length > 1) {
      inputs.value[index] = value[0] // prevent second digit overwrite
    }
  }
}

function handleKeyDown(index: number, event: KeyboardEvent): void {
  const prevInput = document.querySelectorAll('input')[index - 1] as HTMLInputElement | null

  if (event.key === 'Backspace' && inputs.value[index] === '' && prevInput) {
    prevInput.focus()
  }
}

watch(inputs.value, () => {
  emit('model', inputs.value.join(''))
})

const emit = defineEmits(['model'])
</script>

<style scoped>
.input {
  width: 60px;
  height: 60px;
}

.form {
  gap: 10px;
}

@media (max-width: 460px) {
  .input {
    width: 12vw;
    height: 12vw;
  }

  .form {
    gap: 3px;
  }
}
</style>
