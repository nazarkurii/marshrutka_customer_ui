<template>
  <div
    :class="{
      'max-w-[1530px]': resolution.width > 1150,
      'justify-center': resolution.width <= 1150,
    }"
    class="flex w-full m-auto h-full gap-[20px] flex-1 min-h-[525px] items-start px-[10px] pb-[30px]"
  >
    <transition  v-if="resolution.width > 1150" appear :name="'menue'" mode="out-in">
      <div
        v-if="(resolution.width > 1150 || profileStore.menueOpened) && !leaving"
        class="flex flex-col gap-[15px] items-center max-w-[360px] w-full"
      >
        <div
          :class="{
            fixed: resolution.width >= 1530 && resolution.height >= 920,
          }"
          class="flex flex-col gap-[15px] h-fit menue pb-[30px]"
        >
          <transition-group @enter="enter" @before-enter="beforeEnter" appear>
            <MenueButton
              @click="profileStore.closeMenue"
              :key="0"
              :data-index="0"
              image-path="/account.svg"
              :name="t('profile.general.name')"
              :description="t('profile.general.description')"
              :route-name="'general'"
            />
            <MenueButton
              @click="profileStore.closeMenue"
              :key="1"
              :data-index="1"
              image-path="/tickets.svg"
              :name="t('profile.tickets.name')"
              :description="t('profile.tickets.description')"
              :route-name="'tickets'"
            />
            <MenueButton
              @click="profileStore.closeMenue"
              :key="2"
              :data-index="2"
              image-path="/profile-parcel.svg"
              :name="t('profile.parcels.name')"
              :description="t('profile.parcels.description')"
              :route-name="'parcels'"
            />
            <MenueButton
              v-if="resolution.width <= 1150"
              @click="profileStore.closeMenue"
              :key="3"
              :data-index="3"
              image-path="/logo.svg"
              :name="t('findConnections')"
              :route-name="'connections'"
              :description="t('profile.connections.description')"
            />
            <MenueButton
              :key="4"
              :data-index="3"
              v-if="resolution.width <= 1150 || resolution.height <= 940"
              image-path="/documents.svg"
              :name="t('footer.legalDocuments')"
              :click-func="openLegalDocs"
              :description="t('profile.legalDocuments.description')"
              :route-name="''"
              :router="false"
            />
            <MenueButton
              :key="5"
              :data-index="3"
              v-if="resolution.width <= 1150 || resolution.height <= 940"
              @click="profileStore.closeMenue"
              image-path="/about.svg"
              :description="t('profile.about.description')"
              :name="t('footer.aboutButton')"
              :route-name="'about'"
            />
            <MenueButton
              :key="6"
              :data-index="3"
              v-if="resolution.width <= 900 || resolution.height <= 940"
              @click="profileStore.closeMenue"
              image-path="/about.svg"
              :description="t('profile.support.description')"
              :name="t('navbar.support')"
              :route-name="'support'"
            />
          </transition-group>
        </div>
      </div>
    </transition>
    <transition  v-if="resolution.width > 1150" appear :name="resolution.width < 1150 ? 'menue' : ''" mode="out-in">
      <div
        v-if="resolution.width > 1150 ? true : !profileStore.menueOpened"
        :class="{
          'max-w-[1150px]  ml-auto': resolution.width > 1530,
          'max-w-[calc(100%-360px)] ml-auto ': resolution.width <= 1530 && resolution.width > 1150,
          'mx-auto': resolution.width <= 1150,
        }"
        class="flex w-full relative gap-[10px] min-h-[390px] rounded-2xl"
      >
        <router-view></router-view>
      </div>
    </transition>
    <transition  v-if="resolution.width <= 1150" appear :name="'menue'" mode="out-in">
      <div
        v-if="(resolution.width > 1150 || profileStore.menueOpened) && !leaving"
        class="flex flex-col gap-[15px] items-center max-w-[360px] w-full"
      >
        <div
          :class="{
            fixed: resolution.width >= 1530 && resolution.height >= 920,
          }"
          class="flex flex-col gap-[15px] h-fit menue pb-[30px]"
        >
          <transition-group @enter="enter" @before-enter="beforeEnter" appear>
            <MenueButton
              @click="profileStore.closeMenue"
              :key="0"
              :data-index="0"
              image-path="/account.svg"
              :name="t('profile.general.name')"
              :description="t('profile.general.description')"
              :route-name="'general'"
            />
            <MenueButton
              @click="profileStore.closeMenue"
              :key="1"
              :data-index="1"
              image-path="/tickets.svg"
              :name="t('profile.tickets.name')"
              :description="t('profile.tickets.description')"
              :route-name="'tickets'"
            />
            <MenueButton
              @click="profileStore.closeMenue"
              :key="2"
              :data-index="2"
              image-path="/profile-parcel.svg"
              :name="t('profile.parcels.name')"
              :description="t('profile.parcels.description')"
              :route-name="'parcels'"
            />
            <MenueButton
              v-if="resolution.width <= 1150"
              @click="profileStore.closeMenue"
              :key="3"
              :data-index="3"
              image-path="/logo.svg"
              :name="t('findConnections')"
              :route-name="'connections'"
              :description="t('profile.connections.description')"
            />
            <MenueButton
              :key="4"
              :data-index="3"
              v-if="resolution.width <= 1150 || resolution.height <= 940"
              image-path="/documents.svg"
              :name="t('footer.legalDocuments')"
              :click-func="openLegalDocs"
              :description="t('profile.legalDocuments.description')"
              :route-name="''"
              :router="false"
            />
            <MenueButton
              :key="5"
              :data-index="3"
              v-if="resolution.width <= 1150 || resolution.height <= 940"
              @click="profileStore.closeMenue"
              image-path="/about.svg"
              :description="t('profile.about.description')"
              :name="t('footer.aboutButton')"
              :route-name="'about'"
            />
            <MenueButton
              :key="6"
              :data-index="3"
              v-if="resolution.width <= 900 || resolution.height <= 940"
              @click="profileStore.closeMenue"
              image-path="/about.svg"
              :description="t('profile.support.description')"
              :name="t('navbar.support')"
              :route-name="'support'"
            />
          </transition-group>
        </div>
      </div>
  
      <div
        v-else-if="resolution.width > 1150 ? true : !profileStore.menueOpened"
        :class="{
          'max-w-[1150px]  ml-auto': resolution.width > 1530,
          'max-w-[calc(100%-360px)] ml-auto ': resolution.width <= 1530 && resolution.width > 1150,
          'mx-auto': resolution.width <= 1150,
        }"
        class="flex w-full relative gap-[10px] min-h-[390px] rounded-2xl"
      >
        <router-view></router-view>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import MenueButton from '@/components/profile/menue/MenueButton.vue'
