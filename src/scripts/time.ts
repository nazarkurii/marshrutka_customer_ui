import { useAppStore } from '@/stores/app'

export function getToday(): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function formatDateWithDay(dateStr: string, includeYear: boolean = true): string {
  const app = useAppStore()

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '' // invalid date guard

  const locales = {
    uk: 'uk-UA',
    en: 'en-US',
  }

  const local = app.language.value == 'uk' ? locales['uk'] : locales['en']

  const weekday = date.toLocaleString(local, { weekday: 'short' }) // e.g., "Mon" or "Пн"
  const month = date.toLocaleString(local as string, { month: 'short' }) // e.g., "Aug" or "серп."
  const day = date.getDate()
  const year = date.getFullYear()

  // Format result naturally per language
  return `${weekday}, ${day} ${month} ${includeYear ? `, ${year}` : ''}`
}

export function formatDate(dateStr: string, includeYear: boolean = true): string {
  const app = useAppStore()

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '' // invalid date guard

  const locales = {
    uk: 'uk-UA',
    en: 'en-US',
  }

  const local = app.language.value === 'uk' ? locales['uk'] : locales['en']

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return includeYear ? `${day}.${month}.${year}` : `${day}.${month}`
}
export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr)

  if (isNaN(date.getTime())) return '' // handle invalid dates

  return date.toDateString()
}

export function formatToDateLocal(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isOlderThan16Years(dateString: string): boolean {
  // Parse the input date (YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number)
  const inputDate = new Date(year, month - 1, day) // month is 0-based

  // Calculate the date 16 years ago from today
  const today = new Date()
  const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())

  // Compare
  return inputDate <= sixteenYearsAgo
}

export function isBeforeNow(utcTime: string): boolean {
  const time = new Date(utcTime)
  return time.getTime() < Date.now()
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date()
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
}

export function getNextMonthYear(month: number, year: number): { month: number; year: number } {
  if (month === 12) {
    return { month: 1, year: year + 1 }
  } else {
    return { month: month + 1, year }
  }
}

export function getPreviousMonthYear(month: number, year: number): { month: number; year: number } {
  if (month === 1) {
    return { month: 12, year: year - 1 }
  } else {
    return { month: month - 1, year }
  }
}

export function getDayNumberFromTime(time: string): number {
  const date = new Date(time)
  const jsDay = date.getDay() // 0 (Sunday) → 6 (Saturday)
  return jsDay === 0 ? 7 : jsDay // Convert to 1 (Monday) → 7 (Sunday)
}
