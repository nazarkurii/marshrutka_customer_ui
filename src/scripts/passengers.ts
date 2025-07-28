import { useI18n } from 'vue-i18n'

export interface Passenger {
  type: 'Adult' | 'Teenager' | 'Child'
  firstName: string
  lastName: string
}
