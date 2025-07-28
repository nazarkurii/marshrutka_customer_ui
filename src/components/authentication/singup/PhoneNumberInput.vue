<template>
  <div class="flex items-center gap-2">
    <!-- Country code select -->
    <select
      v-model="countryCode"
      :style="{
        height: `${height}px`,
      }"
      :class="{
        'input-bg': inputBg,
        'bg-zinc-800 ': !inputBg,
      }"
      class="rounded-lg overflow-y-scroll text-white p-2 input focus:ring-2 focus:ring-blue-500"
    >
      <option value="+61">🇦🇺 +61</option>
      <option value="+43">🇦🇹 +43</option>
      <option value="+32">🇧🇪 +32</option>
      <option value="+55">🇧🇷 +55</option>
      <option value="+1">🇨🇦 +1</option>
      <option value="+86">🇨🇳 +86</option>
      <option value="+420">🇨🇿 +420</option>
      <option value="+20">🇪🇬 +20</option>
      <option value="+34">🇪🇸 +34</option>
      <option value="+33">🇫🇷 +33</option>
      <option value="+49">🇩🇪 +49</option>
      <option value="+36">🇭🇺 +36</option>
      <option value="+91">🇮🇳 +91</option>
      <option value="+39">🇮🇹 +39</option>
      <option value="+81">🇯🇵 +81</option>
      <option value="+52">🇲🇽 +52</option>
      <option value="+31">🇳🇱 +31</option>
      <option value="+64">🇳🇿 +64</option>
      <option value="+47">🇳🇴 +47</option>
      <option value="+48">🇵🇱 +48</option>
      <option value="+351">🇵🇹 +351</option>
      <option value="+40">🇷🇴 +40</option>
      <option value="+966">🇸🇦 +966</option>
      <option value="+27">🇿🇦 +27</option>
      <option value="+82">🇰🇷 +82</option>
      <option value="+46">🇸🇪 +46</option>
      <option value="+41">🇨🇭 +41</option>
      <option value="+90">🇹🇷 +90</option>
      <option value="+380">🇺🇦 +380</option>
      <option value="+971">🇦🇪 +971</option>
      <option value="+44">🇬🇧 +44</option>
      <option value="+1">🇺🇸 +1</option>
      <option value="+84">🇻🇳 +84</option>

      <!-- Add more countries as needed -->
    </select>

    <!-- Phone number input -->
    <input
      maxlength="15"
      v-model="localNumber"
      type="tel"
      placeholder="123 456 7890"
      :class="{
        placeholder: !violated,

        'text-red-500 red': invalid || violated,
        'text-white ': !invalid,
        ussual: !invalid && !localNumber.length,
        'input-bg': inputBg,
        'bg-zinc-800 ': !inputBg,
      }"
      :style="{
        height: `${height}px`,
      }"
      class="flex-1 rounded-lg input tracking-widest p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    violated: boolean
    invalid?: boolean
    preload?: string
    height?: number
    inputBg?: boolean
  }>(),
  {
    height: 45,
  },
)
import { useTicketStore } from '@/stores/ticket'
import { parsePhoneNumber } from 'libphonenumber-js/min'
import { watch, ref, onBeforeMount } from 'vue'

const countryCode = ref('+380')
const localNumber = ref('')

onBeforeMount(() => {
  if (props.preload) {
    try {
      const phoneNumber = parsePhoneNumber(props.preload)
      if (phoneNumber) {
        countryCode.value = '+' + phoneNumber.countryCallingCode
        localNumber.value = phoneNumber.nationalNumber
      }
    } catch (err) {
      console.log(err)
    }
  } else {
  }
})
// Watch and update the user's full phone number reactively
watch([countryCode, localNumber], () => {
  if (
    ('0123456789'.includes(localNumber.value[localNumber.value.length - 1]) ||
      localNumber.value == '') &&
    localNumber.value.length != 11
  ) {
    emit('model', `${countryCode.value}${localNumber.value.replace(/\s+/g, '')}`)
  } else {
    localNumber.value = localNumber.value.slice(0, localNumber.value.length - 1)
  }
})

const emit = defineEmits(['model'])
</script>

<style scoped>
.input:focus,
input:hover {
  outline: none;
  border-color: rgba(129, 140, 248);

  box-shadow: 0 0 0 5px rgb(129 140 248 / 30%);
}

.input {
  height: 45px;
  line-height: 30px;
  padding-left: 8px;
  padding-right: 8px;

  border: 2px solid transparent;
  border-radius: 10px;
  outline: none;
  transition: 0.5s ease;
}
.ussual {
  color: #d5e0ff;
}

.red {
  color: #ff0000;
}
</style>
