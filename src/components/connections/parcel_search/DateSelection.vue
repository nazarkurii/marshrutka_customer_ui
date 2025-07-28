<template>
  <div
    v-if="!leave"
    :class="{
      ' min-w-[400px] ': resolution.width > 750,
    }"
    class="flexflex-col gap-[10px] 0 size-full"
  >
    <FormStep :name="t('package.chooseDate')" :step="2">
      <div class="flex w-full select-none h-full flex-col">
        <div class="flex textSize flex-col min-h-[470px] w-full">
          <div class="flex h-[50px] mb-[20px]">
            <transition apper name="month">
              <div
                v-if="!parcel.calendarError && !parcel.reqesting"
                class="flex h-[50px] gap-[10px] input-bg w-full font-bold justify-center items-center text-white rounded-xl"
              >
                <p>
                  {{ monthName }}
                </p>
                <p>
                  {{ parcel.response.year }}
                </p>
              </div>
            </transition>
          </div>

          <transition appear mode="out-in" name="loader">
            <Loader v-if="parcel.reqesting" />
            <div
              v-else-if="parcel.calendarError"
              class="m-auto flex gap-[10px] flex-col items-center"
            >
              <img class="size-[100px] rounded-full" src="/crying-face.webp" alt="" />
              <p class="text-white font-bold text-lg">{{ t('package.dateError') }}</p>
            </div>
            <Calendar v-else />
          </transition>
          <div class="flex w-full gap-[10px] mt-auto">
            <ActiveButton
              @click="
                () => {
                  if (
                    current.year >= parcel.response.year
                      ? current.month < parcel.response.month
                      : true
                  ) {
                    const date = getPreviousMonthYear(parcel.response.month, parcel.response.year)
                    parcel.search(
                      String(route.params.from),
                      String(route.params.to),
                      date.year,
                      date.month,
                    )
                  }
                }
              "
              :active="
                current.year >= parcel.response.year ? current.month < parcel.response.month : true
              "
              :name="t('backward')"
            />
            <ActiveButton
              @click="
                () => {
                  if (!parcel.calendarError) {
                    const date = getNextMonthYear(parcel.response.month, parcel.response.year)
                    parcel.search(
                      String(route.params.from),
                      String(route.params.to),
                      date.year,
                      date.month,
                    )
                  }
                }
              "
              :active="!parcel.calendarError"
              :name="t('forward')"
            />
          </div>
        </div>
      </div>
    </FormStep>
  </div>
</template>

<script setup lang="ts">
import { getCurrentMonthYear, getNextMonthYear, getPreviousMonthYear } from '@/scripts/time'
import { useAppStore } from '@/stores/app'
import { useParcelStore } from '@/stores/parcel'
import { computed, onBeforeMount, onMounted, reactive, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import FormStep from '../connection/form/utils/FormStep.vue'
import Loader from '@/components/utils/Loader.vue'
import ActiveButton from '@/components/global/utils/ActiveButton.vue'
import { useResolutionStore } from '@/stores/resolutionStore'
import Calendar from './Calendar.vue'

const parcel = useParcelStore()
const route = useRoute()
const current = reactive(getCurrentMonthYear())

onMounted(() => {
  parcel.search(String(route.params.from), String(route.params.to), current.year, current.month)
  parcel.width = Number(route.params.width)
  parcel.length = Number(route.params.length)
  parcel.height = Number(route.params.height)
  parcel.weight = Number(route.params.weight)
  parcel.type = route.params.type as 'package' | 'documents'
})
const resolution = useResolutionStore()

const { t } = useI18n()

const leave = ref(false)
onBeforeRouteLeave(() => {
  leave.value = true
})

const monthName = computed(() => {
  return t('months.' + parcel.response.month)
})

const app = useAppStore()
onMounted(async () => {
  const container = document.getElementById('appContainer')

  container?.scrollTo({
    top: container.scrollHeight, // scrolls to the very bottom
    behavior: 'smooth', // smooth animation
  })
})

watchEffect(() => {
  parcel.search(String(route.params.from), String(route.params.to), current.year, current.month)
  parcel.width = Number(route.params.width)
  parcel.length = Number(route.params.length)
  parcel.height = Number(route.params.height)
  parcel.weight = Number(route.params.weight)
  parcel.type = route.params.type as 'package' | 'documents'
})
</script>

<style lang="scss" scoped>
.loader-leave-to,
.loader-enter-from {
  opacity: 0;
}

.month-leave-to,
.month-enter-from {
  opacity: 0;
  transform: translateY(-100px);
}

.discription-leave-to,
.discription-enter-from {
  opacity: 0;
  transform: translateY(50px);
  scale: 0;
}

.month-leave-active,
.month-enter-active,
.loader-leave-active,
.loader-enter-active {
  transition: all 0.2s ease-in;
}

.textSize {
  font-size: clamp(13px, 4vw, 17px);
}
</style>
