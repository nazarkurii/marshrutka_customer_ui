export interface Language {
  name: string
  abbreviation: string
  imagePath: string
  code: string
  value: any
}

export const english: Language = {
  name: 'English',
  abbreviation: 'EN',
  code: 'en',
  imagePath: '/english.svg',
  value: 'en',
}

export const ukrainian: Language = {
  name: 'Українська',
  abbreviation: 'UA',
  code: 'uk',
  imagePath: '/ukrainian.svg',
  value: 'uk',
}

export const languages: Language[] = [english, ukrainian]

export function getSavedLanguageValue(): 'en' | 'uk' {
  const language = localStorage.getItem('language')
  return language == 'en' || language == 'uk' ? language : 'en'
}

export function getSavedLanguage(): Language {
  return defineLanguage(getSavedLanguageValue())
}

export function defineLanguage(value: string): Language {
  const index = languages.findIndex((language) => language.value == value)
  if (index != -1) {
    return languages[index]
  }
  return english
}
