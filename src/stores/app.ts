import { english, type Language } from '@/scripts/languages'
import { eur, usd, type Currency } from '@/scripts/currencies'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { WritableComputedRef } from 'vue'
import { Problem } from '@/scripts/errors'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import type { User } from '@/scripts/user'
import Footer from '@/components/global/footer/Footer.vue'
import type {
  UnloggedinParcelSelectionAttempt,
  UnloggedinTicketSelectionAttemt,
} from '@/scripts/authentication'
import router from '@/router'

export const useAppStore = defineStore('app', {
  state: () =>
    <
      {
        loggedIn: boolean
        currency: Currency
        language: Language
        footer: boolean
        changingRoute: boolean
        repeatTestServerAtempt: boolean
      }
    >{
      loggedIn: false,
      currency: eur,
      language: english,
      footer: false,
      changingRoute: false,
      repeatTestServerAtempt: false,
    },

  actions: {
    login(fromAuth: boolean = false) {
      this.loggedIn = true
      if (fromAuth) {
        const { cookies } = useCookies()
        var transport = cookies.get(
          'unloggedinTicketSelectionAttemt',
        ) as null | UnloggedinTicketSelectionAttemt

        if (transport) {
          router.push({
            name: 'connection',
            params: {
              id: transport.connectionID,
              adults: transport.adults,
              children: transport.children,
              teenagers: transport.teenagers,
              retry: 'false',
            },
          })
          cookies.remove('unloggedinTicketSelectionAttemt')
          return
        }

        var parcel = cookies.get(
          'UnloggedinParcelSelectionAttempt',
        ) as null | UnloggedinParcelSelectionAttempt

        if (parcel) {
          router.push({
            name: 'parcelOrder',
            params: {
              connectionID: parcel.connectionID,
              width: parcel.width,
              height: parcel.height,
              length: parcel.length,
              weight: parcel.weight,
              type: parcel.type,
              retry: 'false',
            },
          })
          cookies.remove('UnloggedinParcelSelectionAttempt')
          return
        }

        router.push({ name: 'connections' })
      }
    },

    logout() {
      this.loggedIn = false
    },
    setLanguage(language: Language, locale: WritableComputedRef<string, string>) {
      axios.defaults.headers.common['Content-Language'] = language.abbreviation
      this.language = language
      localStorage.setItem('language', language.value)
      locale.value = language.value
    },

    setCurrency(currency: Currency) {
      this.currency = currency
      localStorage.setItem('currency', currency.value)
    },

    legalPolicyHref(): string {
      return import.meta.env.VITE_API_BASE_URL + '/legal-documents-' + this.language.value + '.pdf'
    },

    footerON() {
      this.footer = true
    },
    footerOFF() {
      this.footer = false
    },
    changeRoute() {
      this.changingRoute = true
      setTimeout(() => {
        this.changingRoute = false
      }, 600)
    },
    async testServer(): Promise<boolean> {
      try {
        await axios.get(import.meta.env.VITE_API_URL)
        return true
      } catch (err) {
        return false
      }
    },
  },
})
