import { useAppStore } from '@/stores/app'
import { useRouter, type Router } from 'vue-router'
import { getSavedCurrency } from './currencies'
import { defineLanguage, getSavedLanguage, getSavedLanguageValue } from './languages'
import { useI18n } from 'vue-i18n'
import { useResolutionStore } from '@/stores/resolutionStore'
import { useCookies } from 'vue3-cookies'
import { loginWithToken } from './authentication'
import i18n from '@/i18n'
import { nextTick } from 'vue'
import { Problem } from './errors'

export async function startApp(router: Router): Promise<{ ok: boolean; err: unknown }> {
  const app = useAppStore()
  useResolutionStore().init()

  const ok = await app.testServer()
  if (!ok) {
    return { ok: false, err: undefined }
  }

  const language = getSavedLanguage()
  app.language = language
  localStorage.setItem('language', language.value)
  i18n.global.locale.value = app.language.value
  const { cookies } = useCookies()
  const token = cookies.get('token')

  if (token) {
    const result = await loginWithToken(token)
    if (result.ok) {
      app.login()
    } else {
      return result
    }
  }
  return { ok: true, err: undefined }
}
