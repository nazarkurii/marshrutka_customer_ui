export interface Country {
  name: string
  flag: string
  code: string
  capital: string
  lat: number
  lng: number
  timezone: string
}

export const countries: Country[] = [
  {
    name: 'Ukraine',
    flag: '🇺🇦',
    code: 'ua',
    capital: 'Kyiv',
    lat: 50.4501,
    lng: 30.5234,
    timezone: 'Europe/Kiev',
  },
  {
    name: 'Poland',
    flag: '🇵🇱',
    code: 'pl',
    capital: 'Warsaw',
    lat: 52.2297,
    lng: 21.0122,
    timezone: 'Europe/Warsaw',
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    code: 'de',
    capital: 'Berlin',
    lat: 52.52,
    lng: 13.405,
    timezone: 'Europe/Berlin',
  },
  {
    name: 'Czechia',
    flag: '🇨🇿',
    code: 'cz',
    capital: 'Prague',
    lat: 50.0755,
    lng: 14.4378,
    timezone: 'Europe/Prague',
  },
  {
    name: 'Estonia',
    flag: '🇪🇪',
    code: 'ee',
    capital: 'Tallinn',
    lat: 59.437,
    lng: 24.7536,
    timezone: 'Europe/Tallinn',
  },
  {
    name: 'Latvia',
    flag: '🇱🇻',
    code: 'lv',
    capital: 'Riga',
    lat: 56.9496,
    lng: 24.1052,
    timezone: 'Europe/Riga',
  },
  {
    name: 'Lithuania',
    flag: '🇱🇹',
    code: 'lt',
    capital: 'Vilnius',
    lat: 54.6872,
    lng: 25.2797,
    timezone: 'Europe/Vilnius',
  },
  {
    name: 'Slovakia',
    flag: '🇸🇰',
    code: 'sk',
    capital: 'Bratislava',
    lat: 48.1486,
    lng: 17.1077,
    timezone: 'Europe/Bratislava',
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    code: 'hu',
    capital: 'Budapest',
    lat: 47.4979,
    lng: 19.0402,
    timezone: 'Europe/Budapest',
  },
]

// Utility to pad numbers
const pad = (n: number) => n.toString().padStart(2, '0')

// Get tomorrow’s local datetime for datetime-local input
export function getNowLocalTimeForCountry(countryName: string): string | null {
  const country = countries.find((c) => c.name === countryName)
  if (!country) return null

  const now = new Date()

  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: country.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = dtf.formatToParts(now)
  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value
  const hour = parts.find((p) => p.type === 'hour')?.value
  const minute = parts.find((p) => p.type === 'minute')?.value

  return year && month && day && hour && minute ? `${year}-${month}-${day}T${hour}:${minute}` : null
}

// Example: set input min dynamically

export function defineCountryByName(name: string): Country {
  return countries[countries.findIndex((country) => country.name == name)]
}

export function countryExists(name: string): boolean {
  return countries.findIndex((value) => value.name == name) != -1
}

export interface SearchResult {
  description: string
  city: string
  street: string
  houseNumber: string
  apartmentNumber: string
}
