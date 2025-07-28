<template>
  <transition name="menue">
    <div
      ref="dropdownRef"
      @click.stop
      v-if="active"
      :class="{
        '  rounded-2xl  top-[53px] right-[-10px] absolute': resolution.width > 650,
        'fixed top-0 left-0 w-full h-full': resolution.width <= 650,
      }"
      class="flex flex-col box p-[10px] gap-[20px] bg-zinc-800 shadow-2xl shadow-black"
    >
      <div class="menue rounded-xl bg-zinc-700 relative mx-auto">
        <div
          :class="{
            move: menue == 'Currency',
            width: currency,
            'w-[calc(100%-10px)]': !currency,
          }"
          class="bg-zinc-500/60 h-[60px] absolute rounded-xl transition-all duration-200"
        ></div>
        <LanguageCurrencyMenueButton
          class="z-10 mx-auto"
          :on-click="
            () => {
              menue = 'Language'
            }
          "
          :name="t('navbar.languageCurrency.languageButton')"
          :value="app.language.abbreviation"
        />
        <LanguageCurrencyMenueButton
          v-if="currency"
          class="z-10 mx-auto"
          :on-click="
            () => {
              menue = 'Currency'
            }
          "
          :name="t('navbar.languageCurrency.currencyButton')"
          :value="app.currency.abbreviation"
        />
      </div>
      <LanguageMenue v-if="menue == 'Language'" />
      <CurrencyMenue v-if="menue == 'Currency'" />
      <ActiveButton
        :name="t('navbar.languageCurrency.save')"
        :active="true"
        @click="emit('close')"
        class="mt-auto"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import LanguageCurrencyMenueButton from './LanguageCurrencyMenueButton.vue'
import LanguageMenue from './LanguageMenue.vue'
import { useI18n } from 'vue-i18n'
import CurrencyMenue from './CurrencyMenue.vue'
import { useResolutionStore } from '@/stores/resolutionStore'
import ActiveButton from '../../utils/ActiveButton.vue'

const props = defineProps<{
  active: boolean
  currency: boolean
}>()

const app = useAppStore()
const menue = ref('Language')
const emit = defineEmits(['close'])
const { t } = useI18n()

const resolution = useResolutionStore()
const dropdownRef = ref<HTMLElement | null>(null)
let allowClose = ref(false)

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node) && allowClose.value) {
    emit('close')
  }
  allowClose.value = !allowClose.value
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.menue {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
}

.width {
  width: calc(100% - 10px);
  box-sizing: border-box;
}

.move {
  margin-top: 60px;
}

@media (min-width: 350px) {
  .menue {
    flex-direction: row;
    min-width: 300px;
  }

  .move {
    margin-left: calc(50% - 10px);
    margin-top: 0;
  }

  .width {
    width: 50%;
  }

  .box {
    box-sizing: border-box;
    min-width: 300px;
  }
}

.menue-leave-active {
  transition: all 0.3s ease-out;
}
.menue-enter-active {
  transition: all 0.3s ease-in;
}

.menue-enter-from,
.menue-leave-to {
  opacity: 0;
  transform: translateX(300px);
}
</style>
