<template>
  <FormStep :step="1" :name="t('connection.choosePassengers')">
    <div class="flex flex-col gap-[10px] mx-auto">
      <div class="flex gap-[10px] flex-col" v-for="(passenger, i) in ticket.passengers" :key="i">
        <div class="flex gap-[5px] text-white">
          <p>{{ i + 1 }}.</p>
          <p>{{ defineName(passenger.type) }}</p>
        </div>
        <div class="flex gap-[10px] column">
          <Input
            :input-bg="true"
            :invalid="ticket.firstTry ? false : !ticket.passengersValid[i].firstName"
            :name="t('authentication.singup.firstName')"
            type="text"
            v-model="ticket.passengers[i].firstName"
          />
          <Input
            :input-bg="true"
            :violated="false"
            :invalid="ticket.firstTry ? false : !ticket.passengersValid[i].lastName"
            :name="t('authentication.singup.lastName')"
            type="text"
            v-model="ticket.passengers[i].lastName"
          />
        </div>
      </div>
    </div>
  </FormStep>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FormStep from './utils/FormStep.vue'
import { useConnectionRequestStore } from '@/stores/search'
import Input from '@/components/utils/Input.vue'
import { useTicketStore } from '@/stores/ticket'
import { onBeforeMount } from 'vue'

const { t } = useI18n()

const ticket = useTicketStore()

function defineName(type: 'Adult' | 'Teenager' | 'Child'): string {
  if (type == 'Adult') {
    return t('connection.adult')
  } else if (type == 'Teenager') {
    return t('connection.teenager')
  } else if (type == 'Child') {
    return t('connection.child')
  } else {
    return ''
  }
}
</script>

<style scoped>
@media (max-width: 470px) {
  .column {
    flex-direction: column;
  }
}
</style>
