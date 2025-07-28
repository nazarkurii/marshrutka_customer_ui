<template>
  <HeaderSimplified class="absolute" />

  <div class="about-page text-white min-h-screen">
    <!-- Hero Section -->
    <transition name="main1" appear>
      <section v-if="!leave" class="relative w-full h-[400px] md:h-[500px]">
        <img
          src="/bus3.webp"
          alt="Marshrutka Travel"
          class="w-full h-full object-cover brightness-75"
        />
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ t('about.hero.title') }}</h1>
          <p class="text-lg md:text-2xl max-w-2xl">{{ t('about.hero.subtitle') }}</p>
        </div>
      </section>
    </transition>

    <!-- Mission Section -->
    <transition name="main2" appear>
      <section v-if="!leave" class="py-16 px-6 md:px-20 input-bg">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img src="/team.webp" alt="Team" class="rounded-2xl shadow-2xl w-full object-cover" />
          </div>
          <div class="flex flex-col justify-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('about.mission.title') }}</h2>
            <p class="text-gray-300 text-lg md:text-xl mb-4">{{ t('about.mission.text1') }}</p>
            <p class="text-gray-400">{{ t('about.mission.text2') }}</p>
          </div>
        </div>
      </section>
    </transition>

    <!-- Values Section -->
    <transition name="opacity" appear>
      <section v-if="!leave" class="py-16 px-6 md:px-20">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
          {{ t('about.values.title') }}
        </h2>
        <div class="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div
            class="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/trust.webp"
              class="size-[100%] max-w-[260px] max-h-[260px] rounded-xl mx-auto mb-4"
              alt="Comfort"
            />
            <h3 class="text-xl font-bold mb-2">{{ t('about.values.reliability.title') }}</h3>
            <p class="text-gray-300">{{ t('about.values.reliability.text') }}</p>
          </div>
          <div
            class="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/safety.webp"
              class="size-[100%] max-w-[260px] max-h-[260px] rounded-xl mx-auto mb-4"
              alt="Safety"
            />
            <h3 class="text-xl font-bold mb-2">{{ t('about.values.safety.title') }}</h3>
            <p class="text-gray-300">{{ t('about.values.safety.text') }}</p>
          </div>
          <div
            class="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/comfort.webp"
              class="size-[100%] max-w-[260px] max-h-[260px] rounded-xl mx-auto mb-4"
              alt="Comfort"
            />
            <h3 class="text-xl font-bold mb-2">{{ t('about.values.comfort.title') }}</h3>
            <p class="text-gray-300">{{ t('about.values.comfort.text') }}</p>
          </div>
        </div>
      </section>
    </transition>

    <!-- CTA Section -->
    <transition name="down" appear>
      <section
        v-if="!leave"
        class="py-16 px-6 md:px-20 bg-orange-600 text-white rounded-t-3xl mt-16"
      >
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">{{ t('about.cta.title') }}</h2>
          <p class="text-lg md:text-xl mb-8">{{ t('about.cta.text') }}</p>
          <router-link
            to="/connections"
            class="bg-white text-purple-800 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-2xl transition-all"
          >
            {{ t('about.cta.button') }}
          </router-link>
        </div>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import HeaderSimplified from '@/components/global/header/HeaderSimplified.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
const { t } = useI18n()

const leave = ref(false)

onBeforeRouteLeave((to, from, next) => {
  if (!to.path.includes('about')) {
    leave.value = true
  }
  next()
})
</script>

<style scoped>
.about-page img {
  transition: transform 0.3s ease;
}

.about-page img:hover {
  transform: scale(1.05);
}

.main1-enter-from,
.main1-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.main2-enter-from,
.main2-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.down-enter-from,
.down-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}

.opacity-enter-active,
.opacity-leave-active,
.down-enter-active,
.down-leave-active,
.main2-enter-active,
.main2-leave-active,
.main1-enter-active,
.main1-leave-active {
  transition: all 0.2s ease-in;
}
</style>
