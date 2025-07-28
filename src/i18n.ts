import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json' assert { type: 'json' }
import uk from '@/locales/uk.json' assert { type: 'json' }

const messages = {
  en: (en as any).default ?? en,
  uk: (uk as any).default ?? uk,
}

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages,
})
