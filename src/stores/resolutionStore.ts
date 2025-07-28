import { defineStore } from 'pinia'

export const useResolutionStore = defineStore('resolutionStore', {
  state: () =>
    <
      {
        width: number
        height: number
        fixed: boolean
      }
    >{ width: 0, height: 0, fixed: false },

  actions: {
    updateResolution() {
      this.width = window.innerWidth
      this.height = window.innerHeight
    },
    init() {
      window.addEventListener('resize', this.updateResolution)
      this.updateResolution()
    },

    fix() {
      this.fixed = true
    },

    unfix() {
      this.fixed = false
    },
  },
})
