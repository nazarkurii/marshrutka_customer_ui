<template>
  <transition name="header" appear>
    <div class="h-[100px] w-full">
      <div class="fixed top-0 left-0 w-full flex justify-between py-[10px] px-[20px] z-30">
        <GoBack v-if="back" />
        <Logo
          :class="{
            logo: back,
          }"
        />
        <LanguageCurrency :currency="false" />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import GoBack from '@/components/global/go_back/GoBack.vue'
import LanguageCurrency from '@/components/global/header/components/LanguageCurrency.vue'
import Logo from '@/components/global/header/components/Logo.vue'

import { ref } from 'vue'

const formType = ref('login')
withDefaults(
  defineProps<{
    back?: boolean
  }>(),
  {
    back: true,
  },
)
</script>

<style scoped>
.logo {
  margin-left: 15px;
}
@media (min-width: 470px) {
  .logo {
    margin-left: 80px;
  }
}

.header-enter-from {
  transform: translateY(-100px);
  opacity: 0;
}

.header-enter-active,
.header-leave-active {
  transition: transform 0.3s ease;
}
</style>
