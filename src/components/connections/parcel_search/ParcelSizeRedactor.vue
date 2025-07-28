<template>
  <!-- <transition name="redactor" appear> -->
  <div v-if="!leave" class="flex w-full maxwidth">
    <FormStep :step="1" :name="t('package.packageSize')">
      <div class="flex flex-col gap-[20px] mx-auto">
        <div
          class="flex relative input-bg p-[8px] gap-[5px] select-none rounded-xl w-full h-[66px]"
        >
          <div
            :style="{
              transform:
                parcel.type == 'package' ? 'translateX(0px)' : 'translateX(calc(100% + 5px))',
            }"
            class="flex w-[calc(50%-10px)] h-[50px] bg-white/10 z-0 transition-all duration-200 absolute rounded-xl top-[8px]"
          ></div>
          <div
            @click="parcel.choosePackage"
            class="cursor-pointer w-full my-auto hover:text-white h-full items-center hover:bg-white/10 rounded-xl transition-all duration-200 text-white/70 justify-center flex text-lg z-10"
          >
            {{ t('package.type.package') }}
          </div>
          <div
            @click="parcel.chooseDocuments"
            class="cursor-pointer w-full my-auto text-white/70 h-full items-center hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 justify-center flex text-lg z-10"
          >
            {{ t('package.type.documents') }}
          </div>
        </div>

        <div class="flex flex-col gap-[5px] relative">
          <div class="flex text-white/60 w-full justify-between">
            <p>{{ t('package.width') }}:</p>
            <p>max:1000</p>
          </div>
          <div class="flex gap-[5px]">
            <Input
              :input-bg="true"
              v-model="parcel.width"
              :invalid="parcel.validation.width"
              name="0"
              :text-center="true"
              :available="parcel.type != 'documents'"
              :is-numeric="true"
            />
            <p
              class="input-bg text-white/60 text-xl rounded-xl justify-center items-center flex pb-[1px] pr-[1px] font-bold h-[55px] w-[70px]"
            >
              {{ t('cm') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-[5px]">
          <div class="flex text-white/60 w-full justify-between">
            <p>{{ t('package.length') }}:</p>
            <p>max:1000</p>
          </div>
          <div class="flex gap-[5px]">
            <Input
              :input-bg="true"
              v-model="parcel.length"
              name="0"
              :invalid="parcel.validation.length"
              :text-center="true"
              :available="parcel.type != 'documents'"
              :is-numeric="true"
            />
            <p
              class="input-bg text-white/60 text-xl rounded-xl justify-center items-center flex pb-[1px] pr-[1px] font-bold h-[55px] w-[70px]"
            >
              {{ t('cm') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-[5px]">
          <div class="flex text-white/60 w-full justify-between">
            <p>{{ t('package.height') }}:</p>
            <p>max:1000</p>
          </div>
          <div class="flex gap-[5px]">
            <Input
              :input-bg="true"
              v-model="parcel.height"
              :invalid="parcel.validation.height"
              name="0"
              :text-center="true"
              :available="parcel.type != 'documents'"
              :is-numeric="true"
            />
            <p
              class="input-bg text-white/60 text-xl rounded-xl justify-center items-center flex pb-[1px] pr-[1px] font-bold h-[55px] w-[70px]"
            >
              {{ t('cm') }}
            </p>
          </div>
        </div>
        <p class="bg-white/10 h-[1px] w-full absolute bottom-[100px] left-0"></p>
        <div class="flex flex-col gap-[5px]">
          <div class="flex text-white/60 w-full justify-between">
            <p>{{ t('package.weight') }}:</p>
            <p>max:50000</p>
          </div>
          <div class="flex gap-[5px]">
            <Input
              :input-bg="true"
              v-model="parcel.weight"
              :invalid="parcel.validation.weight"
              name="0"
              :text-center="true"
              :available="parcel.type != 'documents'"
              :is-numeric="true"
            />
            <p
              class="input-bg text-white/60 text-xl rounded-xl justify-center items-center flex pb-[1px] pr-[1px] font-bold h-[55px] w-[70px]"
            >
              {{ t('g') }}
            </p>
          </div>
        </div>
      </div>
    </FormStep>
  </div>
  <!-- </transition> -->
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import FormStep from '../connection/form/utils/FormStep.vue'
import Input from '@/components/utils/Input.vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useParcelStore } from '@/stores/parcel'
import { useAppStore } from '@/stores/app'
import { useResolutionStore } from '@/stores/resolutionStore'

const parcel = useParcelStore()

const { t } = useI18n()

const leave = ref(false)
onBeforeRouteLeave(() => {
  leave.value = true
})

const resolution = useResolutionStore()
const app = useAppStore()
onMounted(async () => {
  const container = document.getElementById('appContainer')

  container?.scrollTo({
    top: container.scrollHeight, // scrolls to the very bottom
    behavior: 'smooth', // smooth animation
  })
})
</script>

<style scoped>
.textsize {
  font-size: clamp(17px, 4vw, 25px);
}

.redactor-enter-from,
.redactor-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.package-enter-from,
.package-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.package-enter-active,
.package-leave-active,
.redactor-enter-active,
.redactor-leave-active {
  transition: all 0.2s ease-in;
}

.con {
  flex-direction: column-reverse;
  gap: 100px;
}

@media (min-width: 770px) {
  .con {
    flex-direction: row;
  }

  .maxwidth {
    max-width: 360px;
  }
}

.maxwidth {
  max-width: 100%;
}
</style>
