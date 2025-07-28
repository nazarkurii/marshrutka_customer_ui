import router from '@/router'
import { Problem } from '@/scripts/errors'
import { getToday } from '@/scripts/time'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useConnectionRequestStore = defineStore('connectionsearch', {
  state: () => ({
    from: 'Ukraine',
    to: 'Poland',
    time: getToday(),
    passengers: {
      adults: 1,
      teenagers: 0,
      children: 0,
    },
  }),

  actions: {
    setPopular(country: string) {
      this.from = 'Ukraine'
      this.to = country
      this.search()
    },
    search() {
      router.push({
        name: 'connectionsResult',
        params: {
          from: this.from,
          to: this.to,
          date: this.time,
          adults: this.passengers.adults,
          children: this.passengers.children,
          teenagers: this.passengers.teenagers,
        },
      })
    },
  },
})
