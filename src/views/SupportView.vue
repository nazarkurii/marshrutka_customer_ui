<template>
  <div class="flex w-full bg-neutral-900 z-10 h-[60px] fixed">
    <HeaderSimplified />
  </div>

  <div class="max-w-[1000px] w-full mx-auto py-16 px-4 pt-[120px] relative">
    <!-- Title -->
    <h1 class="text-4xl font-extrabold text-center mb-3 text-white">
      {{ t('support.title') }}
    </h1>
    <p class="text-center text-gray-400 mb-10">
      {{ t('support.subtitle') }}
    </p>

    <!-- Search -->
    <div class="relative mx-auto max-w-[400px] mb-10">
      <input
        v-model="search"
        type="text"
        :placeholder="t('support.searchPlaceholder')"
        class="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      />
      <svg
        class="absolute left-4 top-3.5 w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
    </div>

    <!-- FAQ list -->
    <div class="w-full flex flex-col gap-[20px]">
      <div
        v-for="faq in filteredFaqs"
        :key="faq.q"
        class="bg-[#1a1a1a] rounded-2xl w-full border border-gray-800 overflow-hidden shadow-sm"
      >
        <button
          @click="toggle(faq)"
          class="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-gray-100 hover:bg-[#222] transition-colors"
        >
          <span>{{ faq.q }}</span>
          <svg
            :class="{ 'rotate-180': faq.open }"
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          v-if="faq.open"
          class="px-6 pb-5 pt-[10px] text-gray-400 leading-relaxed border-t border-gray-800"
        >
          {{ faq.a }}
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div @click="supportContacts = true" class="mt-16 text-center cursor-pointer">
      <h2 class="text-xl font-semibold mb-2 text-white">{{ t('support.contactTitle') }}</h2>
      <p class="text-gray-400 mb-5">{{ t('support.contactSubtitle') }}</p>
      <a
        class="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow"
      >
        {{ t('support.contactButton') }}
      </a>
    </div>

    <TransparentBackground
      :close="
        () => {
          supportContacts = false
        }
      "
      :condition="supportContacts"
    >
      <div class="flex flex-col gap-[20px] px-[10px] h-full justify-center">
        <div :data-index="0" :key="0" class="flex direction gap-[20px] items-center">
          <img src="/email.svg" class="size-[50px] rounded-xl" />
          <p class="text-white textsize font-bold">nazar.nazar.kurii@gmail.com</p>
        </div>
        <div :data-index="1" :key="1" class="flex direction gap-[20px] items-center">
          <img src="/whatsapp.jpg" class="size-[50px] rounded-xl" />
          <p class="text-white textsize font-bold">+31 (6 86) 42 23 47</p>
        </div>
        <div :data-index="2" :key="2" class="flex direction gap-[20px] items-center">
          <img src="/telegram.png" class="size-[50px] rounded-full" />
          <p class="text-white textsize font-bold">+31 (6 86) 42 23 47</p>
        </div>
      </div>
    </TransparentBackground>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderSimplified from '@/components/global/header/HeaderSimplified.vue'
import TransparentBackground from '@/components/utils/TransparentBackground.vue'

const { t, tm } = useI18n()
const supportContacts = ref(false)

// ✅ use tm() to get the raw array from your locale
const faqs = computed(() => tm('support.faqs') as { q: string; a: string; open?: boolean }[])

const search = ref('')

const filteredFaqs = computed(() => {
  if (!search.value.trim()) return faqs.value
  return faqs.value.filter(
    (f) =>
      f.q.toLowerCase().includes(search.value.toLowerCase()) ||
      f.a.toLowerCase().includes(search.value.toLowerCase()),
  )
})

function toggle(faq: { q: string; a: string; open?: boolean }) {
  faqs.value[faqs.value.indexOf(faq)].open = !faq.open
}
</script>

<style scoped>
.textsize {
  font-size: clamp(17px, 4vw, 40px);
}
</style>
