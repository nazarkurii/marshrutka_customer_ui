<template>
  <transition appear name="footer">
    <div
      v-if="app.footer"
      class="flex flex-col z-[0] w-full gap-[60px] max-w-[1600px] bg-neutral-900 border-gray-500 border-t pt-[60px] my pb-[55px] px-[20px]"
    >
      <div
        class="flex flex-col xl:flex-row justify-between w-full xl:h-[90px] gap-[30px] xl:gap-[0px]"
      >
        <div class="flex flex-col md:flex-row items-center justify-between w-full xl:w-[64%]">
          <Logo />
          <div class="flex gap-[20px] flex-col text-white/70">
            <h1 class="font-bold text-white">{{ t('helpNumbers') }}</h1>
            <p>+38 (050) 274-63-19</p>
            <p>+38 (050) 918-42-57</p>
          </div>
          <div class="flex flex-col gap-[20px]">
            <!-- <a
              target="_blank"
              rel="noopener noreferrer"
              :href="app.legalPolicyHref()"
              class="text-white text-xl hover:text-blue-400 transition-all duration-200 cursor-pointer"
              >{{ t('footer.legalDocuments') }}</a
            > -->

            <FooterButton :name="t('footer.aboutButton')" route-name="about" />
          </div>
          <div class="flex gap-[20px]">
            <a target="_blank" href="https://www.instagram.webp/">
              <img
                src="/instagram.webp"
                alt=""
                class="size-[60px] cursor-pointer transition-all duration-200 hover:scale-105"
              />
            </a>
            <a target="_blank" href="https://www.whatsapp.com">
              <img
                src="/whatsup.jpg"
                alt=""
                class="size-[60px] cursor-pointer transition-all duration-200 hover:scale-105 rounded-xl"
              />
            </a>
          </div>
        </div>
        <MobileAppButton
          :open-banner="
            () => {
              bannerOpened = true
            }
          "
        />
      </div>
    </div>
  </transition>
  <TransparentBackground
    :condition="bannerOpened"
    :close="
      () => {
        bannerOpened = false
      }
    "
  >
    <div class="flex py-[10px]">
      <div
        @click.stop
        class="flex flex-col relative gap-[50px] justify-center m-[30px] items-center w-full max-w-[500px] p-[50px] h-full max-h-[700px] input-bg rounded-2xl"
      >
        <div
          @click="bannerOpened = false"
          class="flex size-[40px] bg-white/10 absolute top-[20px] right-[20px] hover:text-amber-600 hover:bg-white/20 cursor-pointer select-none pl-[3px] text-4xl text-white rounded-xl"
        >
          <p class="rotate-45 m-auto">+</p>
        </div>
        <img src="/mobile-app.webp" alt="" />
        <p class="text-white text-3xl font-bold mx-auto">{{ t('comingSoon') }}</p>
      </div>
    </div>
  </TransparentBackground>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Logo from './components/Logo.vue'
import FooterButton from './components/FooterButton.vue'
import MobileAppButton from './components/MobileAppButton.vue'
import { useAppStore } from '@/stores/app'
import TransparentBackground from '@/components/utils/TransparentBackground.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const app = useAppStore()
const bannerOpened = ref(false)

const router = useRouter()

router.beforeEach((to, from, next) => {
  if (to.name == from.name || to.path.startsWith('/authentication')) {
    next()
  } else {
    app.footer = false
    setTimeout(() => {
      next()
    }, 300)
  }
})
</script>

<style scoped>
.footer-leave-active,
.footer-enter-active {
  transition: all 0.2s ease-in;
}

.footer-leave-to,
.footer-enter-from {
  opacity: 0;
  transform: translateY(300px);
}
</style>
