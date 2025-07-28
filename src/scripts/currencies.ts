import { inject } from 'vue'
import { type VueCookies } from 'vue-cookies'

export interface Currency {
  name: string
  abbreviation: string
  value: string
}

export const usd = {
  name: 'US Dollar',
  abbreviation: 'USD',
  value: 'usd',
}

export const uah = {
  name: 'Гривня',
  abbreviation: 'UAH',
  value: 'uah',
}

export const eur = {
  name: 'Euro',
  abbreviation: 'EUR',
  value: 'eur',
}

export const pln = {
  name: 'Złoty',
  abbreviation: 'PLN',
  value: 'pln',
}

export const currencies: Currency[] = [eur]

export function setCurrencyCookies(currency: Currency) {
  localStorage.setItem('currency', JSON.stringify(currency))
}

export function getSavedCurrencyValue(): string {
  const currency = localStorage.getItem('currency')
  return currency ? currency : usd.value
}

export function getSavedCurrency(): Currency {
  return defineCurrency(getSavedCurrencyValue())
}

export function defineCurrency(value: string): Currency {
  const index = currencies.findIndex((currency) => currency.value == value)
  if (index != -1) {
    return currencies[index]
  }
  return usd
}
