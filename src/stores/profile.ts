import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    menueOpened: false,
  }),
  actions: {
    closeMenue() {
      this.menueOpened = false
    },
  },
})