import { useAppStore } from '@/stores/app'
import { useProfileStore } from '@/stores/profile'
import { useResolutionStore } from '@/stores/resolutionStore'
import gsap from 'gsap'

import { onBeforeMount, watch, watchEffect } from 'vue'
import { ref } from 'vue'

import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'

const { t } = useI18n()

const resolution = useResolutionStore()
const profileStore = useProfileStore()
const app = useAppStore()
function openLegalDocs() {
  window.open(app.legalPolicyHref(), '_blank')
}
watch(
  () => profileStore.menueOpened,
  (value) => {
    if (value) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  },
)

onBeforeMount(() => {
  if (resolution.width < 1150) profileStore.menueOpened = true
})

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  return gsap.to(element, {
    opacity: 1,
    x: 0,
    duration: 0.2,
    delay: 0.2 * Number(element.dataset.index) + 0.2,
    onComplete: done,
  })
}

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  element.style.transform = 'translateX(-100px)'
}

const leaving = ref(false)
onBeforeRouteLeave(() => {
  leaving.value = true
})

watchEffect(() => {
  if (resolution.height >= 920) {
    app.footerON()
  } else {
    app.footerOFF()
  }
})
</script>

<style scoped>
.menue-enter-active {
  transition: all 0.1s  ease-in;
}
.menue-leave-active {
  transition: all 0.1s  ease-in;
}

.menue-leave-to,
.menue-enter-from {
  opacity: 0;
  scale: 0.6;
}


</style>
