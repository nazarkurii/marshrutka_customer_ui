<template>
  <transition name="content">
    <List v-if="!leaving" :empty-description="t('profile.tickets.empty')" :request="requestTickets">
      <Ticket
        v-for="(ticket, i) in tickets"
        :i="i"
        :connection="ticket.connection"
        :ticket="ticket.ticket"
        :expired="ticket.expired"
      ></Ticket>
    </List>
  </transition>
</template>

<script setup lang="ts">
import type { ConnectionFull } from '@/scripts/connections'
import { onBeforeMount, ref } from 'vue'
import List from './utils/List.vue'
import axios from 'axios'
import type { CustomerTicket } from '@/scripts/tickets'
import type { Link } from '@/scripts/request'
import { Problem } from '@/scripts/errors'
import { useI18n } from 'vue-i18n'
import Ticket from './tickets/Ticket.vue'
import { useAppStore } from '@/stores/app'
import { onBeforeRouteLeave } from 'vue-router'
import { useResolutionStore } from '@/stores/resolutionStore'

const { t } = useI18n()
const tickets = ref<CustomerTicket[]>([])
const resolution = useResolutionStore()
async function requestTickets(page: number): Promise<{ pages: number; error: Problem | null }> {
  try {
    const { data }: { data: { tickets: CustomerTicket[]; links: Link } } = await axios.get(
      '/tickets?size=4&page=' + page,
    )
    data.tickets.map((ticket) => {
      tickets.value.push(ticket)
    })

    console.log(tickets.value, data.tickets, data.links)
    return { pages: Object.keys(data.links).length, error: null }
  } catch (err) {
    const problem = new Problem(err)
    return { pages: 0, error: problem }
  } finally {
    setTimeout(() => {
      const app = useAppStore()
      if (resolution.height > 940) {
        app.footerON()
      }
    }, 300)
  }
}

const leaving = ref(false)
onBeforeRouteLeave((to, from, next) => {
  const app = useAppStore()
  app.footer = false
  next()
  setTimeout(() => {
    leaving.value = true
  }, 100)
})
</script>

<style scoped>
.content-leave-active {
  transition: all 0.1s ease-in;
}
.content-enter-active {
  transition: all 0.2s ease-in;
}

.content-leave-to,
.content-enter-from {
  scale: 0.9;
  opacity: 0;
}
</style>
