import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { startApp } from './scripts/app'
import i18n from './i18n'
import axios from 'axios'
import { Problem } from './scripts/errors'

async function start() {
  const app = createApp(App)
  app.use(createPinia())

  app.use(i18n)
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

  const result = await startApp(router)
  app.use(router)
  if (!result.ok) {
    new Problem(result.err)
  }

  app.mount('#app')
}

start()
